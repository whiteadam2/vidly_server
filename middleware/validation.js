module.exports = function validationMiddleware(routerValidation) {
  return (req, res, next) => {
    const result = routerValidation(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
    next();
  };
};
