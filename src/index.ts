import { Fluent, fluent } from "fluent";
import { string } from "./string";
import { number } from "./number";
import { array } from "./array";
import { object } from "./object";
import type { Infer } from "./types";

export type Api = {
  string: typeof string;
  number: typeof number;
  array: typeof array;
  object: typeof object;
};

export const api: Api = {
  string,
  number,
  array,
  object,
};

export const validate = fluent({ api }) as Fluent<Api, Api, []>;

export { Infer };
