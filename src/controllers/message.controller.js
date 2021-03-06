const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { messageService, notificationService } = require('../services');

const sendMessage = catchAsync(async (req, res) => {
  let { senderId, receiverId, message, messageType } = req.body;
  let messageData = await messageService.updateSendMessageDetails(req.body);
  if (!messageData) {
    req.body.participants = [senderId, receiverId];
    req.body.conversation = [
      {
        senderId: senderId,
        receiverId: receiverId,
        message: message,
        messageType: messageType,
      },
    ];
    messageData = await messageService.saveMessage(req.body);
    messageData = await messageService.getMessageDetails(req.body);
    let obj = messageData;
    obj.conversation = messageData.conversation[0];
    res.send({ code: 200, message: 'Message sent', data: obj });
    let notiBody = {
      notificationTitle: `New Message from ${messageData.conversation[0].senderId.firstName} ${messageData.conversation[0].senderId.lastName}`,
      notificationType: 'Message',
      senderId: senderId,
      receiverId: receiverId,
      deviceToken: messageData.conversation[0].receiverId.deviceToken,
      messageId: messageData._id,
    };
    await notificationService.createNotification(notiBody);
    await notificationService.sendNotification({
      message: `New Message from ${messageData.conversation[0].senderId.firstName} ${messageData.conversation[0].senderId.lastName}`,
      token: messageData.conversation[0].receiverId.deviceToken,
      type: 'message',
      messageId: messageData._id.toString(),
      userId: messageData.conversation[0].senderId._id,
    });
  } else {
    let obj = messageData;
    obj.conversation = messageData.conversation[messageData.conversation.length - 1];
    res.send({ code: 200, message: 'Message sent', data: obj });
    let notiBody = {
      notificationTitle: `New Message from ${messageData.conversation[0].senderId.firstName} ${messageData.conversation[0].senderId.lastName}`,
      notificationType: 'Message',
      senderId: senderId,
      receiverId: receiverId,
      deviceToken: messageData.conversation[messageData.conversation.length - 1].receiverId.deviceToken,
      messageId: messageData._id,
    };
    await notificationService.createNotification(notiBody);
    await notificationService.sendNotification({
      message: `New Message from ${messageData.conversation[0].senderId.firstName} ${messageData.conversation[0].senderId.lastName}`,
      type: 'message',
      messageId: messageData._id.toString(),
      token: messageData.conversation[messageData.conversation.length - 1].receiverId.deviceToken,
      userId: messageData.conversation[0].senderId._id.toString(),
    });
  }
});

const deleteMessage = catchAsync(async (req, res) => {
  let userId = req.user._id;
  let { messageId } = req.params;
  console.log(userId, messageId);
  let data = await messageService.deleteMessage(messageId, userId);
  res.send({ code: 200, message: 'Message deleted', data: data });
});

const viewMessage = catchAsync(async (req, res) => {
  let { messageId } = req.query;
  let userId = req.user._id;
  console.log(messageId, userId);
  await messageService.updateViewMessage(messageId, userId);
  let messageData = await messageService.viewMessage(messageId);
  res.send({ code: 200, message: 'Message fetched', data: messageData });
});

const messageList = catchAsync(async (req, res) => {
  let userId = req.user._id;
  let messageList = await messageService.messageList(userId);
  const notificationCount = await notificationService.notificationCount(req.user._id);
  res.send({ code: 200, message: 'Message List fetched', data: messageList, notificationCount: notificationCount });
});

const deleteChat = catchAsync(async (req, res) => {
  const { chatId } = req.query;
  await messageService.deleteChat(chatId);
  res.send({ code: 200, message: 'Chat deleted' });
});

const getChat = catchAsync(async (req, res) => {
  let chatData = await messageService.getMessageDetails(req.body);
  if (chatData) await messageService.updateViewMessage(chatData._id, req.body.senderId);
  return res.send({ code: 200, message: 'Chat fetched', data: chatData });
});

const searchingChat = catchAsync(async (req, res) => {
  let messageList = await messageService.searchChat(req.user._id, req.query.searchBody);
  res.send({ code: 200, message: 'Message List fetched', data: messageList });
});

module.exports = {
  sendMessage,
  deleteMessage,
  viewMessage,
  messageList,
  deleteChat,
  getChat,
  searchingChat,
};
