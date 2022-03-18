# nm-validator

## Usage

**Example 1 : Validate Object**

```javascript
import { validator } from "nm-validator";
import {
  emailAddress,
  equal,
  minLength,
  required,
  regularExpression,
} from "nm-validator/dist/validators";

const company = {
  name: "",
  email: "irpan2gmail.com",
  address: {
    streetName: "",
    country: "UK",
    person: {
      age: 15,
    },
  },
};

const rules: ValidationRules = {
  name: [required("Name is required")],
  address: {
    streetName: [required("The street name is required")],
    country: [elementOf(["US,FR,JP,ID"])],
    person: {
      age: [minNumber(17)],
    },
  },
};

const validationResult = validator.validateObject(registrant, validationRule);
//Output validationResult:
// validationResult = {
//   isValid: false,
//   errorMessages: {
//     name: ["Name is required."],
//     address: {
//       streetName: ["The street name is required."],
//       country: ["The value 'UK' is not the element of [US,FR,JP,ID]."],
//       person: {
//         age: ["The minimum value for this field is 17."],
//       },
//     },
//   },
//   errors: {
//     name: "Name is required.",
//     address: {
//       streetName: "The street name is required.",
//       country: "The value 'UK' is not the element of [US,FR,JP,ID].",
//       person: {
//         age: "The minimum value for this field is 17.",
//       },
//     },
//   },
// };
```

**Example 2 : Validate a Spesific Field**

```javascript
import { validator } from "nm-validator";
import {
  emailAddress,
  equal,
  minLength,
  required,
  regularExpression,
} from "nm-validator/dist/validators";

const registrant: Registrant = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationRule: ValidationRules = {
  name: [required("Name is required"), minLength(3, "The minimum length is 3")],
  email: [required("Email is required"), emailAddress("Invalid email address")],
};

//only validate the email field
const validationResult = validator.validateField(
  registrant,
  "email",
  validationRule
);
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
