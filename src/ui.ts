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
  const { color, embedUrl, planetImgArray } = event.data.pluginMessage

  if (color !== undefined) {
    const shipNode = document.getElementById("ship")
    if (shipNode) {
      const {r, g, b} = color
      const pathNode = shipNode.children[0] as SVGElement
      pathNode.style.fill = `rgb(${r*255},${g*255},${b*255})`
    }
  }

  if (embedUrl !== undefined && embedUrl !== currentEmbedUrl) {
    currentEmbedUrl = embedUrl
    const iframe = document.getElementById("loom") as HTMLIFrameElement
    if (iframe) {
      iframe.src = `https://www.loom.com/embed/${embedUrl}`
    }
    const planetImg = document.getElementById("planetImg") as HTMLImageElement
    if (planetImg) {
      planetImg.src = URL.createObjectURL(new Blob([planetImgArray], {type: 'image/png'}))
    }
  }
}
