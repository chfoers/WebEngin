const ValidationService = {
    hasRequiredFields: (object: any, requiredFields: string[], errors: string[]) => {
        let hasErrors = false;
        requiredFields.forEach(fieldName => {
            if (!object[fieldName]) {
                errors.push("Feld " + fieldName + ' darf nicht leer sein');
                hasErrors = true;
            }
        })
        return !hasErrors;
    }
}
export default ValidationService;