const express = require("express");
const router = express.Router();
const { createMulterConfig } = require("../utils/fileUploadOnLocal");
const messageController = require("../controllers/message.controller");


// Create multer instance
const upload = createMulterConfig({
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    maxFileCount: 1,
    uploadPath: 'public/msgImage'
});

// Define routes
router.get('/users-conversation/:id', messageController.allUsersConversation);
router.post('/send', upload.single('image'), messageController.sendMessageController);
router.get('/get/:userId/:selectUserId', messageController.getAllMessageController);

module.exports = router;