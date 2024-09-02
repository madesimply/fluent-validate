import { Context } from "./types";

export const string = {
  coerce(this: Context, data: any) {
    return this.validate.string(data, (value) => {
      try {
        const parsed = value.toString();
        return { valid: true, error: null, value: parsed };
      } catch (e) {
        return { valid: false, error: "invalid string" };
      }
    });
  },
  default(this: Context, data: any, defaultValue: string) {
    return this.validate.string(data, (value) => {
      if (defaultValue === undefined || defaultValue === null) {
        return { valid: false, error: "invalid string" };
      }
      if (value === undefined || value === null) {
        return { valid: true, error: null, value: defaultValue };
      }
      return { valid: true, error: null, value };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return this.validate.string(data, (value) => {
      const valid = value !== undefined && value !== null;
      return { valid, error: valid ? null : msg || "string is required" };
    });
  },
  enum(this: Context, data: any, values: string[], msg: string = "") {
    return this.validate.string(data, (value) => {
      const valid = values.includes(value);
      return { valid, error: valid ? null : msg || "invalid value" };
    });
  },
  min(this: Context, data: any, min: number, msg: string = "") {
    return this.validate.string(data, (value) => {
      const valid = !!(value && value.length >= min);
      return {
        valid,
        error: valid ? null : msg || `too short - min length ${min}`,
      };
    });
  },
  max(this: Context, data: any, max: number, msg: string = "") {
    return this.validate.string(data, (value) => {
      const valid = !!(value && value.length <= max);
      return {
        valid,
        error: valid ? null : msg || `too long - max length ${max}`,
      };
    });
  },
  length(this: Context, data: any, length: number, msg: string = "") {
    return this.validate.string(data, (value) => {
      const valid = !!(value && value.length === length);
      return {
        valid,
        error: valid ? null : msg || `invalid length - length ${length}`,
      };
    });
  },
  match(this: Context, data: any, pattern: string, msg: string = "") {
    return this.validate.string(data, (value) => {
      const valid = new RegExp(pattern).test(value);
      return { valid, error: valid ? null : msg || "invalid pattern" };
    });
  },
};
