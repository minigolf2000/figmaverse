const { widget } = figma
import { FPS, getMultiplayerPlayers, getPlayer, getWorldNode, updateCamera } from './lib'
import { Planet } from './planet'
import { getPlanets } from './planets'
import { Player } from './player'
import { distance } from './vector'
import { init } from "./init"
import { ships } from "./shipSvgs"

const { AutoLayout, SVG, Text, useSyncedState, usePropertyMenu } = widget

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
    // {
    //   tooltip: 'Down',
    //   propertyName: 'decrement',
    //   itemType: 'action',
    // },
    // {
    //   tooltip: 'Up',
    //   propertyName: 'increment',
    //   itemType: 'action',
    // },
  ]

  usePropertyMenu(propertyMenu, ({ propertyName }) => {
    if (propertyName === 'decrement') {
      setCount(count - 1)
    } else if (propertyName === 'increment') {
      setCount(count + 1)
    } else if (propertyName === 'launch') {
      init(ships[count])
      setInterval(nextFrame, 1000 / FPS)
      return new Promise<void>(() => {})
    }
  })

  return (
    <AutoLayout
      direction={"vertical"}
      horizontalAlignItems="center"
      cornerRadius={8}
      spacing={12}
      stroke={{
        type: 'solid',
        color: '#123456',
      }}
    >
      <SVG src={ships[count]} />
      <Text fontSize={32} horizontalAlignText="center">
        {count}
      </Text>
    </AutoLayout>
  )
}


widget.register(Ship)
