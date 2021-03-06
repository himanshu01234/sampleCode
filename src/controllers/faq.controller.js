const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { faqService } = require('../services');

const getFaqById = catchAsync(async (req, res) => {
  const result = await faqService.getFaqById(req.params.faqId);
  res.send({ code: 200, message: 'Faq fetched', data: result });
});

const getFaqs = catchAsync(async (req, res) => {
  const result = await faqService.getFaqs();
  res.send({ code: 200, message: 'Faq fetched', data: result });
});

const updateFaq = catchAsync(async (req, res) => {
  const result = await faqService.updateFaqById(req.body.id, req.body);
  res.send({ code: 200, message: 'Faq updated', data: result });
});

const deleteFaq = catchAsync(async (req, res) => {
  await faqService.deleteFaqById(req.params.faqId);
  res.send({ code: 200, message: 'Faq Deleted' });
});

const create = catchAsync(async (req, res) => {
  const Faq = await faqService.createFaq(req.body);
  res.send({ code: 200, message: 'Faq created', data: Faq });
});

module.exports = {
  create,
  getFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};
