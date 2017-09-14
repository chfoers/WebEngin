const ValidationService = {
    hasRequiredFields: (object: any, requiredFields: string[], errors: string[]) => {
        let hasErrors = false;
        requiredFields.forEach(fieldName => {
            if (!object[fieldName]) {
                errors.push(fieldName + ' can not be blank');
                hasErrors = true;
            }
        })
        return !hasErrors;
    }
}
export default ValidationService;