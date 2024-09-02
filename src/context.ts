import { Context, Validator } from './types';

const validType = (value: any, type: string) => {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "array":
      return Array.isArray(value);
    case "object":
      return typeof value === "object";
    default:
      return false;
  }
}

function get(target: 'value' | 'valid' | 'errors', data: any, defaultValue?: any) {
  data[target] = data[target] || defaultValue;
  return data[target];
}

function set(target: 'value' | 'valid' | 'errors', data: any, value: any) {
  data[target] = value;
  return data;
}

function validate(
  self: Context,
  type: string,
  data: any,
  validator: Validator,
) {
  if (!self.validate) 
    throw new Error("validate is not defined in context");

  const errors = self.validate.get("errors", data, []);
  self.validate.set("errors", data, errors);
  self.validate.set("valid", data, errors.length === 0);

  const initialValue = self.validate.get("value", data);
  const result = validator(initialValue);
  const value = result.value || initialValue;

  if (!validType(value, type)) {
    self.validate.set("valid", data, false);
    if (!errors.includes(`invalid ${type}`)) {
      errors.push(`invalid ${type}`);
      self.validate.set("errors", data, errors);
    }
    return data;
  }

  if (!result.valid) {
    self.validate.set("valid", data, false);
    errors.push(result.error);
    self.validate.set("errors", data, errors);
  } else {
    if (result.value !== undefined && validType(result.value, type)) {
      self.validate.set("value", data, result.value);
    }
  }

  return data;
};


export const ctx: Context = {
  validate: { 
    set,
    get,
    string: (data: any, validator: Validator) => validate(ctx, 'string', data, validator),
    number: (data: any, validator: Validator) => validate(ctx, 'number', data, validator),
    boolean: (data: any, validator: Validator) => validate(ctx, 'boolean', data, validator),
    object: (data: any, validator: Validator) => validate(ctx, 'object', data, validator),
    array: (data: any, validator: Validator) => validate(ctx, 'array', data, validator),
  }
};