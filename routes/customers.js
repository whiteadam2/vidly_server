const express = require("express");
const router = express.Router();
const { validation, Customer } = require("../models/customer");
const auth = require("../middleware/auth");

//Get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

//Get customer by Id
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send(`Dont have customer with id ${req.params.id}`);
  res.send(customer);
});

//Add new customer
router.post("/", auth, async (req, res) => {
  const result = validation(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const newCustomer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  await newCustomer.save();
  res.send(newCustomer);
});

//Update current customer
router.put("/:id", auth, async (req, res) => {
  const result = validation(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send(`Dont have customer with id ${req.params.id}`);

  customer.set({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  await customer.save();
  res.send(customer);
});

//Delete customer
router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res.status(404).send(`Dont have customer with id ${req.params.id}`);

  res.send(customer);
});

module.exports = router;
