import { Midpoint } from "./lib"
import { BlackHole, Planet, WhiteHole } from "./planet"

let a: Planets
export function getPlanets() {
  return a
}

export class Planets {
  private planets: Planet[] = []

  public constructor(nodes: readonly SceneNode[]) {
    const whiteHoles: {[name: string]: Midpoint} = {}
    const blackHoles: BlackHole[] = []
    nodes.forEach((n: SceneNode) => {
      const name = n.name
      if (name.startsWith("out")) {
        const whiteHole = new WhiteHole(n)
        this.planets.push(whiteHole)
        whiteHoles[name.substring(3)] = whiteHole.getCurrentMidpoint()
        return
      }
      if (name.startsWith("in")) {
        const blackHole = new BlackHole(n)
        this.planets.push(blackHole)
        blackHoles.push(blackHole)
      }
      if (name === "🚀" || name.startsWith("_") || name === "·" || name === "projectile-container") {
        return
      }

      this.planets.push(new Planet(n))
    })

    for (const blackHole of blackHoles) {
      blackHole.setExit(whiteHoles[blackHole.getNode().name.substring(2)])
    }
    a = this
  }

  public getAll() {
    return this.planets
  }

  public setAll(a: Planet[]) {
    this.planets = a
  }
}
