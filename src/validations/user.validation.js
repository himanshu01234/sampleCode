const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const createUserByAdmin = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobileNo: [Joi.string().optional(), Joi.allow(null)],
    location: [Joi.string().optional(), Joi.allow(null)],
    skills: [Joi.array().optional(), Joi.allow(null)],
    gender: [Joi.string().optional(), Joi.allow(null)],
    dob: [Joi.string().optional(), Joi.allow(null)],
    creaId: [Joi.string().optional(), Joi.allow(null)],
    experience: [Joi.string().optional(), Joi.allow(null)],
    designation: [Joi.string().optional(), Joi.allow(null)],
    brokerageName: [Joi.string().optional(), Joi.allow(null)],
    genericNotification: [Joi.boolean().optional(), Joi.allow(null)],
    notificationPreference: [Joi.string().optional(), Joi.allow(null)],
    preferredLocation: [Joi.string().optional(), Joi.allow(null)],
    branchAddress: [Joi.object(), Joi.allow(null)],
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    status: [Joi.string().optional(), Joi.allow(null)],
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  createUserByAdmin,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
