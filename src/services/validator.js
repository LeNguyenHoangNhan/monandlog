import Validator from "validator";
import isEmpty from "is-empty";

const validateRegisterInput = (data) => {
    let errors = {};

    // convert empty field into empty string for convinient
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.passwordRepeat = !isEmpty(data.passwordRepeat) ?
        data.passwordRepeat :
        "";

    if (Validator.isEmpty(data.name) == true) {
        errors.name = "Name field is required";
    }

    if (Validator.isEmpty(data.email) == true) {
        errors.email = "Email field is required";
    } else if (Validator.isEmail(data.email) == false) {
        errors.email = "Invalid email address";
    }

    if (Validator.isEmpty(data.password) == true) {
        errors.password = "Password field is empty";
    } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (Validator.equals(data.password, data.passwordRepeat) == false) {
        errors.passwordRepeat = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

const validateLoginInput = (data) => {
    let errors = {};

    // convert empty field into empty string for convinient
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (Validator.isEmpty(data.email) == true) {
        errors.email = "Email field is required";
    } else if (Validator.isEmail(data.email) == false) {
        errors.email = "Invalid email address";
    }

    if (Validator.isEmpty(data.password) == true) {
        errors.password = "Password field is empty";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

export { validateRegisterInput, validateLoginInput };