

/**
* Format an error Array to proper object
* Cleanup an unwanted values from array
*
* @param  Array array of errors
*/
const format = errors => {

  const _errors = {};

  if (Array.isArray(errors)) {
    errors.forEach(e => {
      // Handle one error at a time
      if (!_errors[e.param]) {
        _errors[e.param] = e.msg
      }
    });
  }
  return _errors;
}

const validator = { format };

export default validator;