const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { loginType } = require('../config/loginType');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    mobileNo: {
      type: String,
      default: '',
    },
    facebookLoginId: {
      type: String,
      default: '',
    },
    googleLoginId: {
      type: String,
      default: '',
    },
    appleLoginId: {
      type: String,
      default: '',
    },
    linkedInLoginId: {
      type: String,
      default: '',
    },
    loginType: {
      type: String,
      enum: loginType,
    },
    preferredLocation: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    skills: {
      type: Array,
    },
    genericNotification: {
      type: Boolean,
      default: true,
    },
    notificationPreference: {
      type: String,
      default: 'Push',
    },
    serviceId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Service',
    },
    isAvailableForHelp: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'block', 'deleted'],
      default: 'active',
    },
    profileImage: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: '',
    },
    dob: {
      type: String,
      default: '01-Jan-2000',
    },
    creaId: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    brokerageName: {
      type: String,
      default: '',
    },
    emailToken: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    branchAddress: {
      address: { type: String, default: '' },
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    deviceToken: {
      type: String,
      default: '',
    },
    stripeServiceAgreement: {
      type: Boolean,
      default: false,
    },
    stripeAccountId: {
      type: String,
      default: '',
    },
    stripeBankId: {
      type: String,
      default: '',
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId }, status: 'active' });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
