type MethodToType<M extends string> = M extends `string${string}` ? string
  : M extends `number${string}` ? number
  : M extends `array${string}` ? any[]
  : M extends `object${string}` ? object
  : never;

type ExtractChain<T> = T extends { chain: any } ? T['chain'] : T;

type CleanAndMutable<T> = T extends object
  ? { -readonly [K in keyof T]: CleanAndMutable<T[K]> }
  : T;

// Modified InferSingle type to handle array.items
type InferSingle<T> = CleanAndMutable<
  T extends { method: infer M extends string; args: infer A }
    ? M extends 'enum'
      ? A extends [readonly (infer E)[]]
        ? E
        : never
    : M extends 'array.items'
      ? A extends [infer Items]
        ? Infer<ExtractChain<Items>>[]
        : never
    : M extends 'object.props'
      ? InferObjectProps<A>
    : MethodToType<M>
  : never
>;

type InferObjectProps<A> = A extends [infer P]
  ? P extends Record<string, any>
    ? { [K in keyof P]: Infer<ExtractChain<P[K]>> }
    : never
  : never;

type MergeInferredTypes<T> = CleanAndMutable<
  T extends [infer First, ...infer Rest]
    ? InferSingle<First> extends infer S
      ? [S] extends [never]
        ? MergeInferredTypes<Rest>
        : S extends any[]
          ? S
          : S & MergeInferredTypes<Rest>
      : never
    : unknown
>;

export type Infer<T> = CleanAndMutable<MergeInferredTypes<ExtractChain<T>>>;

export type Context = {};
