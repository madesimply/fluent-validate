import { Fluent } from 'fluent';

type MethodToType<M extends string> = M extends `string${string}` ? string : M extends `number${string}` ? number : M extends `array${string}` ? any[] : M extends `object${string}` ? object : never;
type ExtractChain<T> = T extends {
    chain: any;
} ? T['chain'] : T;
type CleanAndMutable<T> = T extends object ? {
    -readonly [K in keyof T]: CleanAndMutable<T[K]>;
} : T;
type InferSingle<T> = CleanAndMutable<T extends {
    method: infer M extends string;
    args: infer A;
} ? M extends 'enum' ? A extends [readonly (infer E)[]] ? E : never : M extends 'array.items' ? A extends [infer Items] ? Infer<ExtractChain<Items>>[] : never : M extends 'object.props' ? InferObjectProps<A> : MethodToType<M> : never>;
type InferObjectProps<A> = A extends [infer P] ? P extends Record<string, any> ? {
    [K in keyof P]: Infer<ExtractChain<P[K]>>;
} : never : never;
type MergeInferredTypes<T> = CleanAndMutable<T extends [infer First, ...infer Rest] ? InferSingle<First> extends infer S ? [S] extends [never] ? MergeInferredTypes<Rest> : S extends any[] ? S : S & MergeInferredTypes<Rest> : never : unknown>;
type Infer<T> = CleanAndMutable<MergeInferredTypes<ExtractChain<T>>>;
type Context = {};

declare const string: {
    coerce(this: Context, data: any, msg?: string): any;
    default(this: Context, data: any, defaultValue: string): any;
    required(this: Context, data: any, msg?: string): any;
    enum(this: Context, data: any, values: string[], msg?: string): any;
    min(this: Context, data: any, min: number, msg?: string): any;
    max(this: Context, data: any, max: number, msg?: string): any;
    length(this: Context, data: any, length: number, msg?: string): any;
    match(this: Context, data: any, pattern: string, msg?: string): any;
};

declare const number: {
    coerce(this: Context, data: any, msg?: string): any;
    default(this: Context, data: any, defaultValue: number): any;
    required(this: Context, data: any, msg?: string): any;
    enum(this: Context, data: any, values: number[], msg?: string): any;
    min(this: Context, data: any, min: number, msg?: string): any;
    max(this: Context, data: any, max: number, msg?: string): any;
    integer(this: Context, data: any, msg?: string): any;
};

declare const array: {
    coerce(this: Context, data: any, msg?: string): any;
    default(this: Context, data: any, defaultValue: any[]): any;
    required(this: Context, data: any, msg?: string): any;
    min(this: Context, data: any, min: number, msg?: string): any;
    max(this: Context, data: any, max: number, msg?: string): any;
    items(this: Context, data: any, items: any, msg?: string): any;
};

declare const object: {
    coerce(this: Context, data: any, msg?: string): any;
    default(this: Context, data: any, defaultValue: Record<string, any>): any;
    required(this: Context, data: any, msg?: string): any;
    props(this: Context, data: any, props: Record<string, any>, msg?: string): any;
};

type Api = {
    string: typeof string;
    number: typeof number;
    array: typeof array;
    object: typeof object;
};
declare const api: Api;
declare const validate: Fluent<Api, Api, []>;

export { type Api, type Infer, api, validate };
