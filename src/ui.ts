import './ui.css'

const uiEl = document.getElementById('ui')!
uiEl.focus()
uiEl.onkeydown = (e: KeyboardEvent) => {
  if (!e.repeat) {
    parent.postMessage({ pluginMessage: { type: 'keydown', keyCode: e.keyCode } }, '*')
    switch (e.keyCode as number) {
      case 13: // ENTER
      case 16: // SHIFT
      case 32: // SPACE
      case 88: // X
      case 190: // .
      case 90: // Z
      case 188: // ,
      case 38: // UP_ARROW
      case 87: // W
        const up = document.getElementById("space") as HTMLElement
        const upSquare = document.getElementById("spaceSquare") as HTMLElement
        up.setAttribute('fill', 'black')
        upSquare.setAttribute('fill', 'white')
        break
      case 37: // LEFT_ARROW
      case 65: // A
        const left = document.getElementById("left") as HTMLElement
        const leftSquare = document.getElementById("leftSquare") as HTMLElement
        left.setAttribute('fill', 'white')
        leftSquare.setAttribute('fill', 'black')
        break
      case 39: // RIGHT_ARROW
      case 68: // D
        const right = document.getElementById("right") as HTMLElement
        const rightSquare = document.getElementById("rightSquare") as HTMLElement
        right.setAttribute('fill', 'white')
        rightSquare.setAttribute('fill', 'black')
        break
      default:
        // up.stroke = `blue`
    }
  }
}
uiEl.onkeyup = (e: KeyboardEvent) => {
  parent.postMessage({ pluginMessage: { type: 'keyup', keyCode: e.keyCode } }, '*')
  switch (e.keyCode as number) {
    case 13: // ENTER
    case 16: // SHIFT
    case 32: // SPACE
    case 88: // X
    case 190: // .
    case 90: // Z
    case 188: // ,
    case 38: // UP_ARROW
    case 87: // W
      const up = document.getElementById("space") as HTMLElement
      const upSquare = document.getElementById("spaceSquare") as HTMLElement
      up.setAttribute('fill', 'white')
      upSquare.setAttribute('fill', 'black')
      break
    case 37: // LEFT_ARROW
    case 65: // A
      const left = document.getElementById("left") as HTMLElement
      const leftSquare = document.getElementById("leftSquare") as HTMLElement
      left.setAttribute('fill', 'black')
      leftSquare.setAttribute('fill', 'white')
      break
    case 39: // RIGHT_ARROW
    case 68: // D
      const right = document.getElementById("right") as HTMLElement
      const rightSquare = document.getElementById("rightSquare") as HTMLElement
      right.setAttribute('fill', 'black')
      rightSquare.setAttribute('fill', 'white')
      break
  }
}
uiEl.onblur = () => {
  parent.postMessage({ pluginMessage: { type: 'blur' } }, '*')
}
uiEl.onfocus = () => {
  parent.postMessage({ pluginMessage: { type: 'focus' } }, '*')
}

let currentEmbedUrl = ""
onmessage = (event) => {
  if (!event.data.pluginMessage) { return }
  const { shipSvg, rotation, embedUrl, planetImgArray } = event.data.pluginMessage

  if (rotation !== undefined) {
    const shipNode = document.getElementById("ship")
    if (shipNode) {
      shipNode.style.transform = `rotate(-${rotation}deg)`
    }
  }

  if (shipSvg !== undefined) {
    const shipNode = document.getElementById("ship") as HTMLImageElement
    if (shipNode) {
      shipNode.src = URL.createObjectURL(new Blob([shipSvg], {type: 'image/png'}))
    }
  }

  console.log(embedUrl, currentEmbedUrl)
  if (embedUrl !== undefined && embedUrl !== currentEmbedUrl) {
    console.log("update")
    const iframe = document.getElementById("loom") as HTMLIFrameElement
    const loading = document.getElementById("loading") as HTMLDivElement
    iframe.src = embedUrl
    if (embedUrl === "") {
      iframe.style.display = "none"
      loading.style.display = "none"
    } else {
      iframe.style.display = "block"
      loading.style.display = "flex"
      setTimeout(() => loading.style.display = "none", 1000)
    }

    currentEmbedUrl = embedUrl

    // const planetImg = document.getElementById("planetImg") as HTMLImageElement
    // if (planetImg) {
    //   planetImg.src = URL.createObjectURL(new Blob([planetImgArray], {type: 'image/png'}))
    // }
    const planetImgs = document.getElementsByClassName("planet") as HTMLCollectionOf<HTMLImageElement>
    for (const p of planetImgs) {
      p.src = URL.createObjectURL(new Blob([planetImgArray], {type: 'image/png'}))
    }
  }
}
