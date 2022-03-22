/**
 * Contains built in validation rules
 */

import { FieldValidator } from '.'

export type RequiredRule = (errorMessage?: string) => FieldValidator
export type MinNumberRule = (min: number, errorMessage?: string) => FieldValidator
export type MaxNumberRule = (max: number, errorMessage?: string) => FieldValidator
export type MinLengthRule = (min: number, errorMessage?: string) => FieldValidator
export type MaxLengthRule = (max: number, errorMessage?: string) => FieldValidator
export type EmailAddressRule = (errorMessage?: string) => FieldValidator
export type RegularExpressionRule = (regex: RegExp, errorMessage?: string) => FieldValidator
export type EqualToRule = (equalToFieldName: string, errorMessage?: string) => FieldValidator
export type ElementOfRule = <T>(list: T[], errorMessage?: string) => FieldValidator
export type ContainUpperLowerCaseRule = (errorMessage?: string) => FieldValidator
export type ContainNumberRule = (errorMessage?: string) => FieldValidator
export type ContainSpecialCharRule = (errorMessage?: string) => FieldValidator
export type StrongPasswordRule = (errorMessage?: string) => FieldValidator

/** 
 * Appends a dot (.) to the input string
*/
export const appendDot = (input: string) => {
    if (!input) {
        return input
    }
    const symbols = ["!", ".", "?", ";"]
    const endedWithSymbol = symbols.find(x => x === input.substring(input.length - 1))
    if (!endedWithSymbol) {
        input = input + "."
    }
    return input
}

/**
 * Returns a required validation rule
 * @param errorMessage Custom error messages
 * @returns 
 */
export const required: RequiredRule = (errorMessage?: string) => {
    let msg = "This field is required"
    if (errorMessage) {
        msg = errorMessage
    }
    msg = appendDot(msg)

    const validator: FieldValidator = {
        errorMessage: msg,
        validate: (value: any, objRef?: any): boolean => {
            if (!value) {
                return false
            }
            return true
        },
    }
    return validator
}

/**
 * Returns a minimum number validation rule
 * @param errorMessage Custom error messages
 * @returns 
 */
export const minNumber: MinNumberRule = (min: number, errorMessage?: string) => {

    let msg = `The minimum value for this field is ${min}`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = appendDot(msg)

    const validator: FieldValidator = {
        validate: (value: number, objRef?: any): boolean => {

            if (!value) {
                return false
            }

            return value >= min
        },
        errorMessage: msg
    }
    return validator
}

/**
 * Returns a maximum number validation rule
 * @param errorMessage Custom error messages
 * @returns 
 */
export const maxNumber: MaxNumberRule = (max: number, errorMessage?: string) => {
    let msg = `The maximum value for this field is ${max}`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = appendDot(msg)

    const validator: FieldValidator = {
        validate: (value: number, objRef?: any): boolean => {

            if (!value) {
                return false
            }

            return value <= max
        },
        errorMessage: msg
    }
    return validator
}

/**
 * Returns a minimum length validation rule
 * @param errorMessage Custom error messages
 * @returns 
 */
export const minLength: MinLengthRule = (min: number, errorMessage?: string) => {

    let msg = `The minimum length for this field is ${min}`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = appendDot(msg)

    const validator: FieldValidator = {
        validate: (value: any, objRef?: any): boolean => {

            if (!value) {
                return false
            }
            if (min < 1) {
                console.error("Validator: min length should be > 0")
                return false
            }
            let actualLength = value.length
            return actualLength >= min
        },
        errorMessage: msg
    }
    return validator
}

/**
 * Returns a maximum length validation rule
 * @param errorMessage Custom error messages
 * @returns 
 */
export const maxLength: MaxLengthRule = (max: number, errorMessage?: string) => {

    let msg = `The maximum length for this field is ${max}`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = appendDot(msg)

    const validator: FieldValidator = {
        validate: (value: any, objRef?: any): boolean => {

            if (!value) {
                return false
            }
            if (max < 0) {
                console.error("Validator: max length should be > 0")
                return false
            }
            let actualLength = value.length
            return actualLength <= max
        },
        errorMessage: msg
    }
    return validator
}

/**
 * Returns the email address validation rule
 * @param errorMessage Custom error messages
 * @returns 
 */
export const emailAddress: EmailAddressRule = (errorMessage?: string) => {
    let msg = `Invalid email address. The valid email example: john.doe@example.com`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = appendDot(msg)

    const validator: FieldValidator = {
        validate: (value: string, objRef?: any): boolean => {
            if (!value) {
                return false
            }
            var regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return regex.test(value)
        },
        errorMessage: msg
    }
    return validator
}

/**
 * Returns a regex validation rule
 * @param errorMessage Custom error messages
 * @returns 
 */
export const regularExpression: RegularExpressionRule = (regex: RegExp, errorMessage?: string) => {
    let msg = `The value ':value' doesn't match to the regular expression spesification`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = appendDot(msg)

    const validator: FieldValidator = {
        validate: (value: any, objRef?: any): boolean => {
            return regex.test(value)
        },
        errorMessage: msg
    }
    return validator
}

/**
 * Returns a validation rule, which value should be equal to the specified field
 * @param errorMessage Custom error messages
 * @returns 
 */
export const equalTo: EqualToRule = (equalToFieldName: string, errorMessage?: string) => {
    let msg = `The value should be equal to ${equalToFieldName} value`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = appendDot(msg)
    const validator: FieldValidator = {
        validate: (value: any, objRef?: any): boolean => {
            return value === objRef[equalToFieldName]
        },
        errorMessage: msg
    }
    return validator
}

/**
 * Returns a validation rule, which value should be one of element of the specified array
 * @param errorMessage Custom error messages
 * @returns 
 */
export const elementOf: ElementOfRule = <T>(list: T[], errorMessage?: string) => {
    if (!list) {
        console.error(`Validator: the list is ${list}`)
    }
    let msg = `The value ':value' is not the element of [${list.join(", ")}].`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = appendDot(msg)
    const validator: FieldValidator = {
        validate: (value: any, objRef?: any): boolean => {
            if (!list) {
                return false
            }

            var element = list.find(x => x === value)
            return !!element
        },
        errorMessage: msg
    }
    return validator
}

export const containUpperLowerCase: ContainUpperLowerCaseRule = (errorMessage?: string) => {
    return regularExpression(/^(?=.*[a-z])(?=.*[A-Z])/, errorMessage)
}

export const containNumber: ContainNumberRule = (errorMessage?: string) => {
    return regularExpression(/^(?=.*\d)/, errorMessage)
}

export const containSpecialChar: ContainSpecialCharRule = (errorMessage?: string) => {
    return regularExpression(/^(?=.*[^a-zA-Z\d])([A-Za-z\d]|[^a-zA-Z\d])/, errorMessage)
}

export const strongPasswordRule: StrongPasswordRule = (errorMessage?: string) => {
    return regularExpression(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])([A-Za-z\d]|[^a-zA-Z\d]){8,}$/, errorMessage)
}
