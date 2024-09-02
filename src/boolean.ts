import { Context } from "./types";

function validate (self: Context, data: any, validator: ({ value }: { value: any }) => { valid: boolean, error: string | null }) {
  if (!self.validate) 
    throw new Error("validate is not defined in context");

  const errors = self.validate.get("errors", data, []);
  self.validate.set("errors", data, errors);
  self.validate.set("valid", data, errors.length === 0);

  const value = self.validate.get("value", data) as boolean;
  if (typeof value !== "boolean") {
    self.validate.set("valid", data, false);
    if (!errors.includes("invalid boolean")) {
      errors.push("invalid boolean");
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

export const boolean = {
  coerce(this: Context, data: any) {
    if (!this.validate) throw new Error("validate is not defined in context");

    try {
      const value = this.validate.get("value", data, false);
      this.validate.set("value", data, Boolean(value));
    } catch (e) {}

    return validate(this, data, () => {
      return { valid: true, error: null };
    });
  },
  default(this: Context, data: any, defaultValue: boolean) {
    if (!this.validate) throw new Error("validate is not defined in context");

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
      return { valid, error: valid ? null : msg || "boolean is required" };
    });
  }
};