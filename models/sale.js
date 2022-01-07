const Joi = require('joi');
function validate(bean) {
  const schema = Joi.object({
    userName: Joi.string().required().label("User Name"),
    amount: Joi.number().required().label("Amount"),
    date: Joi.date().required().label("Date"),
  });
  return schema.validate(bean);
}
exports.validate = validate;