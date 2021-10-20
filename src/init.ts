import { Planets } from './planets'
import { onButtonsPressed } from './buttons'
import { getPlayer, getWorldNode, setPlayer, setWorldNode, setWorldRectangle } from './lib'
import { Player } from './player'

// Return true if initializing as the server
// Return false if initializing as a client
export function init() {
  // TODO: support configurable player numLives?

  const alreadyRunningWorld: FrameNode = figma.currentPage.children.find(n => n.type === "FRAME" && n.name.includes(" (to join, click Play planets in right panel!)")) as FrameNode
  if (alreadyRunningWorld) {
    sharedSetup(alreadyRunningWorld)
    return
  }

  let templateWorldNode: FrameNode | null = findNearestFrameAncestor()
  let worldNode: FrameNode | null
  if (!templateWorldNode) {
    return
  }

  templateWorldNode.setRelaunchData({relaunch: ''})
  worldNode = templateWorldNode.clone()
  worldNode.name = `${worldNode.name} (to join, click Play planets in right panel!)`
  worldNode.expanded = false // collapse this for performance by avoiding layers panel rerenders
  worldNode.visible = true

  new Planets(worldNode.children)
  sharedSetup(worldNode)

  figma.currentPage.setRelaunchData({relaunch: ''})
  worldNode.setRelaunchData({relaunch: ''})

  return
}

const findNearestFrameAncestor = () => {
  let current: SceneNode | null = figma.currentPage.selection[0]
  while (current) {
    if (current.type === 'FRAME') { return current as FrameNode }
    current = current.parent as SceneNode | null
  }
  return null
}

const sharedSetup = (worldNode: FrameNode) => {
  setWorldNode(worldNode)
  setWorldRectangle(worldNode)
  figma.showUI(__html__, {width: 500, height: 500})

  figma.viewport.zoom = 1

  new Planets(worldNode.children)

  const player = new Player()
  setPlayer(player)
  worldNode.appendChild(player.getNode())

  const pastSelection: string[] = figma.currentPage.selection.map(n => n.id)
  figma.currentPage.selection = []
  figma.ui.onmessage = (m) => onButtonsPressed(m, getPlayer().buttonsPressed)


  figma.on("close", () => {
    figma.currentPage.selection = pastSelection.map(id => figma.getNodeById(id)).filter(n => !!n) as SceneNode[]
    !getPlayer().getProjectileFrameNode().removed && getPlayer().getProjectileFrameNode().remove()
    !getPlayer().getNode().removed && getPlayer().getNode().remove()

    if (!getWorldNode().removed && !getWorldNode().findChild(c => c.name === "🚀")) {
      getWorldNode().remove()
    }
  })

}
