
export type StringifiedOf<T> = { [x in keyof T]: T[x] extends object ? StringifiedOf<T[x]> : string }

/**
 * Represents the errors model of the validation result
 */
// export type ArrayStringOf = { [y in keyof any]: string[] | { [y in keyof ArrayStringOf]: ArrayStringOf[y] } }

export type ArrayStringOf<T> = { [y in keyof T]: T[y] extends object ? ArrayStringOf<T[y]> : string[] }


/**
 * Helper function: joins array of string(error messages) as a single string
 * @param errors the errors to be joined as a single string
 * @returns 
 */
const StringifyErrors = <T>(errors: ArrayStringOf<T>): StringifiedOf<T> => {
    var stringifiedErrors: StringifiedOf<T> = undefined
    for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
            const errorMessages = errors[key];
            if (!stringifiedErrors) {
                stringifiedErrors = {} as StringifiedOf<T>
            }
            if (Array.isArray(errorMessages)) {
                stringifiedErrors[key as any] = errorMessages.join(" ")
            } else {
                if (typeof (errorMessages) === "object") {
                    stringifiedErrors[key as any] = StringifyErrors<T>(errorMessages as unknown as ArrayStringOf<T>)
                }
            }
        }
    }
    var result = stringifiedErrors as StringifiedOf<T>
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
export type ValidationRules<T> = { [a in keyof T]?: FieldValidator[] | ValidationRules<T[a]> }


/**
 * Represents the model of validation result returned by the validateObject and the validationField method
 */
export type ValidationResult<TError> = {
    isValid: boolean,
    errorMessages: ArrayStringOf<TError>,
    errors: StringifiedOf<TError>
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
const validateObject = <T>(obj: T, validationRules: ValidationRules<T>): ValidationResult<T> => {
    var errors: ArrayStringOf<T> = undefined
    for (const fieldName in validationRules) {
        const validatorOrRule = validationRules[fieldName]
        const isValidator = Array.isArray(validatorOrRule)
        const isObject = !isValidator

        if (isObject) {
            if (!errors) {
                errors = {} as ArrayStringOf<T>
            }
            if (!errors[fieldName]) {
                errors[fieldName as any] = {}
            }
            const childObj = obj[fieldName]
            errors[fieldName as any] = validateObject(childObj, validatorOrRule).errorMessages
        }

        if (isValidator) {
            for (let index = 0; index < validatorOrRule.length; index++) {
                const fieldValidator = validatorOrRule[index]
                const value = obj[fieldName]
                if (fieldValidator && fieldValidator.validate) {
                    const isValid = fieldValidator.validate(value, obj)
                    if (!isValid) {
                        if (!errors) {
                            errors = {} as ArrayStringOf<T>
                        }
                        if (!errors[fieldName]) {
                            errors[fieldName as any] = []
                        }
                        var errorMessage = fieldValidator.errorMessage
                        if (fieldValidator.errorMessage) {
                            errorMessage = fieldValidator.errorMessage.replace(":value", value as any)
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
        errors: StringifyErrors<T>(errors)
    }
}

/**
 * Validates a spesific field of an object by the specified rules
 * @param obj the object to be validated
 * @param validationRules the validation rules
 * @returns 
 */
const validateField = <T>(obj: T, fieldName: string, validationRules: ValidationRules<T>): ValidationResult<T> | undefined => {
    var errors: ArrayStringOf<T> = undefined
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
                        errors = {} as ArrayStringOf<T>
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
        errors: StringifyErrors<T>(errors)
    }
}

/**
 * The validator objects, contains the main validation methods.
 */
export const validator = {
    validateObject: validateObject,
    validateField: validateField
}