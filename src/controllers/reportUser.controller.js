const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reportUserService } = require('../services');

const saveReportUser = catchAsync(async (req, res) => {
  const user = await reportUserService.saveReportUser(req.body);
  res.send({ code: 200, message: 'Reported user saved' });
});

const getReportUsers = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['name', 'email']);
  const result = await reportUserService.queryReportUsers(filter);
  res.send({ code: 200, message: 'Report Users list fetched', data: result });
});

const getReportUser = catchAsync(async (req, res) => {
  const user = await reportUserService.getReportUserById(req.params.reportUserId);
  res.send({ code: 200, message: 'User fetched', data: user });
});

const deleteReportUser = catchAsync(async (req, res) => {
  await reportUserService.deleteReportUserById(req.params.reportUserId);
  res.status(httpStatus.OK).send({ code: 200, message: 'User deleted successfully' });
});

module.exports = {
  saveReportUser,
  getReportUsers,
  getReportUser,
  deleteReportUser,
};
