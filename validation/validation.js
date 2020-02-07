import { Joi } from 'celebrate';

const showObjectSchema = Joi.object()
  .keys({
    show_id: Joi.number()
      .integer()
      .required(),
    title: Joi.string()
      .trim()
      .regex(/^[a-zA-Z, ]*$/, 'Letters, space and comma characters')
      .min(2)
      .max(20)
      .required(),
    director: Joi.string()
      .trim()
      .min(2)
      .max(30)
      .required(),
    cast: Joi.string()
      .trim()
      .required(),
    country: Joi.string()
      .trim()
      .required(),
    date_added: Joi.string()
      .trim()
      .required(),
    release_year: Joi.number()
      .integer()
      .min(1900)
      .max(2020)
      .required(),
    rating: Joi.string()
      .trim()
      .required(),
    duration: Joi.string()
      .trim()
      .required(),
    listed_in: Joi.string()
      .trim()
      .required(),
    description: Joi.string()
      .trim()
      .required(),
    type: Joi.string()
      .trim()
      .required()
  })
  .options({ abortEarly: false });

const showQuerySchema = Joi.object()
  .keys({
    page: Joi.number()
      .integer()
      .min(0)
      .optional(),
    director: Joi.string().optional(),
    title: Joi.string().optional(),
    actor: Joi.string().optional(),
    country: Joi.string().optional(),
    year: Joi.number()
      .integer()
      .min(1900)
      .max(2020)
      .optional(),
    rating: Joi.string().optional(),
    duration: Joi.string().optional(),
    categories: Joi.string().optional(),
    description: Joi.string().optional(),
    type: Joi.string().optional()
  })
  .options({ abortEarly: false });

module.exports = {
  showObjectSchema,
  showQuerySchema
};
