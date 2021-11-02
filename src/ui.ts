import './ui.css'

const uiEl = document.getElementById('ui')!
uiEl.focus()
uiEl.onkeydown = (e: KeyboardEvent) => {
  if (!e.repeat) {
    parent.postMessage({ pluginMessage: { type: 'keydown', keyCode: e.keyCode } }, '*')
  }
}
uiEl.onkeyup = (e: KeyboardEvent) => {
  parent.postMessage({ pluginMessage: { type: 'keyup', keyCode: e.keyCode } }, '*')
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

  if (embedUrl !== undefined && embedUrl !== currentEmbedUrl) {
    currentEmbedUrl = embedUrl
    const iframe = document.getElementById("loom") as HTMLIFrameElement
    if (iframe) {
      iframe.src = embedUrl
    }
    // const planetImg = document.getElementById("planetImg") as HTMLImageElement
    // if (planetImg) {
    //   planetImg.src = URL.createObjectURL(new Blob([planetImgArray], {type: 'image/png'}))
    // }
    const panel = document.getElementById("ui") as HTMLDivElement
    if (panel) {
      panel.style.background = `url(${URL.createObjectURL(new Blob([planetImgArray], {type: 'image/png'}))}) no-repeat center center fixed`
    }
  }
}
