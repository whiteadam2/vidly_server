const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    phone: { type: Number },
    isGold: Boolean,
    discount: {
      type: Number,
      min: 0,
      max: 1,
      required: function () {
        return this.isGold;
      },
    },
  })
);

//Validation of adding new customer
function validation(customer) {
  const schema = {
    name: Joi.string().min(3).required(),
    phone: Joi.number(),
    isGold: Joi.boolean(),
    discount: Joi.number().min(0).max(1),
  };

  return Joi.validate(customer, schema);
}

module.exports.validation = validation;
module.exports.Customer = Customer;
