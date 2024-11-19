const express = require("express");
const authRoute = require("./authRoutes");
const messageRoute = require("./messageRoutes");

const router = express.Router();

// Auth Route
router.use("/auth", authRoute);
router.use("/message", messageRoute);

module.exports = router;
