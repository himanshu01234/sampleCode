const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, attachments) => {
  const msg = { from: config.email.from, to, subject, text, attachments: attachments };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://sametime-agent.clixlogix.org/resetpassword?token=${token}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendVerifyEmail = async (to, token, id) => {
  const subject = 'Email verification';
  var text = `Hi ${to.firstName}, Please click the link to verify your email- http://66.175.217.67:4000/v1/auth/emailVerify?emailToken=${token}&userId=${to.id}`;
  await sendEmail(to.email, subject, text);
};

const sendInvoiceMail = async (to, attachments) => {
  let adminEmail = 'sametime@gmail.com';
  const subject = `Same-time Agent Service Invoice`;
  const text = `Thank you for using Same-time agent app . Please see your invoice attached.`;
  await sendEmail(`${to.firstName} ${to.lastName} <${adminEmail}>`, subject, text, attachments);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerifyEmail,
  sendInvoiceMail,
};
