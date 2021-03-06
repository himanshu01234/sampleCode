const httpStatus = require('http-status');
const { HowItWorks } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get HowItWorks by id
 * @param {ObjectId} id
 * @returns {Promise<HowItWorks>}
 */
const getHowItWorksById = async (id) => {
  return HowItWorks.findById(id);
};

/**
 * @returns {Promise<HowItWorks>}
 */
const getHowItWorks = async (id) => {
  return HowItWorks.find();
};

/**
 * Update HowItWorks
 * @param {ObjectId} howItWorksId
 * @returns {Promise<HowItWorks>}
 */
const updateHowItWorksById = async (howItWorksId, updateBody) => {
  const howItWorks = await HowItWorks.findOneAndUpdate({ _id: howItWorksId }, { $set: updateBody }, { new: true });
  if (!howItWorks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'HowItWorks not found');
  }
  return howItWorks;
};

const deleteHowItWorksById = async (howItWorksId) => {
  const HowItWorks = await getHowItWorksById(howItWorksId);
  if (!HowItWorks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'HowItWorks not found');
  }
  await HowItWorks.remove();
  return HowItWorks;
};

const createHowItWorks = async (howItWorksBody) => {
  let title = howItWorksBody.title;
  title = title[0].toUpperCase() + title.substring(1);
  let data = await HowItWorks.findOne({ title: title });
  if (data) throw new ApiError(httpStatus.ACCEPTED, 'Title already exist');
  howItWorksBody.title = title;
  const HowItWorksData = await HowItWorks.create(howItWorksBody);
  return HowItWorksData;
};

module.exports = {
  createHowItWorks,
  getHowItWorksById,
  getHowItWorks,
  updateHowItWorksById,
  deleteHowItWorksById,
};
