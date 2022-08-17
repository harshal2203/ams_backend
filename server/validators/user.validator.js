import { body } from "express-validator";
import { get } from "lodash";

const _ = {
  get,
};

/**
 * Validate Login Authentication
 *
 */
export const login = () => {
  return [
    body("email").not().isEmpty().withMessage("Email is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ];
};

/**
 * CreateUser
 *
 */

export const createUser = () => {
  return [
    body("user_role_id").not().isEmpty()
      .withMessage("user role id  is required"),
    body("email").not().isEmpty().withMessage("Email is required")
      .isEmail()
      .withMessage("Valid email address is required"),
    body("password")
      .not().isEmpty()
      .withMessage("password is required"),
      body("confirm_password")
      .not()
      .isEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password and Confirm password does not match");
        }
        return true;
      }),
      body("first_name").not().isEmpty()
      .withMessage("First name is required"),
    body("last_name").not().isEmpty()
      .withMessage("Last name is required"),
    body("phone").not().isEmpty()
      .withMessage("Phone number is required")
      .isLength({ min: 10, max: 10 }).withMessage("Incorrect phone number"),
    body("dob").not().isEmpty().withMessage("Date of birth is required")
  ];
};

/**
 * Change password
 *
 */
export const changePassword = () => {
  return [
    body("currentPassword")
      .not()
      .isEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .not()
      .isEmpty()
      .withMessage("New password is required")
      .isLength({
        min: 4,
        max: 16,
      })
      .withMessage("Password must be between 4 to 16 characters")
      .matches(/^(?=.*[a-z])(?!.* )(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
      .withMessage(
        "Must contains at least upper case, lower case, digit, special character and no white space"
      )
      .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
          throw new Error("Current password and New password cannot be same");
        }
        return true;
      }),
    body("confirmPassword")
      .not()
      .isEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Password and Confirm password does not match");
        }
        return true;
      }),
  ];
};

/**
 * CreateEmployee
 *
 */

export const updateUser = () => {
  return [
    body("user_role_id").not().isEmpty()
      .withMessage("user role id  is required"),
    body("first_name").not().isEmpty().withMessage("First name is required"),
    body("last_name").not().isEmpty().withMessage("Last name is required"),
    body("dob").not().isEmpty().withMessage("Date of birth is required"),
  ];
};

export default {
  login,
  createUser,
  changePassword,
  updateUser,
};
