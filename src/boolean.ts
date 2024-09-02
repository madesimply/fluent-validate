import { Context } from "./types";

export const boolean = {
  coerce(this: Context, data: any) {
    return this.validate.boolean(data, (value) => {
      try {
        const parsed = Boolean(value);
        return { valid: true, error: null, value: parsed };
      } catch (e) {
        return { valid: false, error: "invalid boolean" };
      }
    });
  },
  default(this: Context, data: any, defaultValue: boolean) {
    return this.validate.boolean(data, (value) => {
      if (defaultValue === undefined || defaultValue === null) {
        return { valid: false, error: "invalid boolean" };
      }
      if (value === undefined || value === null) {
        return { valid: true, error: null, value: defaultValue };
      }
      return { valid: true, error: null, value };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return this.validate.boolean(data, (value) => {
      const valid = value !== undefined && value !== null;
      return { valid, error: valid ? null : msg || "boolean is required" };
    });
  },
};
