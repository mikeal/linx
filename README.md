# linx - Graph manipulation tools for IPLD

> The chain we used to rock back in the days was Cuban links. So Rae came up with the theory, like a Cuban link is one of the roughest chains to break. Only Built 4 Cuban Linx...
> Ghostface Killah

# API

# linx.asyncIter(generatorFunction, dedup=true)

Takes an async generator function and returns a new **called**
generator with special properties.

The generator will only ever produce blocks. If the generator function
you pass produces something that isn't a block it will produce an error.

By default, duplicate blocks will not be emitted.

## generator.last

Promise that resolves to the last block produced by the generator. This is
often the root block of the operation the generator is for.

Note that in order for this promise to resolve you either need to fold over
the generator or call `.resolve()` to fold over it in the background.

## generator.first

Promise that resolves to the first block produced by the generator.

Note that in order for this promise to resolve you either need to fold over
the generator or call `.resolve()` to fold over it in the background.

## generator.resolve()

This method folds over the generator asynchronously.

This method itself is **synchronous** and immediately returns the generator itself for covenience. If you want to know when the folding has completed use the `last` promise attribute.

# linx.mkcid(data, hashAlgorithm, codec)

Async method that creates a CID for the given data.

# linx.mkblock(data, hashAlgorithm, codec)

Async method that creates a Block for the given data.
