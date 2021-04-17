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

export const containsLinkTo = async (pagePromise, href) => {
  const page = await pagePromise
  const annotations = await page.getAnnotations()

  return annotations.some(
    (annotation) => annotation.subtype === 'Link' && annotation.url === href
  )
}

export const containsAnchorTo = async (pagePromise, dest) => {
  const page = await pagePromise
  const annotations = await page.getAnnotations()

  if (dest.startsWith('#')) {
    dest = dest.substring(1)
  }

  return annotations.some(
    (annotation) =>
      annotation.subtype === 'Link' && annotation.dest === dest
  )
}

export const imageSnapshot = async (pagePromise, options = {}) => {
  const page = await pagePromise
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
    return crop(canvas, options.crop)
  }

  return canvas.toBuffer()
}
