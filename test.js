'use strict'

const addPhonies = require('./lib/add-phony.js')
const assignLayers = require('dag-to-layers')
const digraph = require('digraph-tag')
const test = require('tape')

test('assigns layers to a dag', function(assert) {
  const graph = digraph`
    A -> B
    B -> C
    C -> D
    X -> Y
    Y -> Z
    Z -> D
    D -> U
    U -> V
  `

  const baseLayering = assignLayers(graph.vertices, graph.incoming, graph.outgoing)
  const seen = new Set()

  const result = addPhonies(baseLayering, graph.incoming, graph.outgoing)
  const layering = result.layering

  for (let i = 0; i < layering.length; ++i) {
    let layer = layering[i]
    for (let vertex of layer) {
      seen.add(vertex)
      let outgoing = result.outgoing.get(vertex)
      if (!outgoing || !outgoing.size) {
        continue
      }

      for (let edge of outgoing) {
        let name =
          (edge[0].phony ? '*' : edge[0]) + ' → ' +
          (edge[1].phony ? '*' : edge[1])

        assert.ok(layering[i - 1].has(edge[1]), name + ' points to subsequent layer')
      }
    }
  }
  assert.ok(seen.size >= graph.vertices.size, 'we should have at least as many vertices')
  let ok = true
  for (let vertex of graph.vertices) {
    ok = ok && seen.has(vertex)
    if (!ok) break
  }
  assert.ok(ok, 'all original vertices are present')
  assert.end()
})
