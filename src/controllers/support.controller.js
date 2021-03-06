const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { supportService, emailService, userService } = require('../services');

const createSupport = catchAsync(async (req, res) => {
  req.body.userId = req.user._id;
  const support = await supportService.createSupport(req.body);
  res.send({ code: 200, message: 'Sent successfully', data: support });
});

const getSupports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'startDate', 'endDate']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await supportService.querySupports(filter, options);
  res.send({ code: 200, message: 'Supports type list fetched', data: result });
});

const getSupport = catchAsync(async (req, res) => {
  const support = await supportService.getSupportById(req.params.supportId);
  if (!support) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Support not found');
  }
  res.send({ code: 200, message: 'Support fetched', data: support });
});

const deleteSupport = catchAsync(async (req, res) => {
  await supportService.deleteSupportById(req.params.supportId);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendMail = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.body.userId);
  const subject = 'Admin reply ';
  emailService.sendEmail(user.email, subject, req.body.text);
  res.send({ code: 200, message: 'Mail sent' });
});

module.exports = {
  createSupport,
  getSupports,
  getSupport,
  deleteSupport,
  sendMail,
};
