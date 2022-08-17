import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain, has, } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain, has };
import models from "../models";
import appConfig from "../common/appConfig";
import { userRoles, commonStatuses } from "../common/appConstants";
import Helper from "../common/helper";
import dbHelper from "../common/dbHelper";
import modelConstants from "../common/modelConstants";
import { Op } from "sequelize";
// import EmailServices from "./email.services"




/**
 *Single Company detail
 *
 * @param Request request
 */
const getCombo = async (payload) => {
  let responseData = statusConst.fetchResourceError;
  try {
    const getCombo = _.get(payload, "categoryId", "");

    const comboData = await models.comboDetails.findOne({
      where: { id: getCombo },
    });

    let comboDetails = _.get(comboData, "dataValues", {});

    if (comboData) {
      responseData = {
        ...statusConst.fetchSucccess,
        message: "combo fetch successfully",success:true,
        comboDetails,
      };
    } else {
      responseData = {
        ...statusConst.fetchResourceError,
        message: "combo does not exist",success:false
      };
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: "combo not found",success:false };
  }
  return responseData;
};


/**
 *Update Category detail
 *
 * @param Request request
 */
 const  updateCombo = async (req) => {
  let responseData = statusConst.error;
  const comboId = _.get(req, "params.id", 0);
  const data = _.get(req, "body", {});
  const product = await models.ProductDetails.findOne({ where: { id: data.product_id } });//Checking product id exicte in product table
  if(product){
  try {
    //Check if  exist
    const comboPayload = {
      allocation_id:data.allocation_id,
      product_id: data.product_id
    }
    const checkProduct = await models.comboDetails.findOne({ where: { product_id: data.product_id } })// put validation for not insert already inserted product
    if(!checkProduct){
    const combo = await models.comboDetails.findOne({
      where: { id: comboId },
    });
    if (!combo) {
      return { ...statusConst.error, message: "combo not found",success:false };
    } else {
      
      combo.update({ ...comboPayload });
    }
    responseData = {
      ...statusConst.success,
      message: "combo udated successfully",success:true
    };
  } else {
    responseData = { ...statusConst.error, message: "product is already in use",success:false };
  }
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
}else {
  responseData = { ...statusConst.error, message: "product does not exicte",success:false };
}
  return responseData;
};



/**
 *Delete Category
 *
 * @param Request request
 */
const deleteCombo = async (id) => {
  let responseData = statusConst.error;

  try {
    //Check if  exist
    const combo = await models.comboDetails.findOne({ where: { id: id } });

    if (!combo) {
      return { ...statusConst.error, message: "combo not found",success:false };
    } else {
      combo.update({ status: commonStatuses.INACTIVE.id });
    }
    responseData = {
      ...statusConst.success,
      message: "combo deleted successfully",success:true
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};



/**
 * Combo registrasion
 *
 * @param Request request
 */
const createCombo = async req => {
  let responseData = statusConst.error;
  let data = _.get(req, "body", {});
  const product = await models.ProductDetails.findOne({ where: { id: data.product_id } });//Checking product id exicte in product table
  if (product) {
    try {
      const comboPayload = {
        allocation_id: data.allocation_id || "",
        //category_id: data.category_id || "",
        product_id: data.product_id || "",
        status: commonStatuses.ACTIVE.id,
      };
      const checkProduct = await models.comboDetails.findOne({ where: { product_id: data.product_id } })// put validation for not insert already inserted product
     if(!checkProduct){
      // Create new Combo entity
      const comboDetails = await models.comboDetails.create(comboPayload, {
        raw: true,
      });
      const comboId = _.get(comboDetails, "id", 0);
      // Category not created, throw an exception
      if (!comboId) {
        throw new Error("Unable to create new Combo");
      } else {
        responseData = {
          ...statusConst.success,
          message: "Combo create successfully",success:true,
          data: { data },
        };
      }
    } else {
      responseData = { ...statusConst.error, message: "product is already in use",success:false };
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
    responseData = { ...statusConst.error, message: "product does not exicte",success:false };
  }

  return responseData;
};





const AllocationServices = {

  getCombo,
  // categoryDetails,
  createCombo,
  updateCombo,
   deleteCombo,
};

export default AllocationServices;
