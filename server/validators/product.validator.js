import { body } from "express-validator";
import { get } from "lodash";

const _ = {
  get,
};


/**
 * CreateProduct
 *
 */

export const createProduct = () => {
  return [
    body("category_id").not().isEmpty()
      .withMessage("category id  is required"),

    body("product_name").not().isEmpty().withMessage("product name is required"),

    body("purchase_date").not().isEmpty().withMessage("purchase date is required"),

    body("product_description").not().isEmpty()
      .withMessage("product description is required"),

      body("product_cost").not().isEmpty()
      .withMessage("product cost is required"),

  ];
};


export default {

  createProduct,

};
