
export type FieldValidator = {
    validate: (value: any, objRef?: any) => boolean
    errorMessage: string
}

export type ValidationRules = { [y in keyof any]: FieldValidator[] | { [y in keyof ValidationRules] } }

export type FieldRule = (...args: any[]) => FieldValidator

export type Errors = { [y in keyof any]: string[] | { [y in keyof Errors] } }

export type JoinedErrors = { [y in keyof any]: string }

export type ValidationResult<T> = {
    isValid: boolean,
    errorMessages: Errors,
    errors: T
}

const joinErrors = <T>(errors: Errors): T => {
    var joinedErrors: any = undefined
    for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
            const errorMessages = errors[key];
            if (!joinedErrors) {
                joinedErrors = {}
            }
            if (Array.isArray(errorMessages)) {
                joinedErrors[key] = errorMessages.join(" ")
            } else {
                if (typeof (errorMessages) === "object") {
                    joinedErrors[key] = joinErrors<T>(errorMessages)
                }
            }
        }
    }
    var result = joinedErrors as T
    return result
}

const validateObject = <T>(obj: any, validationRules: ValidationRules): ValidationResult<T> => {
    var errors: Errors = undefined
    for (const fieldName in validationRules) {
        if (!Object.prototype.hasOwnProperty.call(obj, fieldName)) {
            console.error(`Validator2: The field name '${fieldName}' doesnt exists in the object to be validated`)
            continue;
        }
        const fieldValidators = validationRules[fieldName]

        if (!Array.isArray(fieldValidators)) {
            if (!errors) {
                errors = {}
            }
            if (!errors[fieldName]) {
                errors[fieldName] = {}
            }
            const childObj = obj[fieldName]
            errors[fieldName] = validateObject(childObj, fieldValidators).errorMessages as any
        }

        if (fieldValidators) {
            for (let index = 0; index < fieldValidators.length; index++) {
                const fieldValidator = fieldValidators[index]
                const value = obj[fieldName]
                if (fieldValidator && fieldValidator.validate) {
                    const isValid = fieldValidator.validate(value, obj)
                    if (!isValid) {
                        if (!errors) {
                            errors = {}
                        }
                        if (!errors[fieldName]) {
                            errors[fieldName] = []
                        }
                        var errorMessage = fieldValidator.errorMessage
                        if (fieldValidator.errorMessage) {
                            errorMessage = fieldValidator.errorMessage.replace(":value", value)
                        }
                        if (!Array.isArray(fieldValidator.errorMessage)) {
                            (errors[fieldName] as string[]).push(errorMessage)
                        }
                    }
                }
            }
        }
    }
    return {
        isValid: errors ? false : true,
        errorMessages: errors,
        errors: joinErrors<T>(errors)
    }
}


const validateField = <T, E>(obj: T, fieldName: string, validationRules: ValidationRules): ValidationResult<E> => {
    var errors: Errors = undefined
    if (!Object.prototype.hasOwnProperty.call(obj, fieldName)) {
        console.error(`Validator2: The field name '${fieldName}' doesnt exists in the object to be validated`)
        return
    }
    const fieldValidators = validationRules[fieldName]
    if (fieldValidators) {
        for (let index = 0; index < fieldValidators.length; index++) {
            const fieldValidator = fieldValidators[index]
            const value = obj[fieldName]
            if (fieldValidator && fieldValidator.validate) {
                const isValid = fieldValidator.validate(value, obj)
                if (!isValid) {
                    if (!errors) {
                        errors = {}
                    }
                    if (!errors[fieldName]) {
                        errors[fieldName] = []
                    }
                    var errorMessage = fieldValidator.errorMessage
                    if (fieldValidator.errorMessage) {
                        errorMessage = fieldValidator.errorMessage.replace(":value", value)
                    }
                    if (!Array.isArray(fieldValidator.errorMessage)) {
                        (errors[fieldName] as string[]).push(errorMessage)
                    }
                }
            }
        }
    }
    return {
        isValid: errors ? false : true,
        errorMessages: errors,
        errors: joinErrors<E>(errors)
    }
}


export const validator = {
    validateObject: validateObject,
    validateField: validateField
}