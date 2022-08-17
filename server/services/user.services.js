import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain, has, } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain, has };
import Models from "../models";
import appConfig from "../common/appConfig";
import { userRoles, commonStatuses } from "../common/appConstants";
import Helper from "../common/helper";
import dbHelper from "../common/dbHelper";
import modelConstants from "../common/modelConstants";
import { Op } from "sequelize";
// import EmailServices from "./email.services"



/**
 * Login to user and generate JWT
 *
 * @param Request request
 */
const login = async (req) => {

  let responseData = statusConst.authError;
  // const data = _.get(req, "body", "");
  try {
    const email = req.email;
    const password = req.password;
    // Find the user by email and if active
    const User = await Models.UserDetails.findOne({
      where: {
        email: email,
        status: commonStatuses.ACTIVE.id,
      },
    });
    // console.log("User>>>>>>>>>>",User);

    const userPassword = _.get(User, "password", "");
    const validPassword = await bcrypt.compare(password, userPassword);

    if (
      !_.isEmpty(User) &&
      _.isObject(User) &&
      validPassword === true &&
      !_.isEmpty(password)
    ) {
      if (User.dataValues.email_verified == 0) {
        responseData = {
          ...statusConst.authError,
          message: "Email not verified",
        };
      } else {
        const tokenData = await generateToken({
          id: User.id,
        });
        const token = _.get(tokenData, "token", null);
        if (token) {
          await User.update({ token });
          responseData = { ...statusConst.authSuccess, data: { token } };
        }
      }
    }
  } catch (err) {
    responseData = { ...statusConst.error, message: err.message };
  }
  return responseData;
};

/**
 * Generate the Token based on User PK
 *
 * @param  Options Object
 * @return String Token with 12h expired date
 */
const generateToken = async (options = {}) => {
  let responseData = statusConst.error;

  const userId = _.get(options, "id", 0);
  const updateToken = _.get(options, "updateToken", false) || false;

  try {
    // Add associated modules
    let userTableAttributes = [
      "id",
      "user_role_id",
      "email",
      "password",
      "first_name",
      "last_name",
      "phone",
      "dob",
      "status",
      "email_verified",
      "email_verified_at",
      "email_verification_code",
      "updated_by",
      "created_by",
      "updated_at",
      "created_at",
    ];
    // Find user by id
    let User = await Models.UserDetails.findOne({
      attributes: userTableAttributes,
      where: { id: userId },
    });
    if (_.isEmpty(User)) {
      return { ...statusConst.error, message: "User not found",success: false };
    }

    let userData = User.get({ plain: true }) || {};

    // Change the status and roles to string from integer
    userData.status = _.chain(commonStatuses).find({ id: userData.status }).get("title", "").value();
    userData.role = _.chain(userRoles).find({ id: userData.user_role_id }).get("title", "").value();

    // Omit unwanted data in the last once all the related activities are done
    userData = _.omit(
      userData,
      ["UserDetail"],
      "id",
      "email",
      "password",
      "user_role_id",
      "phone",
      "email_verified",
      "email_verified_at",
      "email_verification_code",
      "updated_at",
      "status"
    );

    // Generate JWT with payload
    const token = jwt.sign(userData, appConfig.jwtSecretKey);

    //const token = jwt.sign(userData, appConfig.jwtSecretKey, { expiresIn: '3h' });
    //const token = jwt.sign({ id: userData.id }, process.env.RESET_PASSWORD_KEY, { expiresIn: '3h' });
    // Update the token
    if (updateToken == true) {
      await User.update({ token });
    }

    responseData = { ...statusConst.success, token,success:true, };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};




/**
 * create user
 *
 * @param Request request
 */
const createUser = async (data) => {
  let responseData = statusConst.error;
  const bodyData = _.get(data,"body", {});
  const checkUser = _.get(data,"tokenUser",{});
  // console.log("checkUser>>>>>>>>>>>",checkUser);
  const checkEmailExicteInTable = await Models.UserDetails.findOne({where:{email:bodyData.email}});
  if(!checkEmailExicteInTable){
  try {
    //const emailVerification = Helper.generateEmailVerificationDetails();
    let userPayload = {
      user_role_id: bodyData.user_role_id || 1,
      email: bodyData.email || "",
      token: bodyData.token || "",
      first_name: bodyData.first_name || "",
      last_name: bodyData.last_name || "",
      phone: bodyData.phone || "",
      dob: bodyData.dob || "",
      password: await bcrypt.hash(bodyData.password, appConfig.bcryptSaltRound) || "",
      status: commonStatuses.ACTIVE.id,
      //...emailVerification,
      created_by: checkUser.first_name +" "+ checkUser.last_name,
      updated_by: ""

    };
    if(checkUser.user_role_id== 1 || checkUser.user_role_id== 2){ // employee can not create another employee
      if(checkUser.user_role_id== 2 && userPayload.user_role_id ==1){ // HR can not create Admin
        responseData = { ...statusConst.error, message: "HR can not create admin" };
      }else{
      const user = await Models.UserDetails.create(userPayload);
      // console.log("user>>>>>>>>",user);
      const userId = _.get(user, "id", 0);
      // User  not created, throw an exception
      if (!userId) {
        throw new Error("Unable to create new User ");
      }
      responseData = {
        ...statusConst.success,
        message: "User created successfully", success:true,
        data: user,
      };
    }
    }else{
      responseData = { ...statusConst.error, message: "Unauthorized user" };
    }
  } catch (error) {
    let errors = {};
    // Default message
    responseData = { ...statusConst.error, message: error.message };
    try {
      if (
        ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
          error.name
        )
      ) {
        errors = dbHelper.formatSequelizeErrors(error);
        responseData = { ...statusConst.validationErrors, errors };
      }
    } catch (error) {
      responseData = { ...statusConst.error, message: error.message };
    }
  }
} else {
  responseData = { ...statusConst.error, message: "Email alredy in use", success:false };
}
  return responseData;
};

/**
 *
 * display single user details
 *
 */
 const userProfile = async (payload) => {
  let responseData = statusConst.fetchResourceError;
  try {
    const userId = _.get(payload, "userId", 0);

    const userData = await Models.UserDetails.findOne({
      where: { id: userId },
    });
    // console.log(">>>>>>>>",userData);
    const userDataPayload = {
      id: userData.id,
      user_role_id: userData.user_role_id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      dob: userData.dob,
      status: userData.status,
      email_verified: userData.email_verified
    }
    if (userData) {
      responseData = {
        ...statusConst.fetchSucccess,
        message: "User fetch successfully",success:true,
        data: userDataPayload,
      };
    } else {
      responseData = {
        ...statusConst.fetchResourceError,
        message: "User does not exist",
      };
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: "User not found",success: false };
  }
  return responseData;
};


/**
 *
 * display single employee user details
 *
 */
const emp_userProfile = async (payload) => {
  let responseData = statusConst.fetchResourceError;
  try {
    // const userId = _.get(payload, "userId", 0);
    //console.log("payload>>>>>>>",payload.id);

    const userData = await Models.UserDetails.findOne({
      // where: { id: userId },
      where: { id: payload.id },
    });

    if (userData) {
      responseData = {
        ...statusConst.fetchSucccess,
        message: "User fetch successfully",success:true,
        data: userData,
      };
    } else {
      responseData = {
        ...statusConst.fetchResourceError,
        message: "User does not exist",
      };
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: "User not found",success: false };
  }
  return responseData;
};

/**
 * Get users details
 *
 * @Request request
 */
const users = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  let searchText = _.get(entityParams, "q", "");
  let defaultWhere = { /* status: 1 */ };

  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      //status: 1,
      [Op.or]: {
        first_name: { [Op.like]: `%${searchText}%` },
        last_name: { [Op.like]: `%${searchText}%` },
        phone: { [Op.like]: `%${searchText}%` },
        email: { [Op.like]: `%${searchText}%` },
        user_role_id: { [Op.like]: `%${searchText}%` },
      },
    };
  }
  try {
    const entityPagination = Helper.dataPagination(entityParams);

    const users = await Models.UserDetails.findAndCountAll({
      attributes: modelConstants.userDeatail,

      where: defaultWhere,
      offset: entityPagination.offset,
      limit: entityPagination.limit,
      order: [["id", "DESC"]],
    });

    let pagination = entityPagination.pagination;
    pagination["totalPages"] = Math.ceil(
      ((users || {}).count || 0) / pagination.pageSize
    );
    pagination["pageRecords"] = ((users || {}).rows || []).length || 0;

    responseData = { ...statusConst.success,success:true, pagination, data: users };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};

/**
 * Find User by Token
 *
 * @param String JWT token
 */
const findByToken = async (token) => {
  let responseData = { ...statusConst.error, message: "user not found",success: false };
  try {
    // Find user by token
    const User = await Models.UserDetails.findOne({
      where: {
        token: token,
        status: commonStatuses.ACTIVE.id,
      },
    });
    if (!_.isEmpty(User) && _.isObject(User)) {
      responseData = { ...statusConst.success,success:true, data: User };
    } else {
      responseData = { ...statusConst.error, message: "user not found",success: false };
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }

  return responseData;
};


const changePassword = async (payload) => {
  let responseData = statusConst.authError;

  try {
    const userId = _.get(payload, "tokenUser.id", 0);

    const currentPassword = _.get(payload, "formData.currentPassword", "");
    const newPassword = _.get(payload, "formData.newPassword", "");

    const userData = await Models.UserDetails.findOne({
      where: {
        id: userId,
        status: commonStatuses.ACTIVE.id,
      },
    });

    if (userData) {
      //verify the password
      const validPassword = await bcrypt.compare(
        currentPassword,
        userData.password
      );

      if (validPassword) {
        // Generate new hash password
        const hashPassword = await bcrypt.hash(
          newPassword,
          appConfig.bcryptSaltRound
        );

        userData.password = hashPassword;
        await userData.save();

        responseData = {
          ...statusConst.authSuccess,
          message: "Password change succesfully",success:true,
        };
      } else {
        responseData = {
          ...statusConst.error,message: "Current password is not vailid", success: false
        };
      }
    } else {
      responseData = { ...statusConst.error, message: "User not found",success: false };
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};




/**
 *Update User detail
 *
 * @param Request request
 */
 const updateUser = async (req) => {
  let responseData = statusConst.error;

  const userId = _.get(req, "params.id", 0);
  let data = _.get(req, "body", {});
  const checkUser = _.get(req,"tokenUser",{});
  try {
    //Check if  exist
    const user = await Models.UserDetails.findOne({
      where: { id: userId },
    });
    // console.log(">>>>>>>>>>>>>>",user);
    if (!user) {
      return { ...statusConst.error, message: "User not found",success: false };
    } else {
      const userUpdatePayload = {
      user_role_id: data.user_role_id || "",
      email: data.email || "",
      token: data.token || "",
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      phone: data.phone || "",
      dob: data.dob || "",
      password: await bcrypt.hash(data.password, appConfig.bcryptSaltRound) || "",
      status: commonStatuses.ACTIVE.id,
      updated_by: checkUser.first_name + " " + checkUser.last_name
      };
      
      const updatedUser = user.update({ ...userUpdatePayload });
      responseData = {
        ...statusConst.success,
        message: "User udated successfully",success:true,
        updatedUser:updatedUser
      };
    }
    
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};





/**
 *Delete User
 *
 * @param Request request
 */
 const deleteUser = async (req) => {
  let responseData = statusConst.error;
  const userId = _.get(req, "params.id", {});
  try {
    //Check if  exist
    const user = await Models.UserDetails.findOne({ where: { id: userId } });
    if (!user) {
      return { ...statusConst.error, message: "user not found",success: false };
    } else {
      user.update({ status: commonStatuses.INACTIVE.id });
      responseData = {
        ...statusConst.success,
        message: "user deleted successfully",success:true,
      };
    }
    
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};

 const logout = async (req) => {
  let responseData = statusConst.error;
  let tokenUser = _.get(req, "tokenUser", {});
  // console.log(">>>>>>>>>>>>>tokenUser",tokenUser);
  try {
    //Check if  exist
    const user = await Models.UserDetails.findOne({ where: { id: tokenUser.id } });
    // console.log(">>>>>>>>>>>>user",user);
    if (!user) {
      return { ...statusConst.error, message: "user not found",success: false };
    } else {
      user.update({ token: "" });
      responseData = {
        ...statusConst.success,
        message: "user logout successfully",success:true,
      };
    }
    
  } catch (error) {
    responseData = { ...statusConst.error, message: "User already loged out",success: false };
  }
  return responseData;
};


/**
 * Change Status category
 *
 * @param Request request
 */

 const statusChange = async (data) => {
  let responseData = statusConst.error;
  let userId = data;

  try {
    //Check if  exist
    const user = await Models.UserDetails.findOne({
      where: { id: userId },
    });
    if (!user) {
      return { ...statusConst.error, message: "User not found",success:false };
    } else {
      let statuschange;
      if (user.status == 1) {
        statuschange = commonStatuses.INACTIVE.id;
      } else {
        statuschange = commonStatuses.ACTIVE.id;
      }
      user.update({ status: statuschange });
    }
    responseData = {
      ...statusConst.success,
      message: "Status Changed",success:true,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};


const UserServices = {
  createUser,
  login,
  generateToken,
  userProfile,
  emp_userProfile,
  users,
  changePassword,
  findByToken,
  updateUser,
  deleteUser,
  logout,
  statusChange,
};

export default UserServices;
