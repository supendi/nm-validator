# validator2-nm

## Usage
**Example 1 : Validate Object**
```javascript
import { validator } from "validator2-nm";
import { emailAddress, equal, minLength, required, regularExpression } from "validator2-nm/dist/validators";

const registrant: Registrant = {
    name: "",
    email: "supendi2gmail.com",
    password: "",
    confirmPassword: ""
}

const validationRule: ValidationRules = {
    name: [
        required("Name is required"),
        minLength(3, "The minimum length is 3")
    ],
    email: [
        required("Email is required"),
        emailAddress("Invalid email address")
    ]
}

const validationResult = validator.validateObject(registrant, validationRule)
//Output validationResult:
// validationResult = {
//     isValid: false,
//     errorMessages: {
//         name: [
//             "Name is required.",
//             "The minimum length is 3."
//         ],
//         email: [
//             "Invalid email address."
//         ]
//     },
//     errors: {
//         name: "Name is required. The minimum length is 3."
//         email: "Invalid email address."
//     }
// }
```

**Example 2 : Validate a Spesific Field**
```javascript
import { validator } from "validator2-nm";
import { emailAddress, equal, minLength, required, regularExpression } from "validator2-nm/dist/validators";

const registrant: Registrant = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
}

const validationRule: ValidationRules = {
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
const validationResult = validator.validateField(registrant, "email", validationRule)
//Output
// validationResult = {
//     isValid: false,
//     errorMessages: {
//         email: [
//             "Email is required",
//             "Invalid email address"
//         ]
//     },
//     errors: {
//         email: "Email is required. Invalid email address."
//     }
// }
```
