
import comboServices from "../services/combo.services";
import { get, isEmpty } from "lodash";
const _ = { get, isEmpty };


/**
 * single Category info
 *  
 * @param Request request
 */
const getCombo = async (req, res) => {
  const payload = {
    categoryId: _.get(req, "params.id", {})
  } 
  comboServices.getCombo(payload).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}
/**
 * getAvailableCategoriesProducts  info
 *  
 * @param Request request
 */

const getCategoriesAvailableProducts = async (req, res) => {
  comboServices.getCategoriesAvailableProducts(req).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}



/**
 * Create Category 
 *
 */
const createCombo = async (req, res, next) => {
  comboServices.createCombo(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};



/**
 * Get Category info
 *
 * @Request request
 */
/* const categoryDetails = async (req, res, next) => {
  categoryServices.categoryDetails(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
} */



/**
 * Update category info
 *
 * @param Request request
 */
const updateCombo = async (req, res, next) => {
  comboServices.updateCombo(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}

/**
 * Delete category
 *
 * @param Request request
 */
const deleteCombo = async (req, res, next) => {

  const comboId = _.get(req, "params.id", {});
  comboServices.deleteCombo(comboId).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}


const comboDetails = async (req, res, next) => {

  comboServices.comboDetails(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}





const categoryController = {
  getCombo,
  comboDetails,
  createCombo,
  updateCombo,
  deleteCombo,
  getCategoriesAvailableProducts
};

export default categoryController;