import { Player } from "./player"
import { distance } from "./vector"

export const FPS = 30
export let thrustPower = 0.5
export function setThrustPower(p: number) {
  thrustPower = p
}

export let maxSpeed = 5.0
export function setMaxSpeed(s: number) {
  maxSpeed = s
}


let worldRectangle: World
let worldNode: FrameNode // use sparingly
export function setWorldRectangle(w: FrameNode) {
  const {width, height, x, y} = w
  worldRectangle = {width, height, x, y}
  worldNode = w
}

export function getWorldRectangle() {
  return worldRectangle
}

export function getWorldNode() {
  return worldNode
}

let occlusionNode: FrameNode // use sparingly
export function getOcclusionNode() {
  return occlusionNode
}

export function setOcclusionNode(n: FrameNode) {
  occlusionNode = n
}

let player: Player
export function setPlayer(p: Player) {
  player = p
}
export function getPlayer() {
  return player
}

export function loopAround(position: Vector, diameter: number) {
  let x = position.x
  let y = position.y

  if (position.x < 0 - diameter) {
    x += worldRectangle.width + diameter
  }
  if (position.x > worldRectangle.width + diameter) {
    x -= worldRectangle.width + diameter
  }
  if (position.y < 0 - diameter) {
    y += worldRectangle.height + diameter
  }
  if (position.y > worldRectangle.height + diameter) {
    y -= worldRectangle.height + diameter
  }

  return {x, y}
}

let currentCenter: Vector = figma.viewport.center
export function updateCamera(player: Player, cameraBoxSize: number) {
  const midpoint = player.getCurrentMidpoint()

  // TODO: does this take link's width/height into account?
  const distFromCenter = cameraBoxSize / 3.5
  const currentX = midpoint.x + worldRectangle.x
  const currentY = midpoint.y + worldRectangle.y

  let newX = currentCenter.x
  if (currentCenter.x - currentX > distFromCenter) {
    newX -= currentCenter.x - currentX - distFromCenter
  } else if (currentX - currentCenter.x > distFromCenter) {
    newX += currentX - currentCenter.x - distFromCenter
  }

  let newY = currentCenter.y
  if (currentCenter.y - currentY > distFromCenter) {
    newY -= currentCenter.y - currentY - distFromCenter
  } else if (currentY - currentCenter.y > distFromCenter) {
    newY += currentY - currentCenter.y - distFromCenter
  }

  if (newX !== currentCenter.x || newY !== currentCenter.y) {
    currentCenter = {x: newX, y: newY}
    figma.viewport.center = currentCenter
  }
}

export interface World {
  width: number
  height: number
  x: number
  y: number
}

export interface Midpoint {
  x: number
  y: number
  diameter: number
  rotation: number
}

/* If rectangles are overlapping, return a normal Vector from rect1 to rect 2
 * Else return null
 */
export function isOverlapping(midpointA: Midpoint, midpointB: Midpoint) {
  return distance(midpointA, midpointB) < (midpointA.diameter + midpointB.diameter) / 2
}

let mp: Player[] = []
export function getMultiplayerPlayers() {
  return mp
}

export function setMultiplayerPlayers(m: Player[]) {
  mp = m
}

// TODO: this can be combined with scanForNewMultiplayerPlayers for performance
export function isHost() {
  return true
}

export function getShipNodeFromIndex(shipIndex: number): FrameNode {
  const shipsPage = figma.root.findChild(p => p.name === 'Ships')
  if (!shipsPage) {
    throw "no ships page"
  }

  const shipNode = shipsPage.findChild(c => c.name === `ship-${shipIndex}` && c.type === "FRAME") as FrameNode
  if (!shipNode) {
    throw `no ship found with name ship-${shipIndex}`
  }
  return shipNode.clone()
}