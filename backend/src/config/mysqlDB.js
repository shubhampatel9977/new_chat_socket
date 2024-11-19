const { Sequelize, DataTypes } = require('sequelize');

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const DB = {}
DB.sequelize = sequelize;
DB.Sequelize = Sequelize;


//<======================= Import Models =======================>//

// User models
DB.userModel = require("../models/user.model")(sequelize, DataTypes);
DB.messageModel = require("../models/message.model")(sequelize, DataTypes);

// stable relationship
DB.userModel.hasMany(DB.messageModel, { foreignKey: 'sender_id', as: 'sentMessages'});
DB.messageModel.belongsTo(DB.userModel, { foreignKey: 'sender_id', as: 'sender' });

DB.userModel.hasMany(DB.messageModel, { foreignKey: 'receiver_id', as: 'receivedMessages'});
DB.messageModel.belongsTo(DB.userModel, { foreignKey: 'receiver_id', as: 'receiver' });

// Sync all models
DB.sequelize.sync({ alter: true }).then(() => {
  console.log("All models were synchronized successfully.");
});

module.exports = { DB, sequelize, Sequelize };
