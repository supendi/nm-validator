# nm-validator
This package is DEPRECATED.
The REPLACEMENT for is: https://www.npmjs.com/package/ts-validity

## Installation
```
npm i nm-validator
```
or
```
yarn add nm-validator
```

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
} from "nm-validator/dist/validationRules";

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

//Deep validation
const rules: ValidationRules<typeof company> = {
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
} from "nm-validator/dist/validationRules";

const registrant: Registrant = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationRule: ValidationRules<Registrant> = {
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

**Example 3 : Create and use your own field rule**

```javascript
import { validator } from "nm-validator";

//This is our custom field rule, should return the FieldValidator interface
const mustBePi: FieldRule = (errorMessage?: string) => {
  const c = 3.14;
  let msg = `The value must be ${c}`;
  if (errorMessage) {
    msg = errorMessage;
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

const validationRule: ValidationRules = {
  value: [mustBePi()],
};

const validationResult = validator.validateObject(pi, validationRule);

//Output
// validationResult = {
//   isValid: false,
//   errorMessages: {
//     value: ["The value must be 3.14"],
//   },
//   errors: {
//     value: "The value must be 3.14",
//   },
// };
```

**Example 4 : Deep validate spesific field**

```javascript
import { validator } from "nm-validator";
import {
  emailAddress,
  equal,
  minLength,
  required,
  regularExpression,
} from "nm-validator/dist/validationRules";

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

const rules: ValidationRules<typeof company> = {
  name: [required("Name is required")],
  address: {
    streetName: [required("The street name is required")],
    country: [elementOf(["US,FR,JP,ID"])],
    person: {
      age: [minNumber(17)],
    },
  },
};

//Validate only the age value 
const actual = validator.validateField(company, "address.person.age", rules);

//Output
//  validationResult = {
//   isValid: false,
//   errorMessages: {
//     address: {
//       person: {
//         age: ["The minimum value for this field is 17."],
//       },
//     },
//   },
//   errors: {
//     address: {
//       person: {
//         age: "The minimum value for this field is 17.",
//       },
//     },
//   },
// };
```
