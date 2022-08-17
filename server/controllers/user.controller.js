import userServices from "../services/user.services";
import uservalidate from "../validators/user.validator";
import { get, isEmpty } from "lodash";


const _ = { get, isEmpty };

/*
**   
login Controller 
**  
*/
const login = (req, res, next) => {
  const bodyData = _.get(req, "body", {});
  // console.log("reqqqqqqqqqqq____________",bodyData);
  userServices.login(bodyData).then((result) => {
    res.status(result.status).send(result);

  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

/*
**   
Create Controller 
**  
*/
const createUser = (req, res) => {
  userServices.createUser(req).then((result) => {
    res.status(result.status).send(result);

  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};


/*
*   
* User Profile Controller 
*  
*/

const userProfile = async (req, res, next) => {

  const payload = {
    userId: _.get(req, "params.id", {})
  }
  userServices.userProfile(payload).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  })
}

const emp_userProfile = async (req, res, next) => {
  let tokenUser = _.get(req, "tokenUser", {})
  //console.log("tokenUser>>>",tokenUser);
  userServices.emp_userProfile(tokenUser).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  })
}


/*
*   
* User Details Controller 
*  
*/
const users = async (req, res, next) => {

  userServices.users(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}

/*
**   
Change-Password Controller 
**  
*/
const changePassword = async (req, res, next) => {
  const payload = {
    tokenUser : _.get(req, "tokenUser", {}),
    formData: _.get(req, "body", {})
  }
  userServices.changePassword(payload).then(result => {
    res.status(result.status).send(result);

  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}



/**
 * Update User info
 *
 * @param Request request
 */
 const updateUser = async (req, res, next) => {
  // let data = _.get(req,"body",{});
  userServices.updateUser(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });
}



/**
 * Delete User
 *
 * @param Request request
 */
 const deleteUser = async (req, res, next) => {

  userServices.deleteUser(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}
 const logout = async (req, res, next) => {
 

  userServices.logout(req).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}



/**
 * Status change of User 
 *
 * @param Request request
 */
 const changestatus = async (req, res, next) => {

  const userId = _.get(req, "params.id", 0);

  userServices.statusChange(userId).then(result => {
    res.status(result.status).send(result);
  }).catch(err => {
    res.status(422).send({ status: 422, message: (err.message || "Something went wrong!") });
  });

}




const userController = {
  createUser,
  login,
  userProfile,
  emp_userProfile,
  users,
  changePassword,
  updateUser,
  deleteUser,
  logout,
  changestatus,
};

export default userController;
