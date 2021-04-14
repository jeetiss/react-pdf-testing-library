import React from 'react'
import { Buffer } from 'buffer'
import Canvas from 'canvas'
import { renderToStream, Document, Page } from '@react-pdf/renderer'
import * as pdfjs from 'pdfjs-dist/es5/build/pdf'
import { crop } from './crop'

const DocumentChecker = ({ children }) => {
  let topLevelElement = children
  if (typeof children.type === 'function') {
    topLevelElement = children.type(children.props)
  }

  if (topLevelElement.type !== Document) {
    return (
      <Document>
        <Page size='A4'>{topLevelElement}</Page>
      </Document>
    )
  }

  return topLevelElement
}

const shallow = async (element) => {
  const source = React.isValidElement(element)
    ? await renderToBuffer(<DocumentChecker>{element}</DocumentChecker>)
    : element

  const document = await pdfjs.getDocument({
    data: source.buffer,
    verbosity: 0
  }).promise

  const pages = Array.from(
    { length: document.numPages },
    (_, i) => i
  ).map((index) => document.getPage(index + 1))

  let currentPage = null
  const getPage = (index) => {
    if (index == null && document.numPages !== 1) {
      throw Error(
        'Document contains more than 1 page, please provide a index of page for rendering'
      )
    }

    return pages[index ?? 0]
  }

  return {
    get pagesNumber () {
      return document.numPages
    },

    page (index) {
      currentPage = index

      return this
    },

    async imageSnapshot (options = {}) {
      const index = currentPage
      currentPage = null

      const page = await getPage(index)
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
    },

    async containsLinkTo (href) {
      const pageIndex = currentPage
      currentPage = null

      const page = await getPage(pageIndex)
      const annotations = await page.getAnnotations()

      return annotations.some(
        (annotation) => annotation.subtype === 'Link' && annotation.url === href
      )
    },

    async containsAnchorTo (dest) {
      const pageIndex = currentPage
      currentPage = null

      const page = await getPage(pageIndex)
      const annotations = await page.getAnnotations()

      if (dest.startsWith('#')) {
        dest = dest.substring(1)
      }

      return annotations.some(
        (annotation) =>
          annotation.subtype === 'Link' && annotation.dest === dest
      )
    }
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

const renderToBuffer = async function (element) {
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

export { shallow }
