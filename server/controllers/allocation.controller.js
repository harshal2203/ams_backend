
import allocationServices from "../services/allocation.services";
import { get, isEmpty } from "lodash";
const _ = { get, isEmpty };


/**
 * single Allocation info
 *  
 * @param Request request
 */
const getAllocation = async (req, res) => {
  const payload = {
    employee_id: _.get(req, "params.id", {})
  } 
allocationServices.getAllocation(payload).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}



/**
 * Create Allocation 
 *
 */
const createAllocation = async (req, res, next) => {
  allocationServices.createAllocation(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};



/**
 * Get Allocation info
 *
 * @Request request
 */
const allocationDetails = async (req, res, next) => {
  allocationServices.allocationDetails(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}



/**
 * Update Allocation info
 *
 * @param Request request
 */
const updateAllocation = async (req, res, next) => {
  // let data = _.get(req,"body",{});
  allocationServices.updateAllocation(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}

/**
 * Delete Allocation
 *
 * @param Request request
 */
const deleteAllocation = async (req, res, next) => {

  const allocationId = _.get(req, "params.id", {});
  allocationServices.deleteAllocation(allocationId).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}










const categoryController = {
  getAllocation,
  allocationDetails,
   createAllocation,
  updateAllocation,
   deleteAllocation,
};

export default categoryController;