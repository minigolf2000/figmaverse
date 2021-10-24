
// Combines two transforms by doing a matrix multiplication.
// The first transform applied is a, followed by b, which
// is normally written b * a.
export function multiply(a: Transform, b: Transform): Transform {
  return [
    [ a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] ],
    [ a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1] + 0, a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] ]
  ]
}

// Creates a "move" transform.
export function move(x: number, y: number): Transform {
  return [
    [1, 0, x],
    [0, 1, y]
  ]
}

// Creates a "rotate" transform.
export function rotate(theta: number): Transform {
  theta *= Math.PI / 180 // Convert degrees to radians
  return [
    [Math.cos(theta), Math.sin(theta), 0],
    [-Math.sin(theta), Math.cos(theta), 0]
  ]
}
