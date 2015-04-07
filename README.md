# add-phony-vertices-to-layers

Given a layering of a graph and its edges, return a new graph with dummy vertices inserted
such that no edge may span more than one layer.

## API

##### `addPhonies(layer:Layering, to:Edges, from:Edges[, i:Interface]) → Result`

###### `Result`

```
{ layering: Layering,
  vertices: Set<Vertex>,
  outgoing: Edges,
  incoming: Edges }
```

##### `Map<Vertex → Set<Edge>> :: Edges`

A map from `Vertex` to a `Set` of `Edge`s is known as `Edges`.

##### `[Set<Vertex>, ...] :: Layering`

An array representing a valid layering of a graph. From the above example, the layering would 
look something like this:

```
[ Set<V>,  // ← layer zero
  Set<U>,
  Set<D>,
  Set<C>,
  Set<Z, B>,
  Set<Y, A>,
  Set<X> ] // ← layer six
```

##### `(Vertex → PhonyVertex) :: MakeP`

A function that takes an originating vertex (for metadata purposes) and creates a phony vertex.

##### `((Edge, Vertex | PhonyVertex, Vertex | PhonyVertex) → Edge) :: MakeE`

A function that takes an originating edge, a source vertex and a destination vertex, and returns
a new `Edge` instance.

##### `{[getFrom:E2V][, getTo:E2V][, makeEdge:MakeE][, makePhony:MakeP]} :: Interface`

An object containing methods necessary for implementing the layer assignment algorithm.
`getFrom` should return the source vertex of an edge, `getTo` should return the destination
vertex. `makeEdge` should create a new edge instance with the provided source and destination
vertices. `makePhony` should return a phony vertex.

The default values act as follows:

```javascript
const getFrom = edge => edge[0]
const getTo = edge => edge[1]
const makePhony = ()=> { return {phony: true}}
const makeEdge = (edge, from, to) => {
  const newEdge = Object.create(edge)
  [newEdge...] = [from, to]
  return newEdge
}
```

## License

MIT

