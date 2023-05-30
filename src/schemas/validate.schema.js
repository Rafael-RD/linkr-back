import Joi from "joi";

export const publishSchema = Joi.object({
    description: Joi.string().allow("").required(),
    link: Joi.string().uri().required(),
    tags: Joi.string().required()
  });