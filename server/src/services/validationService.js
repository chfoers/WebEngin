"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationService = {
    hasRequiredFields: (object, requiredFields, errors) => {
        let hasErrors = false;
        requiredFields.forEach(fieldName => {
            if (!object[fieldName]) {
                errors.push(fieldName + ' can not be blank');
                hasErrors = true;
            }
        });
        return !hasErrors;
    }
};
exports.default = ValidationService;
