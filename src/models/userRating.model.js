const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { ratingType } = require('../config/ratingType');

const { Schema } = mongoose;

const userRatingSchema = new Schema({
  serviceId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Service',
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  agentType: {
    type: String,
    enum: ratingType,
  },
  review: {
    type: String,
  },
  tip: {
    type: String,
  },
  star: {
    type: Number,
  },
  rateBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
});

userRatingSchema.plugin(toJSON);
userRatingSchema.plugin(paginate);

/**
 * @typedef UserRating
 */

const UserRating = mongoose.model('UserRating', userRatingSchema);
module.exports = UserRating;
