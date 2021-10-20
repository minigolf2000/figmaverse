import { init } from './init'
import { FPS, getMultiplayerPlayers, getPlayer, getWorldNode, updateCamera } from './lib'
import { Planet } from './planet'
import { getPlanets } from './planets'
import { Player } from './player'
import { distance } from './vector'


// Game loop run by multiplayerPlayers
function nextFrame() {
  const player = getPlayer()
  if (player.buttonsPressed.esc) {
    figma.closePlugin()
    return
  }
  if (getWorldNode().removed) {
    figma.closePlugin("World was deleted, exiting plugin")
    return
  }

  player.nextFrame()
  for (const p of getMultiplayerPlayers()) {
    p.nextFrame()
  }

  updateCamera(player, 200)
  updateLoomUrl(player)
}

let currentClosestPlanet: Planet | null = null
const VIDEO_DISTANCE_THRESHOLD = 400
function updateLoomUrl(player: Player) {
  const playerMidpoint = player.getCurrentMidpoint()
  if (!playerMidpoint) {
    return
  }
  let closestPlanetDistance: number = Infinity
  let closestPlanet: Planet | null = null
  for (const planet of getPlanets().getAll()) {
    const d = distance(planet.getCurrentMidpoint(), playerMidpoint)
    if (d < VIDEO_DISTANCE_THRESHOLD && d < closestPlanetDistance) {
      closestPlanet = planet
    }
  }

  if (closestPlanet !== currentClosestPlanet) {
    if (closestPlanet) {
      closestPlanet.getNode().exportAsync({format: "PNG"}).then((planetImgArray: Uint8Array) => {
        if (closestPlanet) {
          figma.ui.postMessage({embedUrl: closestPlanet.embedUrl, planetImgArray})
        }
      })
    } else {
      figma.ui.postMessage({embedUrl: "", planetImgArray: []})
    }

    currentClosestPlanet = closestPlanet

  }
  player.getCurrentMidpoint()
}

let lastFrameTimestamp: number = Date.now()
export function printFPS() {
  const currentFrameTimestamp = Date.now()
  const fps = Math.round(1000 / (currentFrameTimestamp - lastFrameTimestamp))
  lastFrameTimestamp = currentFrameTimestamp
  console.info(`fps: ${fps}`)
}

init()
setInterval(nextFrame, 1000 / FPS)