import { getWorldRectangle, loopAround } from "./lib"
import { Buttons } from "./buttons"
import { Midpoint } from "./lib"
import { add, distance, magnitude, setMagnitude, normalize } from "./vector"
import { getPlanets } from "./planets"

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
  private deathTimer: number | null = null
  private diameter: number

  private thrustLastFlickeredOn = false
  private currentMidpoint: Midpoint // repeatedly accessing Figma node objects is slow. store this value locally

  public constructor(shipSvg: string, positionOffset: Vector = {x: 0, y: 0}) {
    this.node = figma.createNodeFromSvg(shipSvg)
    this.diameter = Math.min(this.node.width, this.node.height) - DIAMETER_LENIENCY
    // Offset children so that the ship rotates about its center
    this.node.children.forEach(n => {
      n.x -= this.diameter / 2
      n.y -= this.diameter / 2
    })

    this.thrustNode = this.node.children[0]! as RectangleNode
    this.thrustNode.visible = false
    this.node.clipsContent = false
    this.node.name = "🚀"
    this.node.locked = true

    this.newShip(positionOffset)
  }

  private newShip(positionOffset: Vector = {x: 0, y: 0}) {
    const { width, height } = getWorldRectangle()
    this.velocity = {x: 0, y: 0}
    this.node.rotation = 0
    // X and Y actually represent the top-left of the player's spaceship
    this.node.x = width / 2 + Math.random() * 50 - 25 + positionOffset.x
    // y position is purposefully moved 75px up so that plugin window starting position does not obscure ship
    this.node.y = height / 2 + Math.random() * 25 - 100 + positionOffset.y
    this.currentMidpoint = {x: this.node.x, y: this.node.y, diameter: this.diameter, rotation: 0}
    figma.ui.postMessage({rotation: 0})
  }

  public getNode() {
    return this.node
  }

  public getCurrentMidpoint(): Midpoint | null {
    if (this.deathTimer) {
      return null
    }
    return this.currentMidpoint
  }

  public getVelocity() {
    return this.velocity
  }

  public setCurrentPosition(position: Vector) {
    this.currentMidpoint.x = position.x
    this.currentMidpoint.y = position.y

    this.node.x = position.x + getWorldRectangle().x
    this.node.y = position.y + getWorldRectangle().y
  }

  public setVelocity(v: Vector) {
    this.velocity = v
  }

  public takeDamage() {
    this.deathTimer = 0
    this.node.visible = false
    figma.ui.postMessage({death: true})
  }

  public nextFrame() {
    if (!this.node.visible) { // your ship can be marked invisible by other clients if they shoot you
      this.deathTimer = 0
      figma.ui.postMessage({death: true})
      return
    }

    if (this.buttonsPressed.left) {
      this.currentMidpoint.rotation += TURN_SPEED
      if (this.currentMidpoint.rotation > 360) this.currentMidpoint.rotation -= 360
    }
    if (this.buttonsPressed.right) {
      this.currentMidpoint.rotation -= TURN_SPEED
      if (this.currentMidpoint.rotation < 0) this.currentMidpoint.rotation += 360
    }

    if (this.buttonsPressed.left || this.buttonsPressed.right) {
      this.node.rotation = this.currentMidpoint.rotation
      figma.ui.postMessage({rotation: this.currentMidpoint.rotation})
    }

    if (this.buttonsPressed.up) {
      const directionVector = {x: -Math.sin(this.currentMidpoint.rotation * Math.PI / 180), y: -Math.cos(this.currentMidpoint.rotation * Math.PI / 180)}
      this.velocity = add(this.velocity, setMagnitude(directionVector, THRUST_POWER))
      this.thrustNode.visible = !this.thrustLastFlickeredOn
      this.thrustLastFlickeredOn = !this.thrustLastFlickeredOn
    } else {
      this.thrustNode.visible = false
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
      this.setCurrentPosition(loopAround(newMidpoint, this.diameter))
    }


    return true
  }
}
