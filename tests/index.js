import { fluent } from "fluent";
import { validator as v, api, ctx } from "../dist/index.js";
import assert from "assert";

const stringChains = [
  v.string.coerce(),
  v.string.default("hello"),
  v.string.required(),
  v.string.enum(["hello", "world"]),
  v.string.min(5),
  v.string.max(10),
  v.string.length(5),
  v.string.match(/^[a-z]+$/.source),
];

assert.strictEqual(stringChains[0].run({ value: 5 }).valid, true);
assert.strictEqual(stringChains[1].run({ value: undefined }).value, "hello");
assert.strictEqual(stringChains[2].run({ value: "" }).valid, false);
assert.strictEqual(stringChains[2].run({ value: "hello" }).valid, true);
assert.strictEqual(stringChains[3].run({ value: "world" }).valid, true);
assert.strictEqual(stringChains[3].run({ value: "hello" }).valid, true);
assert.strictEqual(stringChains[3].run({ value: "world!" }).valid, false);
assert.strictEqual(stringChains[4].run({ value: "hel" }).valid, false);
assert.strictEqual(stringChains[4].run({ value: "hello world" }).valid, true);
assert.strictEqual(stringChains[5].run({ value: "hello world" }).valid, false);
assert.strictEqual(stringChains[5].run({ value: "hello" }).valid, true);
assert.strictEqual(stringChains[6].run({ value: "hello" }).valid, true);
assert.strictEqual(stringChains[6].run({ value: "worlds" }).valid, false);
assert.strictEqual(stringChains[7].run({ value: "hello1" }).valid, false);
assert.strictEqual(stringChains[7].run({ value: "world" }).valid, true);

const numberChains = [
  v.number.coerce(),
  v.number.default(5),
  v.number.required(),
  v.number.enum([5, 10]),
  v.number.min(5),
  v.number.max(10),
  v.number.integer(),
];

assert.strictEqual(numberChains[0].run({ value: "5" }).value, 5);
assert.strictEqual(numberChains[1].run({ value: undefined }).value, 5);
assert.strictEqual(numberChains[2].run({ value: undefined }).valid, false);
assert.strictEqual(numberChains[2].run({ value: 5 }).valid, true);
assert.strictEqual(numberChains[3].run({ value: 5 }).valid, true);
assert.strictEqual(numberChains[3].run({ value: 10 }).valid, true);
assert.strictEqual(numberChains[3].run({ value: 15 }).valid, false);
assert.strictEqual(numberChains[4].run({ value: 4 }).valid, false);
assert.strictEqual(numberChains[4].run({ value: 5 }).valid, true);
assert.strictEqual(numberChains[5].run({ value: 10 }).valid, true);
assert.strictEqual(numberChains[5].run({ value: 11 }).valid, false);
assert.strictEqual(numberChains[6].run({ value: 5.5 }).valid, false);
assert.strictEqual(numberChains[6].run({ value: 5 }).valid, true);

const arrayChains = [
  v.array.coerce(),
  v.array.default([1, 2, 3]),
  v.array.required(),
  v.array.min(2),
  v.array.max(5),
  v.array.items(v.number.required()),
];

assert.deepStrictEqual(arrayChains[0].run({ value: "[1,2,3]" }).value, [1, 2, 3]);
assert.deepStrictEqual(arrayChains[1].run({ value: undefined }).value, [1, 2, 3]);
assert.strictEqual(arrayChains[2].run({ value: undefined }).valid, false);
assert.strictEqual(arrayChains[2].run({ value: [1, 2, 3] }).valid, true);
assert.strictEqual(arrayChains[3].run({ value: [1] }).valid, false);
assert.strictEqual(arrayChains[3].run({ value: [1, 2] }).valid, true);
assert.strictEqual(arrayChains[4].run({ value: [1, 2, 3, 4, 5, 6] }).valid, false);
assert.strictEqual(arrayChains[4].run({ value: [1, 2, 3, 4] }).valid, true);
assert.strictEqual(arrayChains[5].run({ value: [1, 2, 3] }).valid, true);
assert.strictEqual(arrayChains[5].run({ value: [1, 2, "3"] }).valid, false);

const objectChains = [
  v.object.coerce(),
  v.object.default({ a: 1 }),
  v.object.required(),
  v.object.props({
    a: v.number.required(),
    b: v.string.required(),
  }),
];

assert.deepStrictEqual(objectChains[0].run({ value: '{"a":1}' }).value, { a: 1 });
assert.deepStrictEqual(objectChains[1].run({ value: undefined }).value, { a: 1 });
assert.strictEqual(objectChains[2].run({ value: undefined }).valid, false);
assert.strictEqual(objectChains[2].run({ value: { a: 1, b: "hello" } }).valid, true);
assert.strictEqual(objectChains[3].run({ value: { a: 1, b: "hello" } }).valid, true);
assert.strictEqual(objectChains[3].run({ value: { a: 1 } }).valid, false);
assert.strictEqual(objectChains[3].run({ value: { a: "1", b: "hello" } }).valid, false);

const booleanChains = [
  v.boolean.coerce(),
  v.boolean.default(true),
  v.boolean.required(),
];

assert.strictEqual(booleanChains[0].run({ value: "true" }).value, true);
assert.strictEqual(booleanChains[1].run({ value: undefined }).value, true);
assert.strictEqual(booleanChains[2].run({ value: undefined }).valid, false);
assert.strictEqual(booleanChains[2].run({ value: true }).valid, true);

const enhancedApi = {
  ...api,
  string: {
    ...api.string,
    email(data, msg = "") { 
      return this.validate.string(data, (value) => {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return { valid, error: valid ? null : msg || "invalid email" };
      });
    }
  }
}

const validate = fluent({ api: enhancedApi, ctx });
const email = validate.string.email().required();
assert.strictEqual(email.run({ value: "test" }).valid, false);