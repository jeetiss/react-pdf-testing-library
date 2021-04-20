import { Buffer } from 'buffer'
import { renderToStream } from '@react-pdf/renderer'
import Canvas from 'canvas'

/**
 * copy-pasted code from
 * https://github.com/mozilla/pdf.js/blob/master/examples/node/pdf2png/pdf2png.js#L20-L49
 */
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
/**
 * Renders PDFPageProxy to canvas
 * @param {Promise<PDFPageProxy>} pagePromise — the promise that will be resolved with PDFPageProxy instance
 * @returns {canvas} a PDFPageProxy content on canvas
 */
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

/**
 * Generates a array with numbers from 0 to length-1
 * @param {number} length — size of array
 * @returns {number[]} array
 */
export const range = (length) => Array.from({ length }, (_, index) => index)

/**
 * Renders `@react-pdf/renderer` element to buffer
 * @param {import('react').ReactElement} element — react element
 * @returns {Buffer} raw pdf buffer
 */
export const renderToBuffer = async function (element) {
  const stream = await renderToStream(element)
  return new Promise((resolve) => {
    const buffers = []
    stream.on('data', function (d) {
      buffers.push(d)
    })
    stream.on('end', function () {
      resolve(Buffer.concat(buffers))
    })
  })
}
