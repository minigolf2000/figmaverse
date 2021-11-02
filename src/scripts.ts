// Ok this ended up not working but lets keep this til the end of maker week anyway just in case

export async function regenerateShips() {
  const shipsPage = figma.root.findChild(page => page.name === 'Ships')
  if (!shipsPage) { return }

  const shipFrames = shipsPage.findChildren(n => n.name.includes("ship-") && n.type === "FRAME") as FrameNode[]
  for (const shipFrame of shipFrames) {
    const shipFrameDuplicate = shipFrame.clone()
    shipFrameDuplicate.x += 100

    const hullNodes = shipFrameDuplicate.findChildren(c => c.name !== "🔥")
    console.log("a", hullNodes, figma.currentPage)
    const hullGroup = figma.group(hullNodes, figma.currentPage)
    console.log("b")
    const hullImage = await hullGroup.exportAsync({format: "PNG"})
    console.log("c")
    const hullImageRect = figma.createRectangle()
    hullImageRect.fills = [{type: "IMAGE", scaleMode: "FILL", imageHash: figma.createImage(hullImage).hash}]
    hullGroup.remove()

    const thrustNodes = shipFrameDuplicate.findChildren(c => c.name === "🔥")
    const thrustGroup = figma.group(thrustNodes, shipFrameDuplicate)
    const thrustImage = await thrustGroup.exportAsync({format: "PNG"})
    const thrustImageRect = figma.createRectangle()
    thrustImageRect.fills = [{type: "IMAGE", scaleMode: "FILL", imageHash: figma.createImage(thrustImage).hash}]
    thrustGroup.remove()

  }
}


