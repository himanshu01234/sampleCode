const httpStatus = require('http-status');
const { Message } = require('../models');
const ApiError = require('../utils/ApiError');

const updateSendMessageDetails = async (body) => {
  let { senderId, receiverId } = body;

  return await Message.findOneAndUpdate(
    { participants: { $all: [senderId, receiverId] } },
    { $push: { conversation: body } },
    { new: true }
  ).populate([
    {
      path: 'conversation.receiverId',
      select: 'firstName lastName deviceToken profileImage',
    },
    {
      path: 'conversation.senderId',
      select: 'firstName lastName profileImage',
    },
  ]);
};

const getMessageDetails = async (body) => {
  let { senderId, receiverId } = body;
  return await Message.findOne({ participants: { $all: [senderId, receiverId] } }).populate([
    {
      path: 'conversation.receiverId',
      select: 'firstName lastName deviceToken profileImage isAvailableForHelp',
    },
    {
      path: 'conversation.senderId',
      select: 'firstName lastName profileImage',
    },
  ]);
};

const saveMessage = async (body) => {
  let message = new Message(body);
  return await message.save();
};

const deleteMessage = async (messageId, userId) => {
  return await Message.findOneAndUpdate(
    { 'conversation._id': messageId },
    { 'conversation.$.deletedUserId': userId },
    { new: true }
  );
};

const viewMessage = async (messageId) => {
  return await Message.findOne({ _id: messageId }).populate([
    {
      path: 'conversation.receiverId',
      select: 'firstName lastName profileImage isAvailableForHelp',
    },
    {
      path: 'conversation.senderId',
      select: 'firstName lastName profileImage isAvailableForHelp',
    },
  ]);
};

const messageList = async (userId) => {
  let data = await Message.aggregate([
    { $match: { participants: { $in: [userId] } } },
    {
      $sort: {
        'conversation.createdAt': -1,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'conversation.receiverId',
        foreignField: '_id',
        as: 'receiverData',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'conversation.senderId',
        foreignField: '_id',
        as: 'senderData',
      },
    },
    {
      $unwind: '$receiverData',
    },
    {
      $match: {
        'receiverData._id': {
          $nin: [userId],
        },
      },
    },
    {
      $unwind: '$senderData',
    },
    {
      $match: {
        'senderData._id': {
          $eq: userId,
        },
      },
    },
  ]);
  // {
  //   $unwind: '$conversation',
  // },
  // {
  //   $sort: {
  //     'conversation.createdAt': -1,
  //   },
  // },
  // {
  //   $group: {
  //     _id: '$_id',
  //     messageData: {
  //       $push: {
  //         participants: '$participants',
  //         conversation: '$conversation',
  //         createdAt: '$createdAt',
  //         receiverData: '$receiverData',
  //         senderData: '$senderData',
  //       },
  //     },
  //   },
  // },
  // let finalArray = [];
  // data.map((x) => {
  //   let obj = {};
  //   let count = 0;
  //   x.messageData.map((y) => {
  //     obj = { ...y };
  //     conversation.push(y.conversation);
  //     if (y.conversation.isViewed === false) count++;
  //   });
  //   obj.conversation = conversation;
  //   obj.unReadMessage = count;
  //   finalArray.push(obj);
  // });
  let finalArray = [];
  if (data.length) {
    let j = 0;
    for (let i = 0; i < data.length; i++) {
      let temp_obj = { ...data[i] };
      let temp_conv_list = [];
      let count = 0;
      for (j = 0; j < data[i].conversation.length; j++) {
        if (data[i].conversation[j].isViewed === false) {
          count += 1;
        }
        temp_conv_list.push(data[i].conversation[j]);
      }
      temp_obj['unReadMessageCount'] = count;
      temp_obj['conversation'] = temp_conv_list;
      finalArray.push(temp_obj);
    }
  }

  // let j = 0;
  // for (let i = 0; i < data.length; i++) {
  //   let temp_obj = { _id: data[i]._id };
  //   let temp_conv_list = [];
  //   let count = 0;
  //   messages_array = data[i].messageData;
  //   for (j = 0; j < messages_array.length; j++) {
  //     if (messages_array[j].conversation.isViewed === false) {
  //       count += 1;
  //     }
  //     temp_obj = { ...temp_obj, ...messages_array[j] };

  //     temp_conv_list.push(messages_array[j].conversation);
  //   }
  //   temp_obj['unReadMessageCount'] = count;
  //   temp_obj['conversation'] = temp_conv_list;
  //   finalArray.push(temp_obj);
  // }

  return finalArray;

  // return await Message.find({ participants: { $in: [userId] } })
  //   .populate([
  //     {
  //       path: 'conversation.receiverId',
  //       select: 'firstName lastName profileImage',
  //     },
  //     {
  //       path: 'conversation.senderId',
  //       select: 'firstName lastName profileImage',
  //     },
  //   ])
  //   .sort({ 'conversation.createdAt': -1 });
};

const deleteChat = async (chatId) => {
  return await Message.findByIdAndDelete({ _id: chatId });
};

const updateViewMessage = async (messageId, userId) => {
  return await Message.update(
    { _id: messageId, 'conversation.senderId': userId },
    { $set: { 'conversation.$[].isViewed': true } },
    { multi: true }
  );
};

const searchChat = async (senderId, searchText) => {
  let aggregate = [];

  aggregate.push({ $match: { participants: { $in: [senderId] } } });
  aggregate.push({
    $sort: {
      'conversation.createdAt': -1,
    },
  });

  aggregate.push({
    $lookup: {
      from: 'users',
      localField: 'conversation.receiverId',
      foreignField: '_id',
      as: 'receiverData',
    },
  });
  aggregate.push({ $unwind: '$receiverData' });
  aggregate.push({ $match: { 'receiverData._id': { $nin: [senderId] } } });
  aggregate.push({
    $lookup: {
      from: 'users',
      localField: 'conversation.senderId',
      foreignField: '_id',
      as: 'senderData',
    },
  });

  aggregate.push({
    $unwind: '$senderData',
  });

  aggregate.push({
    $match: {
      'senderData._id': {
        $eq: senderId,
      },
    },
  });

  if (searchText) {
    var nameQuery = searchText,
      queryArr = nameQuery.split(' '),
      firstName,
      lastName;

    if (queryArr.length == 1) {
      firstName = queryArr[0];
      matchArtistData = {
        'receiverData.firstName': { $regex: firstName, $options: 'i' },
      };
    } else if (queryArr.length == 2) {
      firstName = queryArr[0];
      lastName = queryArr[1];
      matchArtistData.$or = [
        {
          $and: [
            {
              'receiverData.firstName': {
                $regex: firstName,
                $options: 'i',
              },
              'receiverData.lastName': {
                $regex: lastName,
                $options: 'i',
              },
            },
          ],
        },
        {
          $and: [
            {
              'receiverData.firstName': {
                $regex: lastName,
                $options: 'i',
              },
            },
            {
              'receiverData.lastName': {
                $regex: firstName,
                $options: 'i',
              },
            },
          ],
        },
      ];
    }

    aggregate.push({ $match: matchArtistData });
  }

  // aggregate.push({
  //   $unwind: '$conversation',
  // });
  // aggregate.push({
  //   $sort: {
  //     'conversation.createdAt': -1,
  //   },
  // });
  // aggregate.push({
  //   $group: {
  //     _id: '$_id',
  //     messageData: {
  //       $push: {
  //         participants: '$participants',
  //         conversation: '$conversation',
  //         createdAt: '$createdAt',
  //         receiverData: '$receiverData',
  //         senderData: '$senderData',
  //       },
  //     },
  //   },
  // });

  let data = await Message.aggregate(aggregate);

  console.log(JSON.stringify(data));

  let finalArray = [];
  if (data.length) {
    let j = 0;
    for (let i = 0; i < data.length; i++) {
      let temp_obj = { ...data[i] };
      let temp_conv_list = [];
      let count = 0;
      for (j = 0; j < data[i].conversation.length; j++) {
        if (data[i].conversation[j].isViewed === false) {
          count += 1;
        }
        temp_conv_list.push(data[i].conversation[j]);
      }
      temp_obj['unReadMessageCount'] = count;
      temp_obj['conversation'] = temp_conv_list;
      finalArray.push(temp_obj);
    }
  }

  return finalArray;
};

module.exports = {
  updateSendMessageDetails,
  saveMessage,
  getMessageDetails,
  deleteMessage,
  viewMessage,
  messageList,
  deleteChat,
  updateViewMessage,
  searchChat,
};
