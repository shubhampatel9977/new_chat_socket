const authValidation = require("../validations/authValidation");
const { DB } = require("../config/mysqlDB");
const { cryptPassword, comparePassword } = require("../utils/passwordCrypt");
const { ApiSuccess, ApiError } = require("../utils/ApiResponse");

const signUpController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = authValidation.registerSchema.validate(req.body);
    if (error) {
      return ApiError(res, 400, error.details[0].message);
    }

    // profilePhoto
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${value.username}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${value.username}`;

    const hashPass = await cryptPassword(value.password);

    value.password = hashPass;
    value.profilePhoto = value.gender === "male" ? maleProfilePhoto : femaleProfilePhoto;

    const userData = await DB.userModel.create(value);

    return ApiSuccess(res, 200, true, "User Register", userData);

  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const logInController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = authValidation.loginSchema.validate(req.body);
    if (error){
      return ApiError(res, 400, error.details[0].message);
    }

    // Find User
    const userData = await DB.userModel.findOne({ where: { username: value.username } })

    if (userData) {
      // Password Maching
      const verifyPass = await comparePassword(value.password, userData.password);
      if (!verifyPass) {
        return ApiError(res, 400, "Invalid Email or Password");
      }

      return ApiSuccess(res, 200, true, "User Login Successfully", userData)

    } else {
      return ApiError(res, 400, "Invalid Username or Password");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const getAllUsersController = async (req, res) => {
  try {
    // All User
    const usersData = await DB.userModel.findAll({
      attributes: { exclude: ['password'] },
    })
    return ApiSuccess(res, 200, true, "Get all users Successfully", usersData)
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

module.exports = {
  signUpController,
  logInController,
  getAllUsersController,
};
