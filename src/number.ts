import { Context } from "./types";

function validate (self: Context, data: any, validator: ({ value }: { value: any }) => { valid: boolean, error: string | null }) {
  if (!self.validate) 
    throw new Error("validate is not defined in context");

  const errors = self.validate.get("errors", data, []);
  self.validate.set("errors", data, errors);
  self.validate.set("valid", data, errors.length === 0);

  const value = self.validate.get("value", data) as number;
  if (typeof value !== "number") {
    self.validate.set("valid", data, false);
    if (!errors.includes("invalid number")) {
      errors.push("invalid number");
      self.validate.set("errors", data, errors);
    }
    return data;
  }

  const result = validator({ value });
  if (!result.valid) {
    self.validate.set("valid", data, false);
    errors.push(result.error);
    self.validate.set("errors", data, errors);
  }

  return data;
}

export const number = {
  coerce(this: Context, data: any) {
    try {
      const value = this.validate.get("value", data, 0);
      this.validate.set("value", data, Number(value));
    } catch (e) {}

    return validate(this, data, () => {
      return { valid: true, error: null };
    });
  },
  default(this: Context, data: any, defaultValue: number) {
    const value = this.validate.get("value", data, null);
    if (value === undefined || value === null) {
      this.validate.set("value", data, defaultValue);
    }
    
    return validate(this, data, () => {
      return { valid: true, error: null };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = value !== undefined && value !== null;
      return { valid, error: valid ? null : msg || "number is required" };
    });
  },
  enum(this: Context, data: any, values: number[], msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = values.includes(value);
      return { valid, error: valid ? null : msg || "invalid value" };
    });
  },
  min(this: Context, data: any, min: number, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = value >= min;
      return { valid, error: valid ? null : msg || `too small - min value ${min}` };
    });
  },
  max(this: Context, data: any, max: number, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = value <= max;
      return { valid, error: valid ? null : msg || `too large - max value ${max}` };
    });
  },
  integer(this: Context, data: any, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = Number.isInteger(value);
      return { valid, error: valid ? null : msg || "invalid integer" };
    });
  }
}
