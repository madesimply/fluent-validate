import { Context } from "./types";

function validate (self: Context, data: any, validator: ({ value }: { value: any }) => { valid: boolean, error: string | null }) {
  if (!self.validate)
    throw new Error("validate is not defined in context");

  const errors = self.validate.get("errors", data, []);
  self.validate.set("errors", data, errors);
  self.validate.set("valid", data, errors.length === 0);

  const value = self.validate.get("value", data) as any;
  if (typeof value !== "string") {
    self.validate.set("valid", data, false);
    if (!errors.includes("invalid string")) {
      errors.push("invalid string");
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

export const string = {
  coerce(this: Context, data: any) {
    try {
      this.validate.set("value", data, data.value.toString());
    } catch (e) {}

    return validate(this, data, () => {
      return { valid: true, error: null };
    });
  },
  default(this: Context, data: any, defaultValue: string) {
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
      const valid = !!(value && value.length > 0);
      return { valid, error: valid ? null : msg || "string is required" };
    });
  },
  enum(this: Context, data: any, values: string[], msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = values.includes(value);
      return { valid, error: valid ? null : msg || "invalid value" };
    });
  },
  min(this: Context, data: any, min: number, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = !!(value && value.length >= min);
      return { valid, error: valid ? null : msg || `too short - min length ${min}` };
    });
  },
  max(this: Context, data: any, max: number, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = !!(value && value.length <= max);
      return { valid, error: valid ? null : msg || `too long - max length ${max}` };
    });
  },
  length(this: Context, data: any, length: number, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = !!(value && value.length === length);
      return { valid, error: valid ? null : msg || `invalid length - length ${length}` };
    });
  },
  match(this: Context, data: any, pattern: string, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = new RegExp(pattern).test(value);
      return { valid, error: valid ? null : msg || "invalid pattern" };
    });
  }
}
