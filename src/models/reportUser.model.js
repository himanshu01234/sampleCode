const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const reportUserSchema = mongoose.Schema(
  {
    reportTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    reportBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

reportUserSchema.plugin(toJSON);
reportUserSchema.plugin(paginate);

/**
 * @typedef ReportUser
 */

const ReportUser = mongoose.model('ReportUser', reportUserSchema);
module.exports = ReportUser;
