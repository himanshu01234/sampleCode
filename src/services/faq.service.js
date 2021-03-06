const httpStatus = require('http-status');
const { Faq } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get Faq by id
 * @param {ObjectId} id
 * @returns {Promise<Faq>}
 */
const getFaqById = async (id) => {
  return Faq.findById(id);
};

/**
 * @returns {Promise<Faq>}
 */
const getFaqs = async (id) => {
  return Faq.find();
};

/**
 * Update Faq
 * @param {ObjectId} faqId
 * @returns {Promise<Faq>}
 */
const updateFaqById = async (faqId, updateBody) => {
  const faq = await Faq.findOneAndUpdate({ _id: faqId }, { $set: updateBody }, { new: true });
  if (!faq) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faq not found');
  }
  return faq;
};

const deleteFaqById = async (faqId) => {
  const Faq = await getFaqById(faqId);
  if (!Faq) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faq not found');
  }
  await Faq.remove();
  return Faq;
};

const createFaq = async (faqBody) => {
  const FaqData = await Faq.create(faqBody);
  return FaqData;
};

module.exports = {
  createFaq,
  getFaqById,
  getFaqs,
  updateFaqById,
  deleteFaqById,
};
