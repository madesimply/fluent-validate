import { Context } from "./types";

function validate (data: any, validator: () => { valid: boolean, error: string | null }) {
  data.errors = data.errors || [];
  data.valid = data.errors.length === 0;

  const value = data.value as number;
  if (typeof value !== "number") {
    data.valid = false;
    if (!data.errors.includes("invalid number")) {
      data.errors.push("invalid number");
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

export const number = {
  coerce(this: Context, data: any, msg: string = "") {
    try {
      data.value = Number(data.value);
    } catch (e) {}

    return validate(data, () => {
      return { valid: true, error: null };
    });
  },
  default(this: Context, data: any, defaultValue: number) {
    if (data.value === undefined || data.value === null) {
      data.value = defaultValue;
    }
    
    return validate(data, () => {
      return { valid: true, error: null };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return validate(data, () => {
      const value = data.value as number;
      const valid = value !== undefined && value !== null;
      return { valid, error: valid ? null : msg || "number is required" };
    });
  },
  enum(this: Context, data: any, values: number[], msg: string = "") {
    return validate(data, () => {
      const value = data.value as number;
      const valid = values.includes(value);
      return { valid, error: valid ? null : msg || "invalid value" };
    });
  },
  min(this: Context, data: any, min: number, msg: string = "") {
    return validate(data, () => {
      const value = data.value as number;
      const valid = value >= min;
      return { valid, error: valid ? null : msg || `too small - min value ${min}` };
    });
  },
  max(this: Context, data: any, max: number, msg: string = "") {
    return validate(data, () => {
      const value = data.value as number;
      const valid = value <= max;
      return { valid, error: valid ? null : msg || `too large - max value ${max}` };
    });
  },
  integer(this: Context, data: any, msg: string = "") {
    return validate(data, () => {
      const value = data.value as number;
      const valid = Number.isInteger(value);
      return { valid, error: valid ? null : msg || "invalid integer" };
    });
  }
}
