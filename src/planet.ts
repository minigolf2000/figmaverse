import { Midpoint } from "./lib"
import { Player } from "./player"
import { setMagnitude, normalize, subtract, add } from "./vector"


// How much gravity planets have, directly correlated with diameter
const GRAVITY_MULTIPLIER = 10

// Gravity applies at this many radiuses away from a planet
const GRAVITY_DISTANCE_THRESHOLD = 5
export class Planet {

  public embedUrl: string
  private node: SceneNode
  protected gravity: number
  protected currentMidpoint: Midpoint // repeatedly accessing Figma node objects is slow. store this value locally

  public constructor(node: SceneNode) {
    const relativeTransform = node.relativeTransform // this is a property that contains node's x, y, rotation as a matrix
    this.currentMidpoint = {
      x: relativeTransform[0][2],
      y: relativeTransform[1][2],
      diameter: node.width,
      rotation: 0 // We do not support planet rotation. Probably will be hard to do
    }
    this.node = node
    this.gravity = this.currentMidpoint.diameter * GRAVITY_MULTIPLIER

    if ('children' in node) {
      const textWithHyperlink = node.findChild(n => n.type === 'TEXT' && (n as any).hyperlink) as any
      if (textWithHyperlink?.type === "TEXT" && textWithHyperlink?.hyperlink.type === "URL") {
        this.embedUrl = textWithHyperlink.hyperlink.value
      }
    }
  }

  public getNode() {
    return this.node
  }

  public getRadius() {
    return this.currentMidpoint.diameter / 2
  }

  public getGravity() {
    return this.gravity
  }

  public getCurrentMidpoint(): Midpoint {
    return {
      x: this.currentMidpoint.x + this.currentMidpoint.diameter / 2,
      y: this.currentMidpoint.y + this.currentMidpoint.diameter / 2,
      diameter: this.currentMidpoint.diameter,
      rotation: this.currentMidpoint.rotation,
    }
  }

  protected collide(p: Player) {
    console.log("is this getting called still")
    p.setVelocity(setMagnitude(p.getVelocity(), -0.2))
    return true
  }

  public nextFrame(p: Player, dist: number, newPos: Vector, shipDiameter: number) {
    if (dist > this.gravityDistanceThreshold()) {
      return false
    }
    if (dist - shipDiameter / 2 < this.currentMidpoint.diameter / 2) {
      return this.collide(p)
    } else {
      this.applyGravity(p, dist)
    }
    return false
  }

  public gravityDistanceThreshold() {
    return this.getRadius() * GRAVITY_DISTANCE_THRESHOLD
  }

  private applyGravity(p: Player, d: number) {
    const gravityVector = setMagnitude(normalize(subtract(this.getCurrentMidpoint(), p.getCurrentMidpoint())), this.gravity / (d * d))
    const newVelocity = add(p.getVelocity(), gravityVector)
    p.setVelocity(newVelocity)

  }
}

export class WhiteHole extends Planet {
  public constructor(node: SceneNode) {
    super(node)
    this.currentMidpoint.diameter = 0
    this.gravity = -1000 * GRAVITY_MULTIPLIER
  }

  public gravityDistanceThreshold() {
    return 1000
  }
}


export class BlackHole extends Planet {
  private exit: Midpoint
  public constructor(node: SceneNode) {
    super(node)
    this.gravity = 400 * GRAVITY_MULTIPLIER
  }

  public setExit(e: Midpoint) {
    this.exit = e
  }

  protected collide(p: Player) {
    p.setCurrentPosition({x: this.exit.x + 50 + p.getVelocity().x * 5, y: this.exit.y + 50 + p.getVelocity().y * 5})
    return true
  }

  public gravityDistanceThreshold() {
    return 1000
  }
}

const CYLINDER_THICKNESS = 15
export class OneillCylinder extends Planet {
  public nextFrame(p: Player, dist: number, newPos: Vector, shipDiameter: number) {
    if (dist < this.currentMidpoint.diameter / 2 - CYLINDER_THICKNESS) {
      return false
    }

    if (Math.abs(this.getCurrentMidpoint().y - (newPos.y + shipDiameter / 2)) < 40) {
      return false
    }

    return super.nextFrame(p, dist, newPos, shipDiameter)
  }
}