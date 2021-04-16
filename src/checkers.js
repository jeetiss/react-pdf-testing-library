import Canvas from 'canvas'
import { crop } from './crop'

class NodeCanvasFactory {
  create (width, height) {
    const canvas = Canvas.createCanvas(width, height)
    const context = canvas.getContext('2d')
    return {
      canvas,
      context
    }
  }

  reset (canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width
    canvasAndContext.canvas.height = height
  }

  destroy (canvasAndContext) {
    canvasAndContext.canvas.width = 0
    canvasAndContext.canvas.height = 0
    canvasAndContext.canvas = null
    canvasAndContext.context = null
  }
}

const cropOptionsToDimentions = (options) => {
  if (!Array.isArray(options)) {
    return typeof options === 'boolean'
      ? ['bottom', 'left', 'right', 'top']
      : [options]
  }

  return options
}

export class PageChecker {
  constructor (page) {
    this.pagePromise = page
  }

  async containsLinkTo (href) {
    const page = await this.pagePromise
    const annotations = await page.getAnnotations()

    return annotations.some(
      (annotation) => annotation.subtype === 'Link' && annotation.url === href
    )
  }

  async containsAnchorTo (dest) {
    const page = await this.pagePromise
    const annotations = await page.getAnnotations()

    if (dest.startsWith('#')) {
      dest = dest.substring(1)
    }

    return annotations.some(
      (annotation) =>
        annotation.subtype === 'Link' && annotation.dest === dest
    )
  }

  async imageSnapshot (options = {}) {
    const page = await this.pagePromise
    const viewport = page.getViewport({ scale: 1.0 })
    const canvasFactory = new NodeCanvasFactory()
    const { canvas, context } = canvasFactory.create(
      viewport.width,
      viewport.height
    )
    const renderContext = {
      canvasContext: context,
      viewport,
      canvasFactory
    }

    const renderTask = page.render(renderContext)
    await renderTask.promise

    if (options.crop) {
      const docCoods = {
        top: 0,
        left: 0,
        bottom: canvas.height,
        right: canvas.width
      }
      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      )
      const contentCoords = await crop(imageData)
      const cropDimensions = cropOptionsToDimentions(options.crop)

      cropDimensions.forEach((dimension) => {
        docCoods[dimension] = contentCoords[dimension]
      })

      const sx = docCoods.top
      const sy = docCoods.left
      const sWidth = docCoods.right - docCoods.left + 1
      const sHeight = docCoods.bottom - docCoods.top + 1

      const croppedCanvas = Canvas.createCanvas(sWidth, sHeight)
      const ctx = croppedCanvas.getContext('2d')

      ctx.drawImage(canvas, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

      return croppedCanvas.toBuffer()
    }

    return canvas.toBuffer()
  }
}
