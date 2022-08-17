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
 *Single Allocation detail
 *
 * @param Request request
 */
const allocationDetails = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  const searchText = _.get(entityParams, "q", "");
  let defaultWhere = { status: 1 };

  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      status: 1,
      [Op.or]: {
        employee_id: { [Op.like]: `%${searchText}%` },
        combo_id: { [Op.like]: `%${searchText}%` },
      },
    };
  }
  try {
    
    const entityPagination = Helper.dataPagination(entityParams);

    const getAllocationDetails = await models.allocationDetails.findAndCountAll({
      include: [{ model: models.UserDetails, attributes: modelConstants.employee },],
      where: defaultWhere,
      offset: entityPagination.offset,
      limit: entityPagination.limit,
      order: [
        ['id', 'DESC'],
      ]
    });

    let pagination = entityPagination.pagination;
    pagination["totalPages"] = Math.ceil(
      ((getAllocationDetails || {}).count || 0) / pagination.pageSize);
    pagination["pageRecords"] =
      ((getAllocationDetails || {}).rows || []).length || 0;

    responseData = {
      ...statusConst.success,success:true,
      pagination, data: getAllocationDetails
    };

  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};



/**
 * Allocation Details
 *
 * @param Request request
 */

const getAllocation = async (req) => {
  let responseData = statusConst.error;
  let Id = _.get(req, "employee_id", {})
  try {
    let alloctaion = await models.allocationDetails.findOne({ where: { id: Id } ,
      include: [{ model: models.UserDetails, attributes: modelConstants.employee },],
    });
    let combo  = await models.comboDetails.findAndCountAll({where:{allocation_id:Id},
      attributes: modelConstants.combo,
      include:[{model: models.ProductDetails, attributes: modelConstants.product}]
    });
    let data = {
      // allocationDetails: alloctaion,
      comboDetails: combo
    }
    if (alloctaion) {

      responseData = { ...statusConst.success,success:true, data }
    } else {
      responseData = { ...statusConst.error, message: "Allocation not found",success:false }
    }

  } catch (error) {
    responseData = { ...statusConst.error }
  }
  return responseData;
};




/**
 *Update Allocation detail
 *
 * @param Request request
 */
const updateAllocation = async (req) => {
  let responseData = statusConst.error;
  let data = _.get(req, "body", {});
  let Id = _.get(req, "params.id", {});
  //  console.log("data>>>", data);
  //  console.log("Id>>>", Id);
  const checkUserid = await models.UserDetails.findOne({ where: { id: data.employee_id } });// do not assign to already exist user
  if(checkUserid){
  try {
    const allocation = await models.allocationDetails.findOne({where:{ id: Id }});
    // console.log("allocation>>>>>>",allocation);
    if (!allocation) {
      return { ...statusConst.error, message: "allocation not found",success:false };
    } else {
      const payload = {
        employee_id: data.employee_id
      }
        const checUser = await models.allocationDetails.findOne({ where: { employee_id: data.employee_id } });
        if (!checUser) {
          allocation.update({ ...payload });
          responseData = {
            ...statusConst.success,
            message: "allocation udated successfully",success:true,
          };
        } else {
          responseData = { ...statusConst.error, message: "employee_id already exicting ",success:false, };
        }
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
} else {
  responseData = { ...statusConst.error, message: "User does not exicting ",success:false };
}
  return responseData;
};



/**
 *Delete Allocation
 *
 * @param Request request
 */
const deleteAllocation = async (id) => {
  let responseData = statusConst.error;

  try {
    //Check if  exist
    const allocation = await models.allocationDetails.findOne({ where: { id: id } });

    if (!allocation) {
      return { ...statusConst.error, message: "allocation not found",success:false };
    } else {
      allocation.update({ status: commonStatuses.INACTIVE.id });
    }
    responseData = {
      ...statusConst.success,
      message: "allocation deleted successfully",success:true,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};



/**
 * Allocation registrasion
 *
 * @param Request request
 */
const createAllocation = async req => {
  let responseData = statusConst.error;
  let data = _.get(req, "body", {});

  const checkUserid = await models.UserDetails.findOne({ where: { id: data.employee_id } });
  if(checkUserid){
  try {
    const allocationPayload = {
      employee_id: data.employee_id || "",
      status: commonStatuses.ACTIVE.id,
    };
    const checUser = await models.allocationDetails.findOne({ where: { employee_id: data.employee_id } });
        if (!checUser) {
    // Create new Combo entity
    const allocationDetails = await models.allocationDetails.create(allocationPayload, {
      raw: true,
    });
    const comboId = _.get(allocationDetails, "id", 0);

    const combo_id = await dbHelper.generateUniqueId(
      "combo",
      comboId
    );
    await allocationDetails.update({
      combo_id: combo_id,
    });
    // Category not created, throw an exception
    if (!comboId) {
      throw new Error("Unable to create new Allowcation");
    } else {
      responseData = {
        ...statusConst.success,
        message: "Allowcation create successfully",success:true,
        data: { data },
      };
    }
  }else {
    responseData = { ...statusConst.error, message: "employee_id already exicting ",success:false, };
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
      responseData = { ...statusConst.error, message: error.message,success:false };
    }
  }
}else {
  responseData = { ...statusConst.error, message: "User does not exicting ",success:false };
}
  return responseData;
};





const AllocationServices = {

  getAllocation,
  allocationDetails,
  createAllocation,
  updateAllocation,
  deleteAllocation,
};

export default AllocationServices;
