import statusConst from "./../common/statusConstants";
import jwt from "jsonwebtoken";
import appConfig from "./../common/appConfig";
import authServices from "../services/user.services";
import { chain } from "lodash";

const _ = { chain };

export default (req, res, next) => {

  const token = _.chain(req).get("headers.authorization", "").replace("Bearer ", "").value();
  // console.log('>>>>>>>>>>>>>?????????',token);
  if (token) {

    // Validate token
    try {
      jwt.verify(token, appConfig.jwtSecretKey);

      // Match JTW with user table
      authServices.findByToken(token).then(data => {
        // console.log("data>>>>",data);
        if (data.status === 200) {
          // Pass token user with current request
          // console.log("req.tokenUser>>>>",req.tokenUser);

          req.tokenUser = data.data;
          next();
        } else {
          res.status(401).send({ status: 401, message: "Invalid session" });
        }
      }).catch(error => {
        res.status(401).send({ status: 401, message: error.message });
      });

    } catch (error) {

      if (error.name === 'TokenExpiredError') {
        res.status(401).send(statusConst.tokenExpired);
      } else {
        res.status(401).send({ ...statusConst.tokenExpired, message: error.message });
      }
    }

  } else {
    res.status(statusConst.noTokenProvided.status).send(statusConst.noTokenProvided);
  }
}
