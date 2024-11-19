const express = require("express");
var path = require('path');
require("dotenv").config();
const configureCors = require("./src/config/corsConfig.js");
const routes = require("./src/routes/index.js");
const { app, server } = require("./socket/socket.js")

// Database Connection
require("./src/config/mysqlDB");

const port = process.env.PORT || 8080;

// Apply CORS middleware
app.use(configureCors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// default route
app.get("/", (req, res) => {
  res.status(200).json("Api working fine!");
});

app.use("/api", routes);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
