import { Context } from "./types";

function validate(
  self: Context,
  data: any,
  validator: ({ value }: { value: any }) => {
    valid: boolean;
    error: string | null;
  }
) {
  if (!self.validate) throw new Error("validate is not defined in context");

  const errors = self.validate.get("errors", data, []);
  self.validate.set("errors", data, errors);
  self.validate.set("valid", data, errors.length === 0);

  const value = self.validate.get("value", data) as any;
  if (!Array.isArray(value)) {
    self.validate.set("valid", data, false);
    if (!errors.includes("invalid array")) {
      errors.push("invalid array");
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

export const array = {
  coerce(this: Context, data: any) {
    try {
      this.validate.set("value", data, JSON.parse(data.value));
    } catch (e) {}

    return validate(this, data, () => {
      return { valid: true, error: null };
    });
  },
  default(this: Context, data: any, defaultValue: any[]) {
    const value = this.validate.get("value", data);
    if (value === undefined || value === null) {
      this.validate.set("value", data, defaultValue);
    }

    return validate(this, data, () => {
      return { valid: true, error: null };
    });
  },
  required(this: Context, data: any, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = value && value.length > 0;
      return { valid, error: valid ? null : msg || "array is required" };
    });
  },
  min(this: Context, data: any, min: number, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = value && value.length >= min;
      return {
        valid,
        error: valid ? null : msg || `too short - min length ${min}`,
      };
    });
  },
  max(this: Context, data: any, max: number, msg: string = "") {
    return validate(this, data, ({ value }) => {
      const valid = value && value.length <= max;
      return {
        valid,
        error: valid ? null : msg || `too long - max length ${max}`,
      };
    });
  },
  items(this: Context, data: any, items: any, msg: string = "") {
    return validate(this, data, ({ value }) => {
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
