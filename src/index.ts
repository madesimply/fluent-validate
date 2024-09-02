import { Fluent, fluent } from "fluent";
import { string } from "./string";
import { number } from "./number";
import { array } from "./array";
import { object } from "./object";
import { boolean } from "./boolean";
import { ctx } from "./context";
import type { Infer } from "./types";

export type Api = {
  string: typeof string;
  number: typeof number;
  array: typeof array;
  object: typeof object;
  boolean: typeof boolean;
};

export const api: Api = {
  string,
  number,
  array,
  object,
  boolean,
};

export const validate = fluent({ api, ctx }) as Fluent<Api, Api, []>;

export { Infer, ctx };