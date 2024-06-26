import { FieldValidator, ValidationResult, ValidationRules, validator } from '../index'
import { required, minLength, emailAddress, maxLength, maxNumber, minNumber, regularExpression, equalTo, elementOf } from '../validationRules'

interface Registrant {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

describe("Validate Object Test", () => {
    it("should return 1 error of name and 2 errors of age", () => {
        const registrant: Registrant & any = {
            name: "",
            email: "irpan2gmail.com",
            password: "",
            confirmPassword: "",
            age: ""
        }

        const rules: ValidationRules<Registrant & any> = {
            name: [required("Name is required")],
            age: [
                required("required"),
                minNumber(18)
            ]
        }

        const actual = validator.validateObject(registrant, rules)
        const expected: ValidationResult<{
            name: string,
            age: string
        }> = {
            isValid: false,
            errorMessages: {
                name: [
                    "Name is required."
                ],
                age: ["required.", "The minimum value for this field is 18."]
            },
            errors: {
                name: "Name is required.",
                age: "required. The minimum value for this field is 18."
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })
    it("should return default error message of name", () => {
        const registrant: Registrant = {
            name: "",
            email: "irpan2gmail.com",
            password: "",
            confirmPassword: ""
        }

        const rules: ValidationRules<Registrant> = {
            name: [required()],
        }

        const actual = validator.validateObject(registrant, rules)

        const expected: ValidationResult<{
            name: string
        }> = {
            isValid: false,
            errorMessages: {
                name: [
                    "This field is required."
                ]
            },
            errors: {
                name: "This field is required."
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })
    it("should return 2 errors of name", () => {
        const registrant: Registrant = {
            name: "",
            email: "irpan2gmail.com",
            password: "",
            confirmPassword: ""
        }

        const validationRule: ValidationRules<Registrant> = {
            name: [
                required("Name is required"),
                minLength(3, "The minimum length is 3")
            ],
        }
        const actual = validator.validateObject(registrant, validationRule)

        const expected: ValidationResult<{
            name: string
        }> = {
            isValid: false,
            errorMessages: {
                name: [
                    "Name is required.",
                    "The minimum length is 3."
                ]
            },
            errors: {
                name: "Name is required. The minimum length is 3."
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })
    it("should return 1 error of name and 1 error of email", () => {
        const registrant: Registrant = {
            name: "ir",
            email: "irpan2gmail.com",
            password: "",
            confirmPassword: ""
        }

        const validationRule: ValidationRules<Registrant> = {
            name: [
                required("Name is required"),
                minLength(3, "The minimum length is 3")
            ],
            email: [
                required("Email is required."),
                emailAddress("Invalid email address.")
            ]
        }

        const actual = validator.validateObject(registrant, validationRule)
        const expected: ValidationResult<{
            name: string,
            email: string
        }> = {
            isValid: false,
            errorMessages: {
                name: [
                    "The minimum length is 3."
                ],
                email: [
                    "Invalid email address."
                ]
            },
            errors: {
                name: "The minimum length is 3.",
                email: "Invalid email address."
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })
    it("Test max length", () => {
        const registrant: Registrant = {
            name: "irpans",
            email: "irpan2gmail.com",
            password: "",
            confirmPassword: ""
        }

        const validationRule: ValidationRules<Registrant> = {
            name: [
                required("Name is required"),
                maxLength(5, "The maximum length is 5")
            ],
        }

        const actual = validator.validateObject(registrant, validationRule)
        const expected: ValidationResult<{
            name: string
        }> = {
            isValid: false,
            errorMessages: {
                name: [
                    "The maximum length is 5."
                ],
            },
            errors: {
                name: "The maximum length is 5.",
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })

    it("Test max number", () => {
        const person = {
            name: "irpans",
            age: 56
        }

        const validationRule: ValidationRules<typeof person> = {
            age: [
                maxNumber(55, "The maximum age is 55")
            ],
        }

        const actual = validator.validateObject(person, validationRule)
        const expected: ValidationResult<{
            age: string
        }> = {
            isValid: false,
            errorMessages: {
                age: [
                    "The maximum age is 55."
                ],
            },
            errors: {
                age: "The maximum age is 55.",
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })
    it("Test min number", () => {
        const person = {
            name: "irpans",
            age: 17
        }

        const validationRule: ValidationRules<typeof person> = {
            age: [
                minNumber(18, "You cant access a porn site if you are under 18")
            ],
        }

        const actual = validator.validateObject(person, validationRule)
        const expected: ValidationResult<{
            age: string
        }> = {
            isValid: false,
            errorMessages: {
                age: [
                    "You cant access a porn site if you are under 18."
                ],
            },
            errors: {
                age: "You cant access a porn site if you are under 18.",
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })

    it("Test regex and error", () => {
        const loginRequest = {
            password: "cumaMisCall1"
        }

        const validationRule: ValidationRules<typeof loginRequest> = {
            password: [
                regularExpression(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])([A-Za-z\d]|[^a-zA-Z\d]){8,}$/, "Your password must be at least 8 characters long, contain at least one special character, number and have a mixture of uppercase and lowercase letters.")
            ],
        }

        const actual = validator.validateObject(loginRequest, validationRule)
        const expected: ValidationResult<{
            password: string
        }> = {
            isValid: false,
            errorMessages: {
                password: [
                    "Your password must be at least 8 characters long, contain at least one special character, number and have a mixture of uppercase and lowercase letters."
                ],
            },
            errors: {
                password: "Your password must be at least 8 characters long, contain at least one special character, number and have a mixture of uppercase and lowercase letters.",
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })

    it("Test regex and passed", () => {
        const loginRequest = {
            password: "cumaMisCall1!"
        }

        const validationRule: ValidationRules<typeof loginRequest> = {
            password: [
                regularExpression(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])([A-Za-z\d]|[^a-zA-Z\d]){8,}$/, "Your password must be at least 8 characters long, contain at least one special character, number and have a mixture of uppercase and lowercase letters.")
            ],
        }

        const actual = validator.validateObject(loginRequest, validationRule)
        const expected: ValidationResult<{
            password: string
        }> = {
            isValid: true,
            errorMessages: undefined,
            errors: undefined
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })

    it("Test equal", () => {
        const changePassword = {
            password: "cumaMisCall1!",
            confirmPassword: "cumaMisCall1"
        }

        const validationRule: ValidationRules<typeof changePassword> = {
            confirmPassword: [
                equalTo("password")
            ],
        }

        const actual = validator.validateObject(changePassword, validationRule)
        const expected: ValidationResult<{
            confirmPassword: string
        }> = {
            isValid: false,
            errorMessages: {
                confirmPassword: ["The value should be equal to password value."]
            },
            errors: {
                confirmPassword: "The value should be equal to password value."
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })

    it("Test missing property but required", () => {
        const registrant: Registrant & any = {
            names: "",
        }
        const rules: ValidationRules<Registrant> = {
            name: [required("Name is required")]
        }

        const actual = validator.validateObject(registrant, rules)
        const expected: ValidationResult<{
            name: string,
        }> = {
            isValid: false,
            errorMessages: {
                name: [
                    "Name is required."
                ],
            },
            errors: {
                name: "Name is required.",
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })
})


describe("Validate Field Test", () => {
    it("should return 2 errors of email", () => {
        const registrant: Registrant = {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }

        const validationRule: ValidationRules<Registrant> = {
            name: [
                required("Name is required"),
                minLength(3, "The minimum length is 3")
            ],
            email: [
                required("Email is required"),
                emailAddress("Invalid email address")
            ]
        }

        //only validate the email field
        const actual = validator.validateField(registrant, "email", validationRule)

        //Should only return the email errors only
        const expected: ValidationResult<{
            email: string
        }> = {
            isValid: false,
            errorMessages: {
                email: [
                    "Email is required.",
                    "Invalid email address."
                ]
            },
            errors: {
                email: "Email is required. Invalid email address."
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })

    it("should return 1 error of pi.value", () => {
        const mustBePi: (errorMessage?: string) => FieldValidator = (errorMessage?: string) => {
            const c = 3.14;
            let msg = `The value must be ${c}`;
            if (errorMessage) {
                msg = errorMessage
            }
            const validator: FieldValidator = {
                errorMessage: msg,
                validate: (value: any, objRef?: any): boolean => {
                    return value === c;
                },
            };
            return validator;
        };

        const pi = {
            value: 3.13,
        };

        const validationRule: ValidationRules<typeof pi> = {
            value: [mustBePi()],
        };

        const actual = validator.validateObject(pi, validationRule)
        const expected: ValidationResult<{
            value: string,
        }> = {
            isValid: false,
            errorMessages: {
                value: [
                    "The value must be 3.14"
                ],
            },
            errors: {
                value: "The value must be 3.14",
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })
})

describe("Deep Validate Object Test", () => {
    it("should return 1 error of name", () => {
        const company = {
            name: "",
            email: "irpan2gmail.com",
            address: {
                streetName: "",
                country: "UK",
                person: {
                    age: 15
                }
            }
        }

        const rules: ValidationRules<typeof company> = {
            name: [required("Name is required")],

            address: {
                streetName: [
                    required("The street name is required")
                ],
                country: [
                    elementOf(["US,FR,JP,ID"])
                ],
                person: {
                    age: [minNumber(17)]
                }
            }
        }

        const actual = validator.validateObject(company, rules)
        const expected: ValidationResult<{
            name: string,
            address: {
                streetName: string,
                country: string,
                person: {
                    age: string
                }
            }
        }> = {
            isValid: false,
            errorMessages: {
                name: [
                    "Name is required."
                ],
                address: {
                    streetName: ["The street name is required."],
                    country: ["The value 'UK' is not the element of [US,FR,JP,ID]."],
                    person: {
                        age: ["The minimum value for this field is 17."]
                    }
                }
            },
            errors: {
                name: "Name is required.",
                address: {
                    streetName: "The street name is required.",
                    country: "The value 'UK' is not the element of [US,FR,JP,ID].",
                    person: {
                        age: "The minimum value for this field is 17."
                    }
                }
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })
})

describe("Deep Validate Field Test", () => {
    it("should return 1 error of name", () => {
        interface Company {
            name: string,
            email: string,
            address: {
                streetName: string,
                country: string,
                person: {
                    age: number
                }
            },
            items: { name: string }[],
            date: Date
        }

        const company: Company = {
            name: "",
            email: "irpan2gmail.com",
            address: {
                streetName: "",
                country: "UK",
                person: {
                    age: 15
                }
            },
            items: [],
            date: new Date()
        }

        const rules: ValidationRules<typeof company> = {
            name: [required("Name is required")],
            address: {
                streetName: [
                    required("The street name is required")
                ],
                country: [
                    elementOf(["US,FR,JP,ID"])
                ],
                person: {
                    age: [minNumber(17)]
                }
            },
            items: [minLength(1)]
        }

        const actual = validator.validateField(company, "address.person.age", rules)
        if (actual.errors.items === "") {

        }
        if (actual.errors.date === "") {

        }
        const expected: ValidationResult<{
            address: {
                person: {
                    age: string
                }
            }
        }> = {
            isValid: false,
            errorMessages: {
                address: {
                    person: {
                        age: ["The minimum value for this field is 17."]
                    }
                }
            },
            errors: {
                address: {
                    person: {
                        age: "The minimum value for this field is 17."
                    }
                }
            }
        }
        // console.error(actual)
        expect(actual).toEqual(expected)
    })
})