
import categoryServices from "../services/category.services";
import { get, isEmpty } from "lodash";
const _ = { get, isEmpty };


/**
 * single Category info
 *  
 * @param Request request
 */
const categoryProfile = async (req, res) => {
  //console.log(">>>>>>>>>",req);
  const payload = {
    categoryId: _.get(req, "params.id", {})
  } 
// console.log("categoryId>>>>>",payload);
  categoryServices.categoryProfile(payload).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}



/**
 * Create Category 
 *
 */
const createCategory = async (req, res, next) => {
  categoryServices.createCategory(req).then((result) => {
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
const categoryDetails = async (req, res, next) => {
  
  categoryServices.categoryDetails(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}

/**
 * Get Category Category_List
 *
 * @Request request
 */

 const categoryList = async (req, res, next) => {

  categoryServices.categoryList(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}

/**
 * Update category info
 *
 * @param Request request
 */
const updateCategory = async (req, res, next) => {

  categoryServices.updateCategory(req).then(result => {
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
const deleteCategory = async (req, res, next) => {

  const categoryId = _.get(req, "params.id", {});
  categoryServices.deleteCategory(categoryId).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}


/**
 *  Multiple Delete employee 
 *
 * @param Request request
 */
 const multipleDeleteCategory = async (req, res, next) => {
  const  id  = await req.query;
  categoryServices.multipleDeleteCategory(id).then(result => {
     res.status(result.status).send(result);
   }).catch(err => {
     res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
   });
 }




/**
 *  generateStock 
 *
 * @param Request request
 */
 const generateStock = async (req, res, next) => {
  categoryServices.generateStock(req).then(result => {
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

  const categoryId = _.get(req, "params.id", 0);

  categoryServices.statusChange(categoryId).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}




const categoryController = {
  categoryProfile,
  categoryDetails,
  categoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  multipleDeleteCategory,
  generateStock,
  changestatus,
};

export default categoryController;