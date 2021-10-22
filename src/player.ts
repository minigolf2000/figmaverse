import { getWorldNode, loopAround } from "./lib"
import { Buttons } from "./buttons"
import { Midpoint } from "./lib"
import { add, distance, magnitude, setMagnitude, normalize } from "./vector"
import { getPlanets } from "./planets"

const SPACESHIP_SIZE = 16
const MAX_SPEED = 5.0
const TURN_SPEED = 6.0
const THRUST_POWER = 0.25

// Gravity applies at this many radiuses away from a planet
const GRAVITY_DISTANCE_THRESHOLD = 5
const MULTIPLAYER_COLORS: RGB[] = [
  {r: 0 / 255, g: 181 / 255, b: 206 / 255},
  {r: 24 / 255, g: 160 / 255, b: 251 / 255},
  {r: 27 / 255, g: 196 / 255, b: 125 / 255},
  {r: 144 / 255, g: 124 / 255, b: 255 / 255},
  {r: 238 / 255, g: 70 / 255, b: 211 / 255},
  {r: 239 / 255, g: 85 / 255, b: 51 / 255},
  {r: 255 / 255, g: 199 / 255, b: 0 / 255},
]

export class Player {
  private velocity: Vector
  public buttonsPressed: Buttons = {up: false, left: false, right: false, x: false, esc: false}
  private node: FrameNode
  private thrustNode: RectangleNode
  private deathTimer: number | null = null
  private color: RGB

  private thrustLastFlickeredOn = false
  private currentMidpoint: Midpoint // repeatedly accessing Figma node objects is slow. store this value locally

  public constructor(shipSvg: string, positionOffset: Vector = {x: 0, y: 0}) {
    this.node = figma.createNodeFromSvg(shipSvg)

    const hullNode: RectangleNode = (this.node.children[1]! as RectangleNode)
    this.color = MULTIPLAYER_COLORS[Math.floor(Math.random() * MULTIPLAYER_COLORS.length)];
    hullNode.fills = [{color: this.color, type: "SOLID"}]
    hullNode.effects = [{type: "DROP_SHADOW", color: {r: 0, g: 0, b: 0, a: .25}, offset: {x: 0, y: 1}, radius: 4, visible: true, blendMode: "NORMAL"}]

    // Offset children so that the ship rotates about its center
    this.node.children.forEach(n => {
      n.x -= SPACESHIP_SIZE / 2
      n.y -= SPACESHIP_SIZE / 2
    })

    this.thrustNode = this.node.children[0]! as RectangleNode
    this.thrustNode.visible = false
    this.node.clipsContent = false
    this.node.name = "🚀"
    this.node.locked = true

    this.newShip(positionOffset)
  }

  private newShip(positionOffset: Vector = {x: 0, y: 0}) {
    const { width, height } = getWorldNode()
    this.velocity = {x: 0, y: 0}
    this.node.rotation = 0
    // X and Y actually represent the top-left of the player's spaceship
    this.node.x = width / 2 + Math.random() * 50 - 25 + positionOffset.x
    // y position is purposefully moved 75px up so that plugin window starting position does not obscure ship
    this.node.y = height / 2 + Math.random() * 25 - 100 + positionOffset.y
    this.currentMidpoint = {x: this.node.x, y: this.node.y, diameter: SPACESHIP_SIZE, rotation: 0}
    figma.ui.postMessage({color: this.color, rotation: 0})
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

    this.node.x = position.x
    this.node.y = position.y
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

    const newPos = add({x: this.currentMidpoint.x, y: this.currentMidpoint.y}, this.velocity)
    let playerCollided = false
    for (const p of getPlanets().getAll()) {
      const d = distance(p.getCurrentMidpoint(), newPos)
      if (d < p.getRadius() * GRAVITY_DISTANCE_THRESHOLD) {
        playerCollided = playerCollided || p.nextFrame(this, d)
      }
    }
    if (!playerCollided) {
      this.setCurrentPosition(loopAround(newPos))
    }


    return true
  }
}
