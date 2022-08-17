import { startCase } from "lodash";

const _ = { startCase };

export default {
 /**
  * Failed to upload Image validation error message
  *
  * `Example` - Failed to upload image
  * @param  String File Type
  * @return Formatted message
  */
  uploadFailed: (fileType) => `Failed to upload ${_.startCase(fileType)}`,

  /**
  * Request forgot password email not found error message
  *
  * `Example` - We couldn't find an account associated with xyz@abc.com. Please try with an alternate email
  * @param  String File Type
  * @return Formatted message
  */
  resetPasswordEmailNotFound: (email) => `We couldn't find an account associated with ${email}. Please try with an alternate email`,

}
