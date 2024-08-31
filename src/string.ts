import { Context } from "./types";

function validate (data: any, validator: () => { valid: boolean, error: string | null }) {
  data.errors = data.errors || [];
  data.valid = data.errors.length === 0;

  const value = data.value as string;
  if (typeof value !== "string") {
    data.valid = false;
    if (!data.errors.includes("invalid string")) {
      data.errors.push("invalid string");
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

export const string = {
  coerce(this: Context, data: any, msg: string = "") {
    try {
      data.value = data.value.toString();
    } catch (e) {}

    return validate(data, () => {
      return { valid: true, error: null };
    });
  },
  default(this: Context, data: any, defaultValue: string) {
    if (data.value === undefined || data.value === null) {
      data.value = defaultValue;
    }

    return validate(data, () => {
      return { valid: true, error: null };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return validate(data, () => {
      const value = data.value as string;
      const valid = !!(value && value.length > 0);
      return { valid, error: valid ? null : msg || "string is required" };
    });
  },
  enum(this: Context, data: any, values: string[], msg: string = "") {
    return validate(data, () => {
      const value = data.value as string;
      const valid = values.includes(value);
      return { valid, error: valid ? null : msg || "invalid value" };
    });
  },
  min(this: Context, data: any, min: number, msg: string = "") {
    return validate(data, () => {
      const value = data.value as string;
      const valid = !!(value && value.length >= min);
      return { valid, error: valid ? null : msg || `too short - min length ${min}` };
    });
  },
  max(this: Context, data: any, max: number, msg: string = "") {
    return validate(data, () => {
      const value = data.value as string;
      const valid = !!(value && value.length <= max);
      return { valid, error: valid ? null : msg || `too long - max length ${max}` };
    });
  },
  length(this: Context, data: any, length: number, msg: string = "") {
    return validate(data, () => {
      const value = data.value as string;
      const valid = !!(value && value.length === length);
      return { valid, error: valid ? null : msg || `invalid length - length ${length}` };
    });
  },
  match(this: Context, data: any, pattern: string, msg: string = "") {
    return validate(data, () => {
      const value = data.value as string;
      const valid = new RegExp(pattern).test(value);
      return { valid, error: valid ? null : msg || "invalid pattern" };
    });
  }
}
