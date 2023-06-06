import Joi from "joi";

export const commentSchema = Joi.object({
  content: Joi.string().max(255).required(),
});
