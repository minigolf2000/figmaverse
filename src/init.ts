import { Planets } from './planets'
import { onButtonsPressed } from './buttons'
import { getMultiplayerPlayers, getPlayer, getShipNodeFromIndex, setMultiplayerPlayers, setPlayer, setWorldRectangle } from './lib'
import { Player } from './player'
import { ships } from './shipSvgs'

export let isExited = false
// Insert spaceship nodes on top of Figmaverse but beneath everything else
const insertionIndex = 1

export function init(shipIndex: number) {
  if (!figma.currentUser?.id) { throw "Workshop mode users cannot run widgets" }
  const figmaverseFrame = figma.currentPage.findOne(n => n.name === 'Figmaverse' && n.type === 'FRAME') as FrameNode
  if (!figmaverseFrame) {
    figma.closePlugin("Could not find a Frame named 'Figmaverse'")
    return
  }


  new Planets(figmaverseFrame.children)
  setWorldRectangle(figmaverseFrame)
  figma.showUI(__html__, {width: 400, height: 140, position: {x: -10000, y: -10000}})
  figma.viewport.zoom = .5

  const playerNode = getShipNodeFromIndex(shipIndex)
  // Delete any old 🚀 nodes created by this player
  for (const child of figma.currentPage.children) {
    if (child.type === "FRAME" && child.getPluginData('user-id') === figma.currentUser.id) {
      child.remove()
    }
  }
  playerNode.setPluginData('user-id', figma.currentUser.id)
  playerNode.exportAsync({format: "PNG"}).then(shipSvg => figma.ui.postMessage({shipSvg}))

  const player = new Player(playerNode)
  setPlayer(player)

  /* Load test */
  const loadTestPlayers: Player[] = []
  for (let i = 0; i < 0; i++) {
    const loadTestPlayer = new Player(
      getShipNodeFromIndex(1 + Math.floor(Math.random() * (ships.length - 1))),
      {x: Math.random() * 500 - 250, y: Math.random() * 500 - 250}
    )
    loadTestPlayers.push(loadTestPlayer)
    figma.currentPage.insertChild(insertionIndex, loadTestPlayer.getNode())
  }
  setMultiplayerPlayers(loadTestPlayers)

  figma.currentPage.insertChild(insertionIndex, player.getNode())
  figma.currentPage.selection = []

  // figma.ui.onmessage = (m) => onButtonsPressed(m, getPlayer().buttonsPressed)
  figma.ui.onmessage = (m) => {
    onButtonsPressed(m, getPlayer().buttonsPressed)
    for (const p of getMultiplayerPlayers()) {
      onButtonsPressed(m, p.buttonsPressed)
    }
  }

  figma.on("close", () => {
    isExited = true
    !getPlayer().getNode().removed && getPlayer().getNode().remove()
    getMultiplayerPlayers().forEach(p => !p.getNode().removed && p.getNode().remove())
  })
}
