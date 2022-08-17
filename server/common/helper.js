import { each, size, set, isEmpty, isObject, startCase, chain, map, get, has, isNumber, cloneDeep } from "lodash";
import crypto from "crypto";
import appConst from "./appConstants";

const _ = { each, size, set, isEmpty, isObject, startCase, chain, map, get, has, isNumber, cloneDeep }

/**
* Check whether email addresses is valid or not.
*
* @param  String Email Address
* @return TRUE if email addresses is valid, FALSE otherwise
*/
const validateEmail = (email = "") => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**
* Generate random string between min and max length
*
* @param  Object options
* @return Random string
*/
const generateRandomString = (options = {}) => {

  try {

    // Define the length of the string
    const stringLength = (_.has(options, "length") && _.isNumber(options.length)) ? options.length : 37;

    // Generate Random String
    let generatedString = crypto.randomBytes(stringLength).toString("hex");

    // Check if string needs to be converted into Upper case
    if (_.has(options, "upper")) { generatedString = generatedString.toUpperCase(); }

    return generatedString.substr(0, stringLength);
  } catch (error) {
    return error.message;
  }

}

/**
* Generate the email verification data once user signs up
*
* @return Email verification data
*/
const generateEmailVerificationDetails = () => {

  return {
    email_verified: 0,
    email_verified_at: null,
    email_verification_code: generateRandomString({ length: 6, upper: true }),
  }
}

/**
* Common pagination for data list
*
* @param  Object paginateData
* @return Pagination details object
*/
const dataPagination = (paginateData = {}) => {

  let currentPage = (parseInt((paginateData.page || 0)) > 0) ? parseInt(paginateData.page) : 1;
  const pageSize = ((parseInt((paginateData.pageSize || 0)) > 0) && (parseInt((paginateData.pageSize || 0)) <= appConst.pageSizeLimit)) ? parseInt(paginateData.pageSize) : appConst.pageSize;
  const defaultOffset = ((currentPage - 1) * pageSize);

  return {
    limit: pageSize,
    offset: defaultOffset,
    page: currentPage,
    pageSize,
    pagination: { 
      totalPages: 0,
      pageRecords: 0,
      page: currentPage,
      pageSize
    }
  };
}

const helper = {
  validateEmail,
  generateEmailVerificationDetails,
  dataPagination
};

export default helper;
