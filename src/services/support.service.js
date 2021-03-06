const httpStatus = require('http-status');
const { Support } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a support
 * @param {Object} supportBody
 * @returns {Promise<Support>}
 */
const createSupport = async (supportBody) => {
  const support = await Support.create(supportBody);
  return support;
};

/**
 * Query for support
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySupports = async (filter, option) => {
  options = {
    populate: { path: 'userId', select: 'firstName lastName email mobileNo' },
    limit: parseInt(option.limit),
    page: parseInt(option.page),
  };
  const support = await Support.find(filter)
    .populate({ path: 'userId', select: 'firstName lastName email mobileNo' })
    .sort({ createdAt: -1 });
  return support;
};

/**
 * Get support by id
 * @param {ObjectId} id
 * @returns {Promise<Support>}
 */
const getSupportById = async (id) => {
  return await Support.findById(id).populate('userId');
};

/**
 * Delete support by id
 * @param {ObjectId} supportId
 * @returns {Promise<Support>}
 */
const deleteSupportById = async (supportId) => {
  const support = await getSupportById(supportId);
  if (!support) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Support not found');
  }
  await support.remove();
  return support;
};

module.exports = {
  createSupport,
  querySupports,
  getSupportById,
  deleteSupportById,
};
