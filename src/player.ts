import { getWorldRectangle, loopAround } from "./lib"
import { Buttons } from "./buttons"
import { Midpoint } from "./lib"
import { add, distance, magnitude, setMagnitude, normalize } from "./vector"
import { getPlanets } from "./planets"
import { getRelativeTransform } from "./matrix"
import { isExited } from "./init"

const MAX_SPEED = 5.0
const TURN_SPEED = 6.0
const THRUST_POWER = 0.25

// Shrink diameters by this much for nicer looking hit detection
const DIAMETER_LENIENCY = 4

export class Player {
  private velocity: Vector
  public buttonsPressed: Buttons = {up: false, left: false, right: false, x: false, esc: false}
  private node: FrameNode
  private thrustNode: RectangleNode
  private diameter: number

  private thrustLastFlickeredOn = false
  private currentMidpoint: Midpoint // repeatedly accessing Figma node objects is slow. store this value locally

  public constructor(shipNode: FrameNode, positionOffset: Vector = {x: 0, y: 0}) {
    this.node = shipNode
    this.diameter = Math.min(this.node.width, this.node.height) - DIAMETER_LENIENCY
    // Offset children so that the ship rotates about its center
    this.node.children.forEach(n => {
      n.x -= this.diameter / 2
      n.y -= this.diameter / 2
    })

    this.thrustNode = this.node.children[0]! as RectangleNode
    this.thrustNode.visible = false
    this.node.clipsContent = false
    this.node.name = `🚀 ${figma.currentUser?.name}`
    this.node.locked = true

    const { width, height } = getWorldRectangle()
    this.velocity = {x: 0, y: 0}
    this.node.rotation = 0

    const {x, y} = figma.currentPage.selection[0]
    // X and Y actually represent the top-left of the player's spaceship
    this.node.x = width / 2 + Math.random() * 50 - 25 + positionOffset.x + x
    // y position is purposefully moved 75px up so that plugin window starting position does not obscure ship
    this.node.y = height / 2 + Math.random() * 25 - 100 + positionOffset.y + y - 100
    this.currentMidpoint = {x: this.node.x, y: this.node.y, diameter: this.diameter, rotation: 0}
  }

  public getNode() {
    return this.node
  }

  public getCurrentMidpoint(): Midpoint {
    return this.currentMidpoint
  }

  public getVelocity() {
    return this.velocity
  }

  public setCurrentPositionAndRotation(position: Vector, rotation: number = this.currentMidpoint.rotation) {
    this.currentMidpoint.x = position.x
    this.currentMidpoint.y = position.y

    if (!isExited) {
      this.node.relativeTransform = getRelativeTransform(position.x + getWorldRectangle().x, position.y + getWorldRectangle().y, rotation)
    }
  }

  public setVelocity(v: Vector) {
    this.velocity = v
  }

  public nextFrame() {
    if (!this.node) {
      return
    }

    let rotationChanged = false
    if (this.buttonsPressed.left) {
      this.currentMidpoint.rotation += TURN_SPEED
      rotationChanged = true
      if (this.currentMidpoint.rotation > 360) this.currentMidpoint.rotation -= 360
    }
    if (this.buttonsPressed.right) {
      this.currentMidpoint.rotation -= TURN_SPEED
      rotationChanged = true
      if (this.currentMidpoint.rotation < 0) this.currentMidpoint.rotation += 360
    }

    if (this.buttonsPressed.up) {
      const directionVector = {x: -Math.sin(this.currentMidpoint.rotation * Math.PI / 180), y: -Math.cos(this.currentMidpoint.rotation * Math.PI / 180)}
      this.velocity = add(this.velocity, setMagnitude(directionVector, THRUST_POWER))
      if (!isExited) {
        this.thrustNode.visible = !this.thrustLastFlickeredOn
      }
      this.thrustLastFlickeredOn = !this.thrustLastFlickeredOn
    } else {
      if (!isExited) {
        this.thrustNode.visible = false
      }
    }

    if (magnitude(this.velocity) > MAX_SPEED) {
      this.velocity = setMagnitude(normalize(this.velocity), MAX_SPEED)
    }

    const newMidpoint = add({x: this.currentMidpoint.x, y: this.currentMidpoint.y}, this.velocity)
    let playerCollided = false
    for (const p of getPlanets().getAll()) {
      const dist = distance(p.getCurrentMidpoint(), newMidpoint)
      playerCollided = playerCollided || p.nextFrame(this, dist, newMidpoint, this.diameter)
    }

    if (!playerCollided) {
      this.setCurrentPositionAndRotation(loopAround(newMidpoint, this.diameter), this.currentMidpoint.rotation)
    } else if (rotationChanged) {
      if (!isExited) {
        this.node.rotation = this.currentMidpoint.rotation
      }
    }


    return true
  }
}
