import Joi from "joi";

export const publishSchema = Joi.object({
    description: Joi.string().allow("").required(),
    link: Joi.string().uri().required()
  });

export const searchSchema = Joi.object({
    search: Joi.string().required()
  });


