import { Context } from "./types";

export const array = {
  coerce(this: Context, data: any) {
    return this.validate.array(data, (value) => {
      try {
        const parsed = Array.isArray(value) ? value : JSON.parse(value);
        return { valid: true, error: null, value: parsed };
      } catch (e) {
        return { valid: false, error: "invalid array" };
      }
    });
  },
  default(this: Context, data: any, defaultValue: any[]) {
    return this.validate.array(data, (value) => {
      if (defaultValue === undefined || defaultValue === null) {
        return { valid: false, error: "invalid array" };
      }
      if (value === undefined || value === null) {
        return { valid: true, error: null, value: defaultValue };
      }
      return { valid: true, error: null, value };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return this.validate.array(data, (value) => {
      const valid = value !== undefined && value !== null;
      return { valid, error: valid ? null : msg || "array is required" };
    });
  },
  min(this: Context, data: any, min: number, msg: string = "") {
    return this.validate.array(data, (value) => {
      const valid = value && value.length >= min;
      return {
        valid,
        error: valid ? null : msg || `too short - min length ${min}`,
      };
    });
  },
  max(this: Context, data: any, max: number, msg: string = "") {
    return this.validate.array(data, (value) => {
      const valid = value && value.length <= max;
      return {
        valid,
        error: valid ? null : msg || `too long - max length ${max}`,
      };
    });
  },
  items(this: Context, data: any, items: any, msg: string = "") {
    return this.validate.array(data, (value) => {
      const valid =
        value &&
        value.every((v: any) => {
          const _data = {};
          this.validate.set("value", _data, v);

          return items.run(_data).valid;
        });
      return {
        valid,
        error: valid
          ? null
          : msg ||
            `invalid items - expected ${items.chain[0].method.split(".")[0]}`,
      };
    });
  },
};
