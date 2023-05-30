import Joi from "joi";

export const publishSchema = Joi.object({
    userId: Joi.number().required(),
    description: Joi.string().allow("").required(),
    link: Joi.string().uri().required()
  });