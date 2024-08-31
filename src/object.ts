import { Context } from "./types";

function validate (data: any, validator: () => { valid: boolean, error: string | null }) {
  data.errors = data.errors || [];
  data.valid = data.errors.length === 0;

  const value = data.value as any;
  if (typeof value !== "object" || value === null) {
    data.valid = false;
    if (!data.errors.includes("invalid object")) {
      data.errors.push("invalid object");
    }
    return data;
  }

  const result = validator();
  if (!result.valid) {
    data.valid = false;
    data.errors.push(result.error);
  }

  return data;
}

export const object = {
  coerce(this: Context, data: any, msg: string = "") {
    try {
      data.value = JSON.parse(data.value);
    } catch (e) {}

    return validate(data, () => {
      return { valid: true, error: null };
    });
  },
  default(this: Context, data: any, defaultValue: Record<string, any>) {
    if (data.value === undefined || data.value === null) {
      data.value = defaultValue;
    }
    return validate(data, () => {
      return { valid: true, error: null };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return validate(data, () => {
      const value = data.value as any;
      const valid = value && Object.keys(value).length > 0;
      return { valid, error: valid ? null : msg || "object is required" };
    });
  },
  props(this: Context, data: any, props: Record<string, any>, msg: string = "") {
    return validate(data, () => {
      const value = data.value as any;
      const keys = Object.keys(props);
      let valid = true;
      let failedKeys: string[] = [];
      for (const key of keys) {
        const validator = props[key];
        const result = validator.run({ value: value[key] });
        if (!result.valid) {
          valid = false;
          data.errors.push(...result.errors.map((err: string) => `${key}: ${err}`));
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