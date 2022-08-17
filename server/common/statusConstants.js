export default {

  /**
   * Maintain the constants group by, i.e. common, company, candidate, etc... if any
   * 
   * Also maintain the success and error responses as per defined in common
   */

  // Common constants
  authSuccess: { status: 200, message: 'Login successful',success:true },
  success: { status: 200, message: 'Success' },
  fetchSucccess: { status: 200, message: "user fetch successfully" },

  unauthorized: { status: 200, message: 'Invalid Username or Password',success: false },
  authError: { status: 200, message: 'Invalid Username or Password',success: false },
  noTokenProvided: { status: 401, message: 'No token provided' },
  tokenExpired: { status: 401, message: 'Token expired' },
  invalidToken: { status: 401, message: 'Invalid token' },

  forbidden: { status: 403, message: 'Forbidden' },

  deleteResourceError: { status: 422, message: 'Something went wrong while deleting data' },
  fetchResourceError: { status: 422, message: 'Something went wrong while fetching data' },
  validationErrors: { status: 200, message: "Password and Confirm password does not match",success: false },
  somethingWentWrong: { status: 422, message: 'Something went wrong !!!' },
  notFound: { status: 404, message: 'Requested data not found' },
  error: { status: 200, message: 'Error' },
  error1: { status: 200, message: 'Category already exist' },

  // Define any custom constants group by
}