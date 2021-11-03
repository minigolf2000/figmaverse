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
    }

    currentEmbedUrl = embedUrl

    // const planetImg = document.getElementById("planetImg") as HTMLImageElement
    // if (planetImg) {
    //   planetImg.src = URL.createObjectURL(new Blob([planetImgArray], {type: 'image/png'}))
    // }
    const planetImg = document.getElementById("planetImg") as HTMLImageElement
    if (planetImg) {
      planetImg.src = URL.createObjectURL(new Blob([planetImgArray], {type: 'image/png'}))
    }
  }
}
