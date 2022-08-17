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
 *Single product detail
 *
 * @param Request request
 */
const productProfile = async (payload) => {
  let responseData = statusConst.fetchResourceError;
  const entityParams = _.get(payload, "query",{});
  const searchText = _.get(entityParams, "q", "");
  try {
    const productId = _.get(payload, "productId", "");

    const productData = await models.ProductDetails.findOne({
      where: { id: productId },
    });

    let productInfo = _.get(productData, "dataValues", {});

    if (productData) {
      responseData = {
        ...statusConst.fetchSucccess,
        message: "product fetch successfully",success:true,
        productInfo,
      };
    } else {
      responseData = {...statusConst.error, message: "product does not exist",success:false};
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: "product not found",success:false };
  }
  return responseData;
};



/**
 * Product Details
 *
 * @param Request request
 */

const productDetails = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  const searchText = _.get(entityParams, "q", "");
  //console.log();
  let defaultWhere = { status: 1 };


  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      status: 1,
      [Op.or]: {
        product_name: { [Op.like]: `%${searchText}%` },
        id: { [Op.like]: `%${searchText}%` },
      },
    };
  }
  //console.log("entityParams",defaultWhere);

  try {

    const entityPagination = Helper.dataPagination(entityParams);

    const productDeatail = await models.ProductDetails.findAndCountAll({
      attributes: modelConstants.productDeatail,
      where: defaultWhere,
      offset: entityPagination.offset,
      limit: entityPagination.limit,
      order: [
        ['id', 'DESC'],
      ]
    });
    let pagination = entityPagination.pagination;
    pagination["totalPages"] = Math.ceil(((productDeatail || productDeatail).count) / pagination.pageSize);
    pagination["pageRecords"] = ((productDeatail || {}).rows || []).length || 0;

    responseData = {
      ...statusConst.success,success:true,
      pagination, data: productDeatail
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};



/**
 *Update Product detail
 *
 * @param Request request
 */
const updateProduct = async (req) => {
  let responseData = statusConst.error;

  const productId = _.get(req, "params.id", 0);
  let data = _.get(req, "body", {});

  try {
    //Check if  exist

    const product = await models.ProductDetails.findOne({
      where: { id: productId },
    });

    if (!product) {
      return { ...statusConst.error, message: "product not found",success:false };
    } else {


      const productUpdatePayload = {

        category_id: data.category_id || "",
        product_name: data.product_name || "",
        purchase_date: data.purchase_date || "",
        product_qty: data.product_qty || 1,
        product_description: data.product_description || "",
        product_cost: data.product_cost || "",
        status: commonStatuses.ACTIVE.id,
      };

      product.update({ ...productUpdatePayload });
    }
    responseData = {
      ...statusConst.success,
      message: "product udated successfully",success:true,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};



/**
 *Delete Product
 *
 * @param Request request
 */
const deleteProduct = async (id) => {
  let responseData = statusConst.error;

  try {
    //Check if  exist
    const product = await models.ProductDetails.findOne({ where: { id: id } });

    if (!product) {
      return { ...statusConst.error, message: "Product not found", success:false };
    } else {
      product.update({ status: commonStatuses.INACTIVE.id });
    }
    responseData = {
      ...statusConst.success,
      message: "Product deleted successfully",success:true,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};



/**
 * Product registrasion
 *
 * @param Request request
 */
const createProduct = async req => {
  let responseData = statusConst.error;
  let data = _.get(req, "body", {});
  /* let filePath;
  let fileName;
  let file; */

  try {

    const productPayload = {
      category_id: data.category_id || "",
      product_name: data.product_name || "",
      purchase_date: data.purchase_date || "",
      product_qty: data.product_qty || 1,
      product_description: data.product_description || "",
      product_cost: data.product_cost || "",
      status: commonStatuses.ACTIVE.id,
    };


    // Create new Category entity
    const productDetails = await models.ProductDetails.create(productPayload, {raw: true});

    const productId = _.get(productDetails, "id", 0);

    // Category not created, throw an exception
    if (!productId) {
      throw new Error("Unable to create new Product");
    } else {
      responseData = {
        ...statusConst.success,
        message: "Product create successfully",success:true,
        data: { data },
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
        responseData = { ...statusConst.validationErrors, errors };
      }
    } catch (error) {
      responseData = { ...statusConst.error, message: error.message };
    }
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
  let productId = data;

  try {
    //Check if  exist
    const product = await models.ProductDetails.findOne({
      where: { id: productId },
    });
    if (!product) {
      return { ...statusConst.error, message: "Product not found", success: false };
    } else {
      let statuschange;
      if (product.status == 1) {
        statuschange = commonStatuses.INACTIVE.id;
      } else {
        statuschange = commonStatuses.ACTIVE.id;
      }
      product.update({ status: statuschange });
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


const ProductServices = {

  productProfile,
  productDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  statusChange,
};

export default ProductServices;
