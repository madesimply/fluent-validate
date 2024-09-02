# fluent-validate

fluent-validate is a flexible and chainable validation library built on top of Fluent. It provides a simple and intuitive way to validate various data types with a fluent interface.

## Installation

To install fluent-validate, use npm:

```bash
npm install fluent-validate
```

## Quickstart

```javascript
import { validate as v } from "fluent-validate";

// Create a validation chain
const validator = v.string.required().min(5).max(10);

// Run the validation
const result = validator.run({ value: "hello" });
console.log(result.valid); // true
console.log(result.value); // "hello"

// Invalid input
const invalidResult = validator.run({ value: "hi" });
console.log(invalidResult.valid); // false
```

## API Reference

fluent-validate provides validation methods for several data types. Many of these methods accept an optional `msg` parameter to provide custom error messages.

### String Validation

- `v.string.coerce()`: Coerces the input to a string.
- `v.string.default(value)`: Sets a default value if input is undefined.
- `v.string.required(msg?)`: Ensures the value is not empty. Accepts an optional custom error message.
- `v.string.enum(values, msg?)`: Checks if the value is one of the provided options. Accepts an optional custom error message.
- `v.string.min(length, msg?)`: Ensures the string is at least the specified length. Accepts an optional custom error message.
- `v.string.max(length, msg?)`: Ensures the string is at most the specified length. Accepts an optional custom error message.
- `v.string.length(exactLength, msg?)`: Ensures the string is exactly the specified length. Accepts an optional custom error message.
- `v.string.match(regex, msg?)`: Ensures the string matches the provided regular expression. Accepts an optional custom error message.

### Number Validation

- `v.number.coerce()`: Coerces the input to a number.
- `v.number.default(value)`: Sets a default value if input is undefined.
- `v.number.required(msg?)`: Ensures the value is not undefined. Accepts an optional custom error message.
- `v.number.enum(values, msg?)`: Checks if the value is one of the provided options. Accepts an optional custom error message.
- `v.number.min(value, msg?)`: Ensures the number is at least the specified value. Accepts an optional custom error message.
- `v.number.max(value, msg?)`: Ensures the number is at most the specified value. Accepts an optional custom error message.
- `v.number.integer(msg?)`: Ensures the number is an integer. Accepts an optional custom error message.

### Array Validation

- `v.array.coerce()`: Coerces the input to an array.
- `v.array.default(value)`: Sets a default value if input is undefined.
- `v.array.required(msg?)`: Ensures the value is not undefined. Accepts an optional custom error message.
- `v.array.min(length, msg?)`: Ensures the array has at least the specified number of items. Accepts an optional custom error message.
- `v.array.max(length, msg?)`: Ensures the array has at most the specified number of items. Accepts an optional custom error message.
- `v.array.items(validator)`: Applies the given validator to each item in the array.

### Object Validation

- `v.object.coerce()`: Coerces the input to an object.
- `v.object.default(value)`: Sets a default value if input is undefined.
- `v.object.required(msg?)`: Ensures the value is not undefined. Accepts an optional custom error message.
- `v.object.props(schema)`: Validates the object's properties against the provided schema.

### Boolean Validation

- `v.boolean.coerce()`: Coerces the input to a boolean.
- `v.boolean.default(value)`: Sets a default value if input is undefined.
- `v.boolean.required(msg?)`: Ensures the value is not undefined. Accepts an optional custom error message.

## Examples

Here are some examples of how to use fluent-validate:

```javascript
// String validation
const stringValidator = v.string.required("This field is required").min(5, "Minimum 5 characters").max(10, "Maximum 10 characters");
console.log(stringValidator.run({ value: "hello" }).valid); // true
console.log(stringValidator.run({ value: "hi" }).valid); // false

// Number validation
const numberValidator = v.number.required("Age is required").min(18, "Must be at least 18").max(100, "Must be at most 100");
console.log(numberValidator.run({ value: 25 }).valid); // true
console.log(numberValidator.run({ value: 15 }).valid); // false

// Array validation
const arrayValidator = v.array.required("List is required").min(2, "At least 2 items required").max(5, "At most 5 items allowed").items(v.number.required("Each item must be a number"));
console.log(arrayValidator.run({ value: [1, 2, 3] }).valid); // true
console.log(arrayValidator.run({ value: [1, "2"] }).valid); // false

// Object validation
const objectValidator = v.object.required("Object is required").props({
  name: v.string.required("Name is required"),
  age: v.number.required("Age is required").min(18, "Must be at least 18")
});
console.log(objectValidator.run({ value: { name: "John", age: 25 } }).valid); // true
console.log(objectValidator.run({ value: { name: "Jane", age: 16 } }).valid); // false

// Boolean validation
const booleanValidator = v.boolean.required("Boolean value is required");
console.log(booleanValidator.run({ value: true }).valid); // true
console.log(booleanValidator.run({ value: undefined }).valid); // false
```

## Custom Data Access

fluent-validate provides the ability to customize how it accesses and modifies the data object passed to the `run` method. This allows you to adapt the library to work with various data structures and naming conventions.

### Default Behavior

By default, fluent-validate expects the data object to have `value`, `valid`, and `errors` properties at the top level. The default getter and setter functions look like this:

```typescript
function get(target: 'value' | 'valid' | 'errors', data: any, defaultValue?: any) {
  data[target] = data[target] || defaultValue;
  return data[target];
}

function set(target: 'value' | 'valid' | 'errors', data: any, value: any) {
  data[target] = value;
  return data;
}
```

### Customizing Data Access

You can customize this behavior by providing your own `get` and `set` functions and initializing your own fluent validator. This allows you to work with different data structures or property names.

Here's an example of how to set up custom get/set functions:

```typescript
import { fluent } from 'fluent';
import { api, ctx } from 'fluent-validate';

const customGet = (target: 'value' | 'valid' | 'errors', data: any, defaultValue?: any) => {
  // Custom logic to retrieve data
  // For example, if your data structure uses different property names:
  const map = { value: 'inputValue', valid: 'isValid', errors: 'validationErrors' };
  return data[map[target]] || defaultValue;
};

const customSet = (target: 'value' | 'valid' | 'errors', data: any, value: any) => {
  // Custom logic to set data
  const map = { value: 'inputValue', valid: 'isValid', errors: 'validationErrors' };
  data[map[target]] = value;
  return data;
};

const ctx = {
  validate: { 
    ...ctx,
    get: customGet,
    set: customSet,
  }
};

export const validate = fluent({ api, ctx });
```

With this setup, the validator will use your custom `get` and `set` functions to access and modify the data object. This allows you to use fluent-validate with various data structures or integrate it more easily with existing codebases that have different conventions for storing validation state.


### Extending The Api

You can add custom validations to the base types (`string`, `number`, `boolean`, `array` or `object`) by extending the base `api` and initializing your own validator. 

API methods take the following args: 
- `this: Context` the context of the api
- `data: any` the data sent to run
- `arg: ...any[]` any args you want to expose via the chain
- `msg: string = ""` an optional custom error message

API methods must call one of the base validators available via the context and be sent `data` and a function that returns `{ valid: boolean, error: string | null, value?: any }`

If provided a value, and if that value is a valid type -> you can set it for things like casting. 

If an error is provided it will be added to the `errors` array. The `validators` handle getting and setting to the correct keys via the `ctx.get` and `ctx.set`

```typescript
import { fluent } from 'fluent';
import { api, ctx, Context } from 'fluent-validate';

const enhancedApi = {
  ...api,
  string: {
    ...api.string,
    email(this: Context, data: any, msg: string = "") { 
      return this.validate.string(data, (value) => {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return { valid, error: valid ? null : msg || "invalid email" };
      });
    }
  }
}

const validate = fluent({ api: enhancedApi, ctx });
const valid = validate.string.email('invalid email').run({ value: 'test' }).valid; // false
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.