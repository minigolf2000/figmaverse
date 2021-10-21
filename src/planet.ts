import { Midpoint } from "./lib"
import { Player } from "./player"
import { setMagnitude, normalize, subtract, add, multiply } from "./vector"

export class Planet {

  public embedUrl: string
  private node: SceneNode
  protected radius: number
  protected gravity: number
  private currentMidpoint: Midpoint // repeatedly accessing Figma node objects is slow. store this value locally

  public constructor(node: SceneNode) {
    const relativeTransform = node.relativeTransform // this is a property that contains node's x, y, rotation as a matrix
    this.currentMidpoint = {
      x: relativeTransform[0][2],
      y: relativeTransform[1][2],
      diameter: node.width,
      rotation: 0 // We do not support planet rotation. Probably will be hard to do
    }
    this.node = node
    this.radius = this.node.width / 2
    this.gravity = this.radius

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
    return this.radius
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
    p.setVelocity(setMagnitude(p.getVelocity(), -0.2))
  }

  public nextFrame(p: Player, d: number) {
    if (d < this.radius) {
      this.collide(p)
      return true
    } else {
      this.applyGravity(p, d)
    }
    return false
  }

  private applyGravity(p: Player, d: number) {
    const playerMidpoint = p.getCurrentMidpoint()
    if (!playerMidpoint) {
      return
    }
    const gravityVector = setMagnitude(normalize(subtract(this.currentMidpoint, playerMidpoint)), this.gravity / (d * d))
    // console.log(this.getNode().name, gravityVector)
    p.setVelocity(add(p.getVelocity(), multiply(gravityVector, 30)))

  }
}

export class WhiteHole extends Planet {
  public constructor(node: SceneNode) {
    super(node)
    this.radius = 0
    this.gravity = -10
  }
}


export class BlackHole extends Planet {
  private exit: Midpoint
  public constructor(node: SceneNode) {
    super(node)
  }

  public setExit(e: Midpoint) {
    this.exit = e
  }
  public getExit() {
    return this.exit
  }

  protected collide(p: Player) {
    console.log("black hole action", this.exit)
    p.setCurrentPosition({x: this.exit.x, y: this.exit.y})
  }

}