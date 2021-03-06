const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const employeeService = require('./adminEmployee.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { User, AdminEmployee } = require('../models');

/**
 *
 * @param {string} socialLoginId
 * @returns {Promise<User>}
 */

const loginUserWithFacebook = async (email, socialLoginId) => {
  const user = await User.findOne({ email: email, facebookLoginId: socialLoginId });
  return user;
};

/**
 *
 * @param {string} socialLoginId
 * @returns {Promise<User>}
 */

const loginUserWithGoogle = async (email, socialLoginId) => {
  const user = await User.findOne({ email: email, googleLoginId: socialLoginId });
  return user;
};

/**
 *
 * @param {string} socialLoginId
 * @returns {Promise<User>}
 */

const loginUserWithApple = async (email, socialLoginId) => {
  const user = await User.findOne({ email: email, appleLoginId: socialLoginId });
  return user;
};

/**
 *
 * @param {string} socialLoginId
 * @returns {Promise<User>}
 */

const loginUserWithLinkedIn = async (email, socialLoginId) => {
  const user = await User.findOne({ email: email, linkedInLoginId: socialLoginId });
  return user;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password, deviceToken) => {
  const user = await userService.getUserByEmail(email);

  if (user) {
    if (user.emailVerified === false) throw new ApiError(httpStatus.UNAUTHORIZED, 'Please verify your email');
    if (user.status === 'block') throw new ApiError(httpStatus.UNAUTHORIZED, 'You are blocked by the admin');
    if (!user.password) throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  await userService.updateUserById(user.id, { deviceToken: deviceToken });
  return user;
};

const loginAdminWithEmailAndPassword = async (email, password) => {
  const user = await AdminEmployee.findOne({ email: email, status: 'active' }).populate('employeeRole');
  console.log(user);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    await userService.updateUserById(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const resetPasswordForEmployees = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await employeeService.getAdminEmployeeById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    await employeeService.updateAdminById(user._id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const changePassword = async (userId, password, newPassword) => {
  try {
    const user = await userService.getUserById(userId);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new Error();
    }
    await userService.updateUserById(userId, { password: newPassword });
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect old password');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  loginAdminWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  loginUserWithFacebook,
  loginUserWithGoogle,
  loginUserWithApple,
  loginUserWithLinkedIn,
  changePassword,
  resetPasswordForEmployees,
};
