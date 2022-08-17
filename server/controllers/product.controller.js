
import ProductServices from "../services/product.services";
import { get, isEmpty } from "lodash";
const _ = { get, isEmpty };



/**
 * single Product info
 *  
 * @param Request request
 */
const productProfile = async (req, res) => {
  const payload = {
    productId: _.get(req, "params.id", {})
  } 

ProductServices.productProfile(payload).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}



/**
 * Create Product 
 *
 */
const createProduct = async (req, res, next) => {
  ProductServices.createProduct(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};



/**
 * Get Product info
 *
 * @Request request
 */
const productDetails = async (req, res, next) => {
  ProductServices.productDetails(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}


/**
 * Update Product info
 *
 * @param Request request
 */
const updateProduct = async (req, res, next) => {

  ProductServices.updateProduct(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}

/**
 * Delete Product
 *
 * @param Request request
 */
const deleteProduct = async (req, res, next) => {

  const productId = _.get(req, "params.id", {});
  ProductServices.deleteProduct(productId).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}

/**
 * Status change of category 
 *
 * @param Request request
 */
 const changestatus = async (req, res, next) => {

  const productId = _.get(req, "params.id", 0);

  ProductServices.statusChange(productId).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}


const productController = {
  productProfile,
  productDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  changestatus,

};

export default productController;