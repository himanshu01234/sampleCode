const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { termsAndConditionService } = require('../services');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const getTermsAndConditionForUser = catchAsync(async (req, res) => {
  const result = await termsAndConditionService.getTermsAndConditionForUser();
  res.send({ code: 200, message: 'Terms and condition fetched', data: result });
});

const getTermsAndConditionById = catchAsync(async (req, res) => {
  const result = await termsAndConditionService.getTermsAndConditionById(req.params.termsAndConditionId);
  res.send({ code: 200, message: 'Terms and condition fetched', data: result });
});

const getTermsAndCondition = catchAsync(async (req, res) => {
  const result = await termsAndConditionService.getTermsAndCondition();
  res.send({ code: 200, message: 'Terms and condition fetched', data: result });
});

const updateTermsAndCondition = catchAsync(async (req, res) => {
  req.body.text = entities.decode(req.body.text);
  const result = await termsAndConditionService.updateTermsAndConditionById(req.body.termsAndConditionId, req.body.text);
  res.send({ code: 200, message: 'Terms and condition updated', data: result });
});

module.exports = {
  getTermsAndCondition,
  getTermsAndConditionById,
  getTermsAndConditionForUser,
  updateTermsAndCondition,
};
