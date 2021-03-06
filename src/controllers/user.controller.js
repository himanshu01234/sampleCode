const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, ratingService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.send({ code: 200, message: 'User created', data: user });
});

const getUsers = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  filter = { ...filter, status: { $ne: 'deleted' } };
  const result = await userService.queryUsers(filter, options);
  res.send({ code: 200, message: 'User list fetched', data: result });
});

const getUsersForAdmin = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['role', 'status']);
  console.log(req.query.status);
  if (req.query.status === 'active') {
    filter = { ...filter, status: 'active' };
  } else if (req.query.status === 'block') {
    filter = { ...filter, status: 'block' };
  } else {
    filter = { ...filter, status: { $ne: 'deleted' } };
  }
  const result = await userService.queryUsersForAdmin(filter);
  res.send({ code: 200, message: 'User list fetched', data: result });
});

const getUser = catchAsync(async (req, res) => {
  if (!req.params.userId) {
    req.params.userId = req.user._id;
  }
  const user = await userService.getUserById(req.params.userId);
  const userRating = await ratingService.getUserRating(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send({ code: 200, message: 'User fetched', data: { user, userRating } });
});

const getAdminData = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send({ code: 200, message: 'User fetched', data: user });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send({ code: 200, message: 'User updated successfully', data: user });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.updateUserById(req.params.userId, { status: 'deleted' });
  res.status(httpStatus.OK).send({ code: 200, message: 'User deleted successfully' });
});

const adminDashboard = catchAsync(async (req, res) => {
  const user = await userService.adminDashboard();
  res.send({ code: 200, message: 'User list fetched', data: user });
});

const updateAdmin = catchAsync(async (req, res) => {
  const user = await userService.updateAdminById(req.user._id, req.body);

  res.send({ code: 200, message: 'Admin updated successfully', data: user });
});

const getUserForAdmin = catchAsync(async (req, res) => {
  if (!req.params.userId) {
    req.params.userId = req.user._id;
  }
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send({ code: 200, message: 'User fetched', data: user });
});

const getUserName = catchAsync(async (req, res) => {
  let users = await userService.getUsersName();
  let userArray = [];
  users.map((x) => {
    let data = {
      name: x.firstName + ' ' + x.lastName,
      _id: x.id,
    };
    userArray.push(data);
  });
  res.send({ code: 200, message: 'User fetched', data: userArray });
});

const logout = catchAsync(async (req, res) => {
  await userService.updateUserById(req.user._id, { deviceToken: '' });
  res.send({ code: 200, message: 'Logged out successfully' });
});

const updateUserByWebhooks = catchAsync(async (req, res) => {
  console.log(req.body);
  const user = await userService.updateUserByStripeAccountId(req.body);
  res.send({ code: 200, message: 'User updated successfully' });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  adminDashboard,
  getAdminData,
  updateAdmin,
  getUserForAdmin,
  getUserName,
  getUsersForAdmin,
  logout,
  updateUserByWebhooks,
};
