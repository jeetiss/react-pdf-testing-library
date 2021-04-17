import { Buffer } from 'buffer'
import { renderToStream } from '@react-pdf/renderer'
import Canvas from 'canvas'

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

export const getSnapshot = async (pagePromise) => {
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

  return canvas
}

export const range = (length) => Array.from({ length }, (_, index) => index)

export const renderToBuffer = async function (element) {
  const stream = await renderToStream(element)
  return new Promise((resolve) => {
    const bufs = []
    stream.on('data', function (d) {
      bufs.push(d)
    })
    stream.on('end', function () {
      resolve(Buffer.concat(bufs))
    })
  })
}
