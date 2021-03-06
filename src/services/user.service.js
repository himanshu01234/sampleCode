const httpStatus = require('http-status');
const { User, Service } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    if (userBody.facebookLoginId || userBody.googleLoginId || userBody.appleLoginId || userBody.linkedInLoginId) {
      let user = await getUserByEmail(userBody.email);
      Object.assign(user, userBody);
      await user.save();
      return user;
    } else throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (userBody.facebookLoginId || userBody.googleLoginId || userBody.appleLoginId || userBody.linkedInLoginId) {
    userBody.emailVerified = true;
  }
  const user = await User.create(userBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  filter = { ...filter };
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsersForAdmin = async (filter) => {
  const users = await User.find(filter).sort({ createdAt: -1 });
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email: email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const updateUser = async (userId, updateBody) => {
  const user = await User.findByIdAndUpdate(userId, updateBody, { new: true });
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Admin Dashboard query
 * @returns {Promise<QueryResult>}
 */
const adminDashboard = async () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  today = new Date(today);
  today = today.toISOString();
  const userJoinsToday = await User.countDocuments({ createdAt: { $gte: today } });
  const activeUserCount = await User.countDocuments({ status: 'active', role: { $ne: 'admin' } });
  const blockUserCount = await User.countDocuments({ status: 'block', role: { $ne: 'admin' } });
  const serviceRequestToday = await Service.countDocuments({ createdAt: { $gte: today } });
  const serviceRequestCompleteToday = await Service.countDocuments({ status: 'completed', updatedAt: { $gte: today } });
  return { activeUserCount, blockUserCount, userJoinsToday, serviceRequestToday, serviceRequestCompleteToday };
};

/**
 * Update admin by id
 * @param {ObjectId} adminId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateAdminById = async (adminId, updateBody) => {
  const user = await getUserById(adminId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, adminId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const getUserDeviceToken = async (filter) => {
  return await User.find(filter, { deviceToken: 1, notificationPreference: 1, genericNotification: 1 });
};

const getUsersName = async () => {
  return await User.find({ role: 'user', status: 'active', emailVerified: true }, { firstName: 1, lastName: 1 });
};

const getUserByAppleLoginId = async (id) => {
  return await User.findOne({ appleLoginId: id, role: 'user', status: 'active', emailVerified: true });
};

const updateUserByStripeAccountId = async (body) => {
  if (body.data.object.charges_enabled === true && body.data.object.requirements.currently_due.length === 0) {
    await User.findOneAndUpdate({ stripeAccountId: body.data.object.id }, { accountVerified: true });
  }
};
module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  adminDashboard,
  updateAdminById,
  updateUser,
  getUsersName,
  queryUsersForAdmin,
  getUserByAppleLoginId,
  getUserDeviceToken,
  updateUserByStripeAccountId,
};
