import { Planets } from './planets'
import { onButtonsPressed } from './buttons'
import { getMultiplayerPlayers, getPlayer, setMultiplayerPlayers, setPlayer, setWorldRectangle } from './lib'
import { Player } from './player'
import { ships } from './shipSvgs'

export function init(shipSvg: string) {
  const figmaverseFrame = figma.currentPage.findOne(n => n.name === 'Figmaverse' && n.type === 'FRAME') as FrameNode
  if (!figmaverseFrame) {
    figma.closePlugin("Could not find a Frame named 'Figmaverse'")
    return
  }

  new Planets(figmaverseFrame.children)
  setWorldRectangle(figmaverseFrame)

  figma.showUI(__html__, {width: 500, height: 500, position: {x: 10000, y: 10000}})
  figma.viewport.zoom = 1

  const player = new Player(shipSvg)
  setPlayer(player)

  /* Load test */
  const loadTestPlayers: Player[] = []
  for (let i = 0; i < 0; i++) {
    const loadTestPlayer = new Player(
      ships[Math.floor(Math.random() * ships.length)],
      {x: Math.random() * 500, y: Math.random() * 500}
    )
    loadTestPlayers.push(loadTestPlayer)
    figma.currentPage.appendChild(loadTestPlayer.getNode())
  }
  setMultiplayerPlayers(loadTestPlayers)

  figma.currentPage.appendChild(player.getNode())


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
  })

}
