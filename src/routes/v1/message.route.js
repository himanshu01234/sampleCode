const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notificationValidation = require('../../validations/notification.validation');
const messageController = require('../../controllers/message.controller');

const router = express.Router();

router.post('/sendMessage', messageController.sendMessage);

router.delete('/deleteMessage/:messageId', auth('getUsers'), messageController.deleteMessage);

router.get('/viewMessage', auth('getUsers'), messageController.viewMessage);

router.get('/messageList', auth('getUsers'), messageController.messageList);

router.delete('/deleteChat', messageController.deleteChat);

router.post('/getChat', messageController.getChat);

router.get('/searchChat', auth('getUsers'), messageController.searchingChat);

module.exports = router;
