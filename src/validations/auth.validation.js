const Joi = require('@hapi/joi');
// const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: [Joi.string().optional().email(), Joi.allow(null)],
    password: [Joi.string().optional(), Joi.allow(null)],
    firstName: [Joi.string().optional(), Joi.allow(null)],
    lastName: [Joi.string().optional(), Joi.allow(null)],
    role: Joi.string().required(),
    mobileNo: [Joi.string().optional(), Joi.allow(null)],
    deviceToken: [Joi.string().optional(), Joi.allow(null)],
    facebookLoginId: [Joi.string().optional(), Joi.allow(null)],
    googleLoginId: [Joi.string().optional(), Joi.allow(null)],
    appleLoginId: [Joi.string().optional(), Joi.allow(null)],
    linkedInLoginId: [Joi.string().optional(), Joi.allow(null)],
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    deviceToken: [Joi.string().optional(), Joi.allow(null)],
  }),
};

const socialLogin = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    facebookLoginId: [Joi.string().optional(), Joi.allow(null)],
    googleLoginId: [Joi.string().optional(), Joi.allow(null)],
    appleLoginId: [Joi.string().optional(), Joi.allow(null)],
    linkedInLoginId: [Joi.string().optional(), Joi.allow(null)],
    deviceToken: [Joi.string().optional(), Joi.allow(null)],
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  socialLogin,
};
