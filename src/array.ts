import { Context } from "./types";

function validate (data: any, validator: () => { valid: boolean, error: string | null }) {
  data.errors = data.errors || [];
  data.valid = data.errors.length === 0;

  const value = data.value as any[];
  if (!Array.isArray(value)) {
    data.valid = false;
    if (!data.errors.includes("invalid array")) {
      data.errors.push("invalid array");
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

export const array = {
  coerce(this: Context, data: any, msg: string = "") {
    try {
      data.value = JSON.parse(data.value);
    } catch (e) {}

    return validate(data, () => {
      return { valid: true, error: null };
    });
  },
  default(this: Context, data: any, defaultValue: any[]) {
    if (data.value === undefined || data.value === null) {
      data.value = defaultValue;
    }

    return validate(data, () => {
      return { valid: true, error: null };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return validate(data, () => {
      const value = data.value as any[];
      const valid = value && value.length > 0;
      return { valid, error: valid ? null : msg || "array is required" };
    });
  },
  min(this: Context, data: any, min: number, msg: string = "") {
    return validate(data, () => {
      const value = data.value as any[];
      const valid = value && value.length >= min;
      return { valid, error: valid ? null : msg || `too short - min length ${min}` };
    });
  },
  max(this: Context, data: any, max: number, msg: string = "") {
    return validate(data, () => {
      const value = data.value as any[];
      const valid = value && value.length <= max;
      return { valid, error: valid ? null : msg || `too long - max length ${max}` };
    });
  },
  items(this: Context, data: any, items: any, msg: string = "") {
    return validate(data, () => {
      const value = data.value as any[];
      const valid = value && value.every((v) => v === items);
      return { valid, error: valid ? null : msg || `invalid items - expected ${items}` };
    });
  }
}