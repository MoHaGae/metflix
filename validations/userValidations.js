const Joi = require("joi");

const loginBodySchema = Joi.object({
    id: Joi.string().required().trim(),
    password: Joi.string().required().trim(),
});

const joinBodySchema = loginBodySchema.keys({
    nickname: Joi.string().required().trim(),
});

module.exports = {
    loginBodySchema,
    joinBodySchema
}