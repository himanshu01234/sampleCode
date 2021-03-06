const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { Schema } = mongoose;
const howItWorksSchema = new Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    file: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const howItWorks = mongoose.model('howItWorks', howItWorksSchema);
module.exports = howItWorks;
