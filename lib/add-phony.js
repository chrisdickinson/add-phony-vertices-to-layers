'use strict'

module.exports = addPhonies

function addPhonies(layerArray, incoming, outgoing, accessors) {
  accessors       = accessors || {}
  const makePhony = accessors.makePhony || defaultMakePhony
  const makeEdge  = accessors.makeEdge || defaultMakeEdge
  const getFrom   = accessors.getFrom || defaultGetFrom
  const getTo     = accessors.getTo || defaultGetTo

  const layering = new Map()

  for (let i = 0; i < layerArray.length; ++i) {
    for (let vertex of layerArray[i]) {
      layering.set(vertex, i)
    }
  }

  const incomingCopy = new Map()
  const outgoingCopy = new Map()

  for (let tuple of incoming) {
    incomingCopy.set(tuple[0], tuple[1])
  }
  for (let tuple of outgoing) {
    outgoingCopy.set(tuple[0], tuple[1])
  }

  const vertices = _addPhonies(
    layering,
    incomingCopy,
    outgoingCopy,
    getFrom,
    getTo,
    makeEdge,
    makePhony
  )

  const output = []

  for (let tuple of layering) {
    if (!output[tuple[1]]) {
      output[tuple[1]] = new Set()
    }
    output[tuple[1]].add(tuple[0])
  }

  return {
    layering: output.filter(Boolean),
    incoming: incomingCopy,
    outgoing: outgoingCopy,
    vertices: vertices
  }
}

function _addPhonies(
  layering, incoming, outgoing, getFrom, getTo, makeEdge, makePhony) {
  const vertices = new Set()
  let newEdges = []
  let newVerts = []
  for (let vertex of layering.keys()) {
    vertices.add(vertex)
    let outgoingEdges = outgoing.get(vertex)
    if (!outgoingEdges) {
      continue
    }
    let startLayer = layering.get(vertex)
    for (let edge of outgoingEdges) {
      let isReversed = edge.reversed
      let endLayer = layering.get(getTo(edge))
      let distance = startLayer - endLayer
      if (distance <= 1) continue

      let last = vertex
      for (let i = 0; i < distance - 1; ++i) {
        let vert = makePhony(vertex)
        newVerts.push(vert)
        layering.set(vert, startLayer - i - 1)
        newEdges.push(makeEdge(edge, last, vert))
        last = vert
      }
      newEdges.push(makeEdge(edge, last, getTo(edge)))
      outgoingEdges.delete(edge)
    }
  }

  for (let vertex of newVerts) {
    incoming.set(vertex, new Set())
    outgoing.set(vertex, new Set())
    vertices.add(vertex)
  }

  for (let edge of newEdges) {
    incoming.get(getTo(edge)).add(edge)
    outgoing.get(getFrom(edge)).add(edge)
  }

  return vertices
}

function defaultMakePhony(last) {
  return {phony: true}
}

function defaultMakeEdge(baseEdge, from, to) {
  let edge = Object.create(baseEdge)
  edge[0] = from
  edge[1] = to
  edge.phony = true
  return edge
}

function defaultGetFrom(edge) {
  return edge[0]
}

function defaultGetTo(edge) {
  return edge[1]
}
