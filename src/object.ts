import { Context } from "./types";

function validate (self: Context, data: any, validator: ({ value }: { value: any }) => { valid: boolean, error: string | null }) {
  if (!self.validate) 
    throw new Error("validate is not defined in context");

  const errors = self.validate.get("errors", data, []);
  self.validate.set("errors", data, errors);
  self.validate.set("valid", data, errors.length === 0);

  const value = self.validate.get("value", data) as any;
  if (typeof value !== "object" || value === null) {
    self.validate.set("valid", data, false);
    if (!errors.includes("invalid object")) {
      errors.push("invalid object");
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

export const object = {
  coerce(this: Context, data: any) {
    if (!this.validate) 
      throw new Error("validate is not defined in context");

    try {
      this.validate.set("value", data, JSON.parse(data.value));
    } catch (e) {}

    return validate(this, data, () => {
      return { valid: true, error: null };
    });
  },
  default(this: Context, data: any, defaultValue: Record<string, any>) {
    if (!this.validate) 
      throw new Error("validate is not defined in context");

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
      const valid = value && Object.keys(value).length > 0;
      return { valid, error: valid ? null : msg || "object is required" };
    });
  },
  props(this: Context, data: any, props: Record<string, any>, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const keys = Object.keys(props);
      let valid = true;
      let failedKeys: string[] = [];

      if (!this.validate)
        throw new Error("validate is not defined in context");

      for (const key of keys) {
        const validator = props[key];
        const _data = {};
        const errors = this.validate.get("errors", _data, []);
        this.validate.set("value", _data, value[key]);

        const result = validator.run(_data);
        if (!result.valid) {
          valid = false;
          const _errors = this.validate.get("errors", result, []);
          errors.push(..._errors.map((err: string) => `${key}: ${err}`));
          failedKeys.push(key);
        }
      }
      if (!valid) {
        const error = msg || failedKeys.length ? `invalid props - ${failedKeys.join(", ")}` : "";
        return { valid: false, error };
      }
      return { valid: true, error: null };
    });
  }
}