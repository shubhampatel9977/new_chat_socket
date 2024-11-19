const Joi = require('joi');

const idValidationSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = idValidationSchema;