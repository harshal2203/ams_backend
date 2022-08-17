import statusConst from "../common/statusConstants";
import { validationResult } from "express-validator";
import validator from "../validators/index";

export default (req, res, next) => {

  // Validate request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = validator.format(errors.array());

    const responseData = { ...statusConst.validationErrors, errors: formatted };
    return res.status(responseData.status).send(responseData);
  }

  // Send cursor to next request
  next();
}