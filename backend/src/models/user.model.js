const userModel = (sequelize, DataTypes) => {
    const users = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profilePhoto: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM,
            values: ["male","female"],
            allowNull: false
        },
    }, {
        timestamps: true
    });
    return users;
}

module.exports = userModel;