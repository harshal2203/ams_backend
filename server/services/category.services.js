import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
// import { get, isEmpty, isObject, omit, find, chain, has, map, includes, result, } from "lodash";
import _, { result } from "lodash";
// const _ = { get, isEmpty, isObject, omit, find, chain, has };
import models from "../models";
import appConfig from "../common/appConfig";
import { userRoles, commonStatuses } from "../common/appConstants";
import Helper from "../common/helper";
import dbHelper from "../common/dbHelper";
import modelConstants from "../common/modelConstants";
import { Op } from "sequelize";
import sequelize from "sequelize";
// import EmailServices from "./email.services"




/**
 *Single Company detail
 *
 * @param Request request
 */
const categoryProfile = async (payload) => {
  let responseData = statusConst.fetchResourceError;
  try {
    const categoryId = _.get(payload, "categoryId", "");
    // console.log("categoryId>>>>>>>..",categoryId);

    const categoryData = await models.categoryDetails.findOne({
      where: { id: categoryId },
    });

    let categoryInfo = _.get(categoryData, "dataValues", {});

    if (categoryData) {
      responseData = {
        ...statusConst.fetchSucccess,
        message: "category fetch successfully", success: true,
        categoryInfo,
      };
    } else {
      responseData = { ...statusConst.error, message: "category does not exist", success: false };
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: "category not found", success: false };
  }
  return responseData;
};



/**
 * Category Details
 *
 * @param Request request
 */

const categoryDetails = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  const searchText = _.get(entityParams, "q", "");
  // console.log("categoryDetails>>>>>>>",entityParams);
  let defaultWhere = { status: 1 };
  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      status: 1,
      [Op.or]: {
        category_name: { [Op.like]: `%${searchText}%` },
        id: { [Op.like]: `%${searchText}%` },
      },
    };
  }
  try {

    const entityPagination = Helper.dataPagination(entityParams);

    const categoryDeatail = await models.categoryDetails.findAndCountAll({
      attributes: modelConstants.categoryDeatail,
      where: defaultWhere,
      offset: entityPagination.offset,
      limit: entityPagination.limit,
      order: [
        ['id', 'DESC'],
      ]
    });
    // const categoryDeatail = await models.categoryDetails.findAll({});
    // console.log(">>>>>>>>>>><<><<><>",categoryDeatail);
    let pagination = entityPagination.pagination;

    pagination["totalPages"] = Math.ceil(((categoryDeatail || categoryDeatail).count) / pagination.pageSize);
    pagination["pageRecords"] = ((categoryDeatail || {}).rows || []).length || 0;



    responseData = {
      ...statusConst.success, success: true,
      pagination, data: categoryDeatail
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};




/**
 * Category category_List
 *
 * @param Request request
 */

const categoryList = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  const searchText = _.get(entityParams, "q", "");
  let defaultWhere = {/*  status: 1 */ };

  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      //status: 1,
      [Op.or]: {
        category_name: { [Op.like]: `%${searchText}%` },
        id: { [Op.like]: `%${searchText}%` },
      },
    };
  }

  try {

    const entityPagination = Helper.dataPagination(entityParams);

    const categoryList = await models.categoryDetails.findAll({
      attributes: modelConstants.category_List,
      where: defaultWhere,
      offset: entityPagination.offset,
      limit: entityPagination.limit,
      order: [
        ['id', 'DESC'],
      ]

    });

    let pagination = entityPagination.pagination;
    pagination["totalPages"] = Math.ceil(
      ((categoryList || {}).count || 0) / pagination.pageSize);
    pagination["pageRecords"] =
      ((categoryList || {}).rows || []).length || 0;
    responseData = { ...statusConst.success, success: true, data: categoryList };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }

  return responseData;
};


/**
 *Update Category detail
 *
 * @param Request request
 */
const updateCategory = async (req) => {
  let responseData = statusConst.error;

  const categoryId = _.get(req, "params.id", 0);
  let data = _.get(req, "body", {});
  try {
    //Check if  exist
    const category = await models.categoryDetails.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return { ...statusConst.error, message: "category not found", success: false };
    } else {
      const categoryUpdatePayload = {
        category_name: data.category_name || "",
        status: commonStatuses.ACTIVE.id,
      };
      category.update({ ...categoryUpdatePayload });
    }
    responseData = {
      ...statusConst.success,
      message: "Category udated successfully", success: true,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};



/**
 *Delete Category
 *
 * @param Request request
 */
const deleteCategory = async (id) => {
  let responseData = statusConst.error;

  try {
    //Check if  exist
    const category = await models.categoryDetails.findOne({ where: { id: id } });

    if (!category) {
      return { ...statusConst.error, message: "category not found", success: false };
    } else {
      category.update({ status: commonStatuses.INACTIVE.id });
    }
    responseData = {
      ...statusConst.success,
      message: "category deleted successfully", success: true,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};



/**
 * Category registrasion
 *
 * @param Request request
 */
const createCategory = async req => {
  let responseData = statusConst.error;
  let data = _.get(req, "body", {});
  try {
    const categoryPayload = {
      category_name: data.category_name || "",
      status: commonStatuses.ACTIVE.id,
    };
    // Create new Category entity
    const categoryDetails = await models.categoryDetails.create(categoryPayload, { raw: true });
    // const categoryId = _.get(categoryDetails, "id", 0);
    // Category not created, throw an exception
    if (!categoryDetails) {
      throw new Error("Unable to create new Category");
    } else {
      responseData = {
        ...statusConst.success,
        message: "Category create successfully", success: true,
        data: categoryDetails,
      };
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
        responseData = { ...statusConst.error1, success: false };
      }
    } catch (error) {
      responseData = { ...statusConst.error, message: error.message };
    }
  }
  return responseData;
};

/**
 * Multiple Delete Category
 *
 * @param Request request
 */

const multipleDeleteCategory = async (data) => {
  let responseData = statusConst.error;
  const ID = JSON.parse(data.id);
  try {
    //Check if  exist
    const category = await models.categoryDetails.findAll({
      where: { id: { [Op.in]: ID } },
    });
    if (!category) {
      return { ...statusConst.error, message: "category not found", success: false };
    } else {
      category.map((result) => {
        result.update({ status: commonStatuses.INACTIVE.id });
      });
    }
    responseData = {
      ...statusConst.success,
      message: "category deleted successfully", success: true,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};


/**
 * Get Stock
 *
 * @param Request request
 */

const generateStock = async (req) => {
  let responseData = statusConst.error;
  try {
    //Colunt stock
    const stock = await models.ProductDetails.findAll({
      attributes: ["category_id",
        [sequelize.fn("COUNT", sequelize.col("category_id")), "Stock"],
      ],
      //attributes: {exclude: ['category_id']},
      include: [{ model: models.categoryDetails, attributes: modelConstants.category_List }],
      group: "category_id",

    });

    let stockdetails = stock.map(result => {
      let data = result.dataValues
      return data;
    })


    //Assined product
    const assingCombo = await models.comboDetails.findAll({});
    const proId = [];
    let productID = assingCombo.map(result => {
      let data = result.dataValues.product_id;
      proId.push(data);
    })
    const ProductDetails = await models.ProductDetails.findAll({
      where: { id: { [Op.in]: proId } },
      attributes: ["category_id",
        [sequelize.fn("COUNT", sequelize.col("category_id")), "AssingStock"],
      ],
      include: [{ model: models.categoryDetails, attributes: modelConstants.category_List }],
      group: "category_id",
    })

    let assignstockdetails = ProductDetails.map(result => {
      let data = result.dataValues
      return data;
    })

    //stockdetails = stockdetails.map(stockdetails => { return _.omit(stockdetails, ['category_id']) }); //omit category id
    let kk = stockdetails.map(data1 => { return data1.CategoryName = data1.categoryDetail.category_name })
    stockdetails = stockdetails.map(data => { return _.omit(data, ["categoryDetail"]) })

    //assignstockdetails = assignstockdetails.map(assignstockdetails => { return _.omit(assignstockdetails, ['category_id']) }); //omit category id
    let assign = assignstockdetails.map(data2 => { return data2.CategoryName = data2.categoryDetail.category_name })
    assignstockdetails = assignstockdetails.map(data => { return _.omit(data, ["categoryDetail"]) })

    // const arr = [];
    // stockdetails.map(item => {
    //   arr.push(item.category_id)
    // })
    // console.log("----------->", arr);
    // console.log("startingStock>>>>>>>>", stockdetails);
    // console.log("AssigningStock>>>>>>>>", assignstockdetails);
    // let stockManage = {
    //   startingStock: stockdetails,
    //   AssigningStock: assignstockdetails,
    // }
    // let arry = []
    let test  = _.merge(stockdetails, assignstockdetails);

  
    responseData = {
      ...statusConst.success, success: true,
      data: test
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
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
  let categoryId = data;

  try {
    //Check if  exist
    const category = await models.categoryDetails.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      return { ...statusConst.error, message: "Category not found", success: false };
    } else {
      let statuschange;
      if (category.status == 1) {
        statuschange = commonStatuses.INACTIVE.id;
      } else {
        statuschange = commonStatuses.ACTIVE.id;
      }
      category.update({ status: statuschange });
    }
    responseData = {
      ...statusConst.success,
      message: "Status Changed", success: true,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};

const CategoryServices = {
  categoryProfile,
  categoryDetails,
  categoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  multipleDeleteCategory,
  generateStock,
  statusChange,
};

export default CategoryServices;
