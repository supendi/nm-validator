import { FieldValidator, FieldRule } from '.'

const addDot = (input: string) => {
    if (!input) {
        return input
    }
    const symbols = ["!", ".", "?", ";"]
    const endedWithDot = symbols.find(x => x === input.substring(input.length - 1))
    if (!endedWithDot) {
        input = input + "."
    }
    return input
}

export const required: FieldRule = (errorMessage?: string) => {
    let msg = "This field is required"
    if (errorMessage) {
        msg = errorMessage
    }
    msg = addDot(msg)

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

export const minNumber: FieldRule = (min: number, errorMessage?: string) => {

    let msg = `The minimum value for this field is ${min}`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = addDot(msg)

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

export const maxNumber: FieldRule = (max: number, errorMessage?: string) => {
    let msg = `The maximum value for this field is ${max}`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = addDot(msg)

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

export const minLength: FieldRule = (min: number, errorMessage?: string) => {

    let msg = `The minimum length for this field is ${min}`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = addDot(msg)

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

export const maxLength: FieldRule = (max: number, errorMessage?: string) => {

    let msg = `The maximum length for this field is ${max}`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = addDot(msg)

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

export const emailAddress: FieldRule = (errorMessage?: string) => {
    let msg = `Invalid email address. The valid email example: john.doe@example.com`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = addDot(msg)

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

export const regularExpression: FieldRule = (regex: RegExp, errorMessage: string) => {
    let msg = `The value ':value' doesn't match to the regular expression spesification`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = addDot(msg)

    const validator: FieldValidator = {
        validate: (value: any, objRef?: any): boolean => {
            return regex.test(value)
        },
        errorMessage: msg
    }
    return validator
}

export const equal: FieldRule = (equalToFieldName: string, errorMessage: string) => {
    let msg = `The value should be equal to ${equalToFieldName} value`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = addDot(msg)
    const validator: FieldValidator = {
        validate: (value: any, objRef?: any): boolean => {
            return value === objRef[equalToFieldName]
        },
        errorMessage: msg
    }
    return validator
}

export const elementOf: FieldRule = <T>(list: T[], errorMessage: string) => {
    if (!list) {
        console.error(`Validator: the list is ${list}`)
    }
    let msg = `The value ':value' is not the element of [${list.join(", ")}].`
    if (errorMessage) {
        msg = errorMessage
    }

    msg = addDot(msg)
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