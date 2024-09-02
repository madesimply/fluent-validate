import { Context } from "./types";

export const number = {
  coerce(this: Context, data: any) {
    return this.validate.number(data, (value) => {
      try {
        const parsed = Number(value);  
        return { valid: true, error: null, value: parsed };
      } catch (e) {
        return { valid: false, error: "invalid number" };
      }
    });
  },
  default(this: Context, data: any, defaultValue: number) {
    return this.validate.number(data, (value) => {
      if (defaultValue === undefined || defaultValue === null) {
        return { valid: false, error: "invalid number" };
      }
      if (value === undefined || value === null) {
        return { valid: true, error: null, value: defaultValue };
      }
      return { valid: true, error: null, value };
    })
  },
  required(this: Context, data: any, msg: string = "") {
    return this.validate.number(data, (value) => {
      const valid = value !== undefined && value !== null;
      return { valid, error: valid ? null : msg || "number is required" };
    });
  },
  enum(this: Context, data: any, values: number[], msg: string = "") {
    return this.validate.number(data, (value) => {
      const valid = values.includes(value);
      return { valid, error: valid ? null : msg || "invalid value" };
    });
  },
  min(this: Context, data: any, min: number, msg: string = "") {
    return this.validate.number(data, (value) => {
      const valid = value >= min;
      return { valid, error: valid ? null : msg || `too small - min value ${min}` };
    });
  },
  max(this: Context, data: any, max: number, msg: string = "") {
    return this.validate.number(data, (value) => {
      const valid = value <= max;
      return { valid, error: valid ? null : msg || `too large - max value ${max}` };
    });
  },
  integer(this: Context, data: any, msg: string = "") {
    return this.validate.number(data, (value) => {
      const valid = Number.isInteger(value);
      return { valid, error: valid ? null : msg || "invalid integer" };
    });
  }
}
