const { Op } = require('sequelize');
const { DB, sequelize } = require("../config/mysqlDB");
const idValidation = require("../validations/idValidation");
const messageValidation = require("../validations/messageValidation");
const { getReceiverSocketId, io } = require("../../socket/socket")
const { ApiSuccess, ApiError } = require("../utils/ApiResponse");


const allUsersConversation = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = idValidation.validate(req.params);
    if (error) {
      return ApiError(res, 400, error.details[0].message);
    }

    const userId = value.id;

    // Step 1: Get the latest message's createdAt for each conversation
    const latestMessages = await DB.messageModel.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      attributes: [
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastMessageTime'],
        [sequelize.literal('LEAST(sender_id, receiver_id)'), 'user1'],
        [sequelize.literal('GREATEST(sender_id, receiver_id)'), 'user2']
      ],
      group: ['user1', 'user2'],
      order: [['lastMessageTime', 'DESC']]
    });

    // Step 2: Get the full message details for the latest messages
    const lastMessages = await Promise.all(latestMessages.map(async (latest) => {
      const message = await DB.messageModel.findOne({
        where: {
          createdAt: latest.getDataValue('lastMessageTime'),
          [Op.or]: [
            { sender_id: latest.getDataValue('user1') },
            { receiver_id: latest.getDataValue('user1') }
          ]
        },
        include: [
          {
            model: DB.userModel,
            as: 'sender',
            attributes: ['id', 'fullName', 'gender', 'username', 'profilePhoto'],
          },
          {
            model: DB.userModel,
            as: 'receiver',
            attributes: ['id', 'fullName', 'gender', 'username', 'profilePhoto'],
          }
        ]
      });
      return message; // this will return the full message object
    }));

    const addUserInfo = lastMessages.map(message => {
      return {
        id: message?.id,
        sender_id: message?.sender_id,
        receiver_id: message?.receiver_id,
        message: message?.message,
        image_path: message?.image_path,
        is_read: message?.is_read,
        createdAt: message?.createdAt,
        user_info: message?.sender?.id !== userId ? message?.sender : message?.receiver
      }
    });

    return ApiSuccess(res, 200, true, "Get all users' last messages successfully", addUserInfo);
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};


const sendMessageController = async (req, res) => {
  try {
    const file = req.file;

    // Check Validation
    const { error, value } = messageValidation.addMessage.validate(req.body);
    if (error) {
      return ApiError(res, 400, error.details[0].message);
    }

    const payload = {
      sender_id: value.senderId,
      receiver_id: value.receiverId,
      message: value?.message,
      image_path: file ? file?.path : null,
      is_read: value?.isRead
    }

    const msgData = await DB.messageModel.create(payload);

    // recever user send update message
    const receiverSocketId = getReceiverSocketId(msgData?.receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", msgData);
    }

    return ApiSuccess(res, 200, true, "add message", msgData);

  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
}

const getAllMessageController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = messageValidation.getMessages.validate(req.params);
    if (error) {
      return ApiError(res, 400, error.details[0].message);
    }

    const chatList = await DB.messageModel.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: value.userId,
            receiver_id: value.selectUserId,
          },
          {
            sender_id: value.selectUserId,
            receiver_id: value.userId,
          },
        ],
      },
      // attributes: [ 'message','sent_date', 'sent_time' ],
      order: [['createdAt', 'ASC']]
    });


    return ApiSuccess(res, 200, true, "Get all message", chatList);
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
}

module.exports = {
  allUsersConversation,
  sendMessageController,
  getAllMessageController,
};
