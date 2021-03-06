const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { howItWorksService } = require('../services');

const getHowItWorksForUser = catchAsync(async (req, res) => {
  const result = await howItWorksService.getHowItWorksForUser();
  res.send({ code: 200, message: 'HowItWorks fetched', data: result });
});

const getHowItWorksById = catchAsync(async (req, res) => {
  const result = await howItWorksService.getHowItWorksById(req.params.howItWorksId);
  res.send({ code: 200, message: 'HowItWorks fetched', data: result });
});

const getHowItWorks = catchAsync(async (req, res) => {
  const result = await howItWorksService.getHowItWorks();
  res.send({ code: 200, message: 'HowItWorks fetched', data: result });
});

const updateHowItWorks = catchAsync(async (req, res) => {
  const result = await howItWorksService.updateHowItWorksById(req.body.id, req.body);
  res.send({ code: 200, message: 'HowItWorks updated', data: result });
});

const deleteHowItWorks = catchAsync(async (req, res) => {
  await howItWorksService.deleteHowItWorksById(req.params.howItWorksId);
  res.send({ code: 200, message: 'HowItWorks Deleted' });
});

const create = catchAsync(async (req, res) => {
  const HowItWorks = await howItWorksService.createHowItWorks(req.body);
  res.send({ code: 200, message: 'HowItWorks created', data: HowItWorks });
});

module.exports = {
  create,
  getHowItWorks,
  getHowItWorksById,
  getHowItWorksForUser,
  updateHowItWorks,
  deleteHowItWorks,
};
