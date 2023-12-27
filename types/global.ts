declare type InferCtx<X> = X extends infer Ctx ? Ctx : never;
