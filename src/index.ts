
/**
 * Helper function: joins array of string(error messages) as a single string
 * @param errors the errors to be joined as a single string
 * @returns 
 */
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

/**
 * Represents the object model of field validator
 */
export type FieldValidator = {
    validate: (value: any, objRef?: any) => boolean
    errorMessage: string
}

/**
 * Represents a collection of validation rules.
 * The validation schema should implement this type.
 */
export type ValidationRules = { [y in keyof any]: FieldValidator[] | { [y in keyof ValidationRules] } }

/**
 * Represents the function type signature of field rule.
 * If you want to create your own field validation rule, your function should match to this type signature.
 */
export type FieldRule = (...args: any[]) => FieldValidator

/**
 * Represents the errors model of the validation result
 */
export type Errors = { [y in keyof any]: string[] | { [y in keyof Errors] } }

/**
 * Represents the model of validation result returned by the validateObject and the validationField method
 */
export type ValidationResult<T> = {
    isValid: boolean,
    errorMessages: Errors,
    errors: T
}

/**
 * Get property value of an object. Supports deep get value such (company.address.streetName).
 */
 const getValue = (o, fieldName: string) => {
    let index = 0
    const splittedFieldNames = fieldName.split(".")
    if (!!splittedFieldNames && splittedFieldNames.length > 1) {
        const key = splittedFieldNames[index]
        const value = o[key]
        while (index < splittedFieldNames.length) {
            index++
            var nextField = fieldName.replace(key + ".", "")
            return getValue(value, nextField)
        }
        return value
    }
    if (!Object.prototype.hasOwnProperty.call(o, fieldName)) {
        console.error(`nm-validator: The field name '${fieldName}' doesn't exist in the object to be validated`)
        return undefined
    }
    return o[fieldName]
}

/**
 * Set property value of an object. Supports deep set value such (company.address.streetName).
 */
const setValue = (o, fieldName: string, value) => {
    let index = 0

    const splittedFieldNames = fieldName.split(".")
    if (!!splittedFieldNames && splittedFieldNames.length > 1) {
        const key = splittedFieldNames[index]

        while (index < splittedFieldNames.length) {
            index++
            var nextFieldNames = fieldName.replace(key + ".", "")
            if (!o[key]) {
                o[key] = {}
                setValue(o[key], nextFieldNames, value)
            }
        }
        if (!o[key]) {
            o[key] = []
        }
        if (o[key].push) {
            o[key].push(value)
        }

        return
    }

    if (!o[fieldName]) {
        o[fieldName] = []
    }

    o[fieldName].push(value)
}

/**
 * Validates an object by the specified rules
 * @param obj the object to be validated
 * @param validationRules the validation rules
 * @returns 
 */
const validateObject = <T>(obj: any, validationRules: ValidationRules): ValidationResult<T> => {
    var errors: Errors = undefined
    for (const fieldName in validationRules) {
        if (!Object.prototype.hasOwnProperty.call(obj, fieldName)) {
            console.error(`nm-validator: The field name '${fieldName}' doesnt exists in the object to be validated`)
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

/**
 * Validates a spesific field of an object by the specified rules
 * @param obj the object to be validated
 * @param validationRules the validation rules
 * @returns 
 */
const validateField = <T, E>(obj: T, fieldName: string, validationRules: ValidationRules): ValidationResult<E> | undefined => {
    var errors: Errors = undefined
    if (!fieldName) {
        console.error("nm-validator: The fieldName argument is required")
        return undefined
    }

    let fieldValidators: FieldValidator[] | { [x: string]: any }

    fieldValidators = getValue(validationRules, fieldName)
    if (fieldValidators) {
        for (let index = 0; index < fieldValidators.length; index++) {
            const fieldValidator = fieldValidators[index]

            const value = getValue(obj, fieldName)
           
            if (fieldValidator && fieldValidator.validate) {
                const isValid = fieldValidator.validate(value, obj)
                if (!isValid) {
                    if (!errors) {
                        errors = {}
                    }
               
                    var errorMessage = fieldValidator.errorMessage
                    if (fieldValidator.errorMessage) {
                        errorMessage = fieldValidator.errorMessage.replace(":value", value)
                    }

                    if (!Array.isArray(fieldValidator.errorMessage)) {
                        setValue(errors, fieldName, errorMessage)
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

/**
 * The validator objects, contains the main validation methods.
 */
export const validator = {
    validateObject: validateObject,
    validateField: validateField
}