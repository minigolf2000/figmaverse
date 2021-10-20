// Helper methods on Figma's Vector type

export function add(v1: Vector, v2: Vector): Vector {
  return {x: v1.x + v2.x, y: v1.y + v2.y}
}

export function subtract(v1: Vector, v2: Vector): Vector {
  return {x: v1.x - v2.x, y: v1.y - v2.y}
}

export function distance(v1: Vector, v2: Vector): number {
  const a = v1.x - v2.x
  const b = v1.y - v2.y
  return Math.sqrt(a * a + b * b)
}

// Return a vector such that vector v has magnitude of m
// e.g. vector {x: 1, y: 1}, m: 2.5 returns {x: 1.6, y: 1.6}
export function setMagnitude(v: Vector, m: number): Vector {
  const mag = magnitude(v)
  const m1 = m / mag

  return multiply(v, m1)
}

export function multiply(v: Vector, m: number): Vector {
  return {x: v.x * m, y: v.y * m}
}

export function normalize(v: Vector): Vector {
  const length = magnitude(v)
  return {x: v.x / length, y: v.y / length}
}

export function magnitude(v: Vector): number {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}