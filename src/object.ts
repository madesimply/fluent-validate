import { Context } from "./types";

export const object = {
  coerce(this: Context, data: any) {
    return this.validate.object(data, (value) => {
      try {
        const parsed = JSON.parse(value);
        return { valid: true, error: null, value: parsed };
      } catch (e) {
        return { valid: false, error: "invalid object" };
      }
    });
  },
  default(this: Context, data: any, defaultValue: Record<string, any>) {
    return this.validate.object(data, (value) => {
      if (defaultValue === undefined || defaultValue === null) {
        return { valid: false, error: "invalid object" };
      }
      if (value === undefined || value === null) {
        return { valid: true, error: null, value: defaultValue };
      }
      return { valid: true, error: null, value };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return this.validate.object(data, (value) => {
      const valid = value !== undefined && value !== null;
      return { valid, error: valid ? null : msg || "object is required" };
    });
  },
  props(
    this: Context,
    data: any,
    props: Record<string, any>,
    msg: string = ""
  ) {
    return this.validate.object(data, (value) => {
      const keys = Object.keys(props);
      let valid = true;
      let failedKeys: string[] = [];

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
        const error =
          msg || failedKeys.length
            ? `invalid props - ${failedKeys.join(", ")}`
            : "";
        return { valid: false, error };
      }
      return { valid: true, error: null };
    });
  },
};
