const { widget } = figma
import { FPS, getMultiplayerPlayers, getOcclusionNode, getPlayer, getWorldNode, updateCamera } from './lib'
import { Planet } from './planet'
import { getPlanets } from './planets'
import { Player } from './player'
import { distance } from './vector'
import { init, isExited } from "./init"
import { ships } from "./shipSvgs"

const { SVG, useSyncedState, usePropertyMenu } = widget

// Game loop run by multiplayerPlayers
function nextFrame() {
  const player = getPlayer()
  if (player.buttonsPressed.esc) {
    figma.closePlugin()
    return
  }

  player.nextFrame()
  for (const p of getMultiplayerPlayers()) {
    p.nextFrame()
  }

  updateCamera(player, 200)
  updateLoomUrl(player)
  updateRotationInIframe(player)
  if (player.buttonsPressed.left ||player.buttonsPressed.right ||player.buttonsPressed.up) {
    figma.viewport.zoom = .5
  }
  lockFigmaverse()
}

let currentClosestPlanet: Planet | null = null
const VIDEO_DISTANCE_THRESHOLD = 600
function updateLoomUrl(player: Player) {
  const playerMidpoint = player.getCurrentMidpoint()
  let closestPlanetDistance: number = Infinity
  let closestPlanet: Planet | null = null
  for (const planet of getPlanets().getAll().filter(p => !!p.embedUrl)) {
    const d = distance(planet.getCurrentMidpoint(), playerMidpoint)
    if (d < VIDEO_DISTANCE_THRESHOLD && d < closestPlanetDistance) {
      closestPlanet = planet
    }
  }

  if (closestPlanet !== currentClosestPlanet) {
    if (currentClosestPlanet) {
      currentClosestPlanet?.onLeave()
    }

    currentClosestPlanet = closestPlanet

    if (currentClosestPlanet) {
      currentClosestPlanet.getNode().exportAsync({format: "PNG"}).then((planetImgArray: Uint8Array) => {
        resizeAnimation({x: 300, y: 80}, {x: 720, y: 80 + 360}, () => !!currentClosestPlanet, () => {
          if (currentClosestPlanet) {
            figma.ui.postMessage({embedUrl: currentClosestPlanet.embedUrl, planetImgArray})
          }
        })
      })
    } else {
      resizeAnimation({x: 720, y: 80 + 360}, {x: 300, y: 80}, () => !currentClosestPlanet)
      figma.ui.postMessage({embedUrl: "", planetImgArray: []})
    }

  }
}

const NUM_ANIMATION_STEPS = 8
function resizeAnimation(from: Vector, to: Vector, ifTrue: () => boolean, callback?: () => void) {
  let steps: Vector[] = []
  for (let i = 1; i <= NUM_ANIMATION_STEPS; i++) {
    steps.push({
      x: Math.floor((to.x - from.x) * (i / NUM_ANIMATION_STEPS) + from.x),
      y: Math.floor((to.y - from.y) * (i / NUM_ANIMATION_STEPS) + from.y)
    })
  }

  const resizeStep = () => {
    const nextStep = steps.shift()
    if (!nextStep || !ifTrue()) {
      if (!nextStep) { callback?.()}
      return
    }
    figma.ui.resize(nextStep?.x, nextStep.y)
    setTimeout(resizeStep, 16)
  }

  resizeStep()
}

let previousRotation = 0
function updateRotationInIframe(player: Player) {
  const newRotation = player.getCurrentMidpoint().rotation
  if (newRotation !== previousRotation && !isExited) {
    figma.ui.postMessage({rotation: newRotation})
    previousRotation = newRotation
  }
}

let framesSinceLockFigmaverse = 10
function lockFigmaverse() {
  framesSinceLockFigmaverse--
  if (framesSinceLockFigmaverse === 0) {
    if (!getWorldNode().locked) {
      getWorldNode().locked = true
    }
    if (!getOcclusionNode().locked) {
      getOcclusionNode().locked = true
    }
    framesSinceLockFigmaverse = 10
    }
}

let lastFrameTimestamp: number = Date.now()
export function printFPS() {
  const currentFrameTimestamp = Date.now()
  const fps = Math.round(1000 / (currentFrameTimestamp - lastFrameTimestamp))
  lastFrameTimestamp = currentFrameTimestamp
  console.info(`fps: ${fps}`)
}

export function Ship() {
  const [count, setCount] = useSyncedState('count', 0)
  const propertyMenu: WidgetPropertyMenuItem[] = [
    {
      tooltip: 'Choose this ship',
      propertyName: 'launch',
      itemType: 'action',
    },
  ]

  usePropertyMenu(propertyMenu, ({ propertyName }) => {
    if (propertyName === 'decrement') {
      setCount(count - 1)
    } else if (propertyName === 'increment') {
      setCount(count + 1)
    } else if (propertyName === 'launch') {
      init(count)
      setInterval(nextFrame, 1000 / FPS)
      return new Promise<void>(() => {})
    }
  })

  return (
    <SVG src={ships[count]} />
  )
}


widget.register(Ship)
