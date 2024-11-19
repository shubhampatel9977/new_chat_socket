const Joi = require('joi');

const addMessage = Joi.object({
  senderId: Joi.number().required(),
  receiverId: Joi.number().required(),
  message: Joi.string(),
  isRead: Joi.string(),
});

const getMessages = Joi.object({
  userId: Joi.number().required(),
  selectUserId: Joi.number().required(),
})

module.exports = {
  addMessage,
  getMessages,
};