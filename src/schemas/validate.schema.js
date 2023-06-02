import Joi from "joi";

export const publishSchema = Joi.object({
    description: Joi.string().allow("").required(),
    link: Joi.string().uri().required()
});


export const editPublishSchema = Joi.object({
    description: Joi.string().allow("").required(),
    postId: Joi.number().integer()
});

export const deletePublishSchema = Joi.object({
    postId: Joi.number().integer()
});

export const searchSchema = Joi.object({
    search: Joi.string().required()
  });


