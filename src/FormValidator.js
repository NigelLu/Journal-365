/**
 * Special thanks to @mikeries from GitHub community for providing this boilertemplate for form validation
 * Minor edits are applied to the original code below
 * Use under the terms of the MIT License.
 * Link to original Git Repo: https://github.com/mikeries/react-validation-tutorial
 */

import validator from "validator";

class FormValidator {
    constructor(validations) {
      // validations is an array of validation rules specific to a form
      this.validations = validations;
    }
  
    validate(state) {
      // start out assuming all fields are valid
      const validation = this.init();
  
      // for each validation rule
      this.validations.forEach(rule => {
  
        // if the field hasn't already been marked invalid by an earlier rule
        if (!validation[rule.field].isInvalid) {
          // determine the field value, the method to invoke and optional args from 
          // the rule definition
          const fieldValue = state[rule.field] ? state[rule.field].toString() : "null";
          const args = rule.args || [];
          // to avoid importing validator in each component, 
          // used string representation of the validation method instead
          const validationMethod = 
                typeof rule.method === 'string' ?
                validator[rule.method] : 
                rule.method;
                
          /** 
           * call the validation_method with the current field value as the first
           * argument, any additional arguments, and the whole state as a final
           * argument.  If the result doesn't match the rule.validWhen property,
           * then modify the validation object for the field and set the isValid
           * field to false
           */ 
          if (validationMethod(fieldValue, ...args, state) !== rule.validWhen) {
            validation[rule.field] = { isInvalid: true, message: rule.message };
            validation.isValid = false;
          }
        }
      });
  
      return validation;
    }
  
    init() {
      const validation = {};
  
      this.validations.map(rule => (
        validation[rule.field] = { isInvalid: false, message: '' }
      ));
  
      return { isValid: true, ...validation };
    }
  }
  
  export default FormValidator;