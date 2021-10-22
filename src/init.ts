import { Planets } from './planets'
import { onButtonsPressed } from './buttons'
import { getMultiplayerPlayers, getPlayer, getWorldNode, setMultiplayerPlayers, setPlayer, setWorldNode, setWorldRectangle } from './lib'
import { Player } from './player'
import { ships } from './shipSvgs'

export function init(shipSvg: string) {
  const alreadyRunningWorld: FrameNode = figma.currentPage.children.find(n => n.type === "FRAME" && n.name.includes(" (to join, click Play planets in right panel!)")) as FrameNode
  if (alreadyRunningWorld) {
    sharedSetup(shipSvg, alreadyRunningWorld)
    return
  }

  let templateWorldNode: FrameNode | null = findFigmaverseFrame()
  let worldNode: FrameNode | null
  if (!templateWorldNode) {
    figma.closePlugin("Could not find a Frame named 'Figmaverse'")
    return
  }

  templateWorldNode.setRelaunchData({relaunch: ''})
  worldNode = templateWorldNode.clone()
  worldNode.name = `${worldNode.name} (to join, click Play planets in right panel!)`
  worldNode.expanded = false // collapse this for performance by avoiding layers panel rerenders
  worldNode.visible = true

  new Planets(worldNode.children)
  sharedSetup(shipSvg, worldNode)

  figma.currentPage.setRelaunchData({relaunch: ''})
  worldNode.setRelaunchData({relaunch: ''})

  return
}

const findFigmaverseFrame = () => {
  return figma.currentPage.findOne(n => n.name === 'Figmaverse' && n.type === 'FRAME') as FrameNode
}

const sharedSetup = (shipSvg: string, worldNode: FrameNode) => {
  setWorldNode(worldNode)
  setWorldRectangle(worldNode)

  figma.showUI(__html__, {width: 500, height: 500, position: {x: 10000, y: 10000}})

  figma.viewport.zoom = 1

  new Planets(worldNode.children)

  const player = new Player(shipSvg)
  setPlayer(player)
  worldNode.appendChild(player.getNode())

  /* Load test */
  const loadTestPlayers: Player[] = []
  for (let i = 0; i < 0; i++) {
    const loadTestPlayer = new Player(
      ships[Math.floor(Math.random() * ships.length)],
      {x: Math.random() * 500, y: Math.random() * 500}
    )
    loadTestPlayers.push(loadTestPlayer)
    worldNode.appendChild(loadTestPlayer.getNode())
  }
  setMultiplayerPlayers(loadTestPlayers)


  const pastSelection: string[] = figma.currentPage.selection.map(n => n.id)
  figma.currentPage.selection = []
  // figma.ui.onmessage = (m) => onButtonsPressed(m, getPlayer().buttonsPressed)

  figma.ui.onmessage = (m) => {
    onButtonsPressed(m, getPlayer().buttonsPressed)
    for (const p of getMultiplayerPlayers()) {
      onButtonsPressed(m, p.buttonsPressed)
    }
  }


  figma.on("close", () => {
    figma.currentPage.selection = pastSelection.map(id => figma.getNodeById(id)).filter(n => !!n) as SceneNode[]
    !getPlayer().getNode().removed && getPlayer().getNode().remove()

    if (!getWorldNode().removed && !getWorldNode().findChild(c => c.name === "🚀")) {
      getWorldNode().remove()
    }
  })

}
