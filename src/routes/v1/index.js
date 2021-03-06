const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const adminRoute = require('./admin.route');
const notificationRoute = require('./notification.route');
const serviceRoute = require('./service.route');
const ratingRoute = require('./rating.route');
const supportRoute = require('./support.route');
const messageRoute = require('./message.route');
const paymentRoute = require('./payment.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/docs', docsRoute);
router.use('/admin', adminRoute);
router.use('/notification', notificationRoute);
router.use('/service', serviceRoute);
router.use('/rating', ratingRoute);
router.use('/support', supportRoute);
router.use('/message', messageRoute);
router.use('/payment', paymentRoute);

module.exports = router;
