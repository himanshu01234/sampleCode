const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoosePaginate = require('mongoose-paginate');
const { Schema } = mongoose;
const supportSchema = new Schema(
  {
    reason: { type: String },
    text: { type: String },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

supportSchema.plugin(toJSON);
supportSchema.plugin(mongoosePaginate);

const support = mongoose.model('support', supportSchema);
module.exports = support;
