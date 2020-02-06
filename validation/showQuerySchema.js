import { Joi } from 'celebrate';

export const showQuerySchema = Joi.object()
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
