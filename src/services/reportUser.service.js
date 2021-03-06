const httpStatus = require('http-status');
const { ReportUser } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<ReportUser>}
 */
const saveReportUser = async (body) => {
  const user = await ReportUser.create(body);
  return user;
};

/**
 * Query for report user
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReportUsers = async (filter) => {
  const users = await ReportUser.find(filter)
    .populate([
      {
        path: 'reportTo',
        select: 'firstName lastName email profileImage',
      },
      {
        path: 'reportBy',
        select: 'firstName lastName email',
      },
    ])
    .sort({ createdAt: -1 });
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getReportUserById = async (id) => {
  return await ReportUser.findOne({ _id: id }).populate([
    {
      path: 'reportTo',
      select: 'firstName lastName email',
    },
    {
      path: 'reportBy',
      select: 'firstName lastName email',
    },
  ]);
};

/**
 * Delete report user by id
 * @param {ObjectId} reportUserId
 * @returns {Promise<ReportUser>}
 */
const deleteReportUserById = async (reportUserId) => {
  const user = await getUserById(reportUserId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await ReportUser.remove();
  return user;
};

module.exports = {
  saveReportUser,
  queryReportUsers,
  getReportUserById,
  deleteReportUserById,
};
