import React from 'react'
import { Document, Page } from '@react-pdf/renderer'
import Canvas from 'canvas'
import * as pdfjs from 'pdfjs-dist/es5/build/pdf'

import { renderToBuffer, getSnapshot, range } from './utils'
import * as checkers from './checkers'
import { crop } from './crop'

const checkPagesWith = (pages, checker) => async (original) => {
  const results = await Promise.all(
    pages.map((page) => checker(page, original))
  )

  return results.some(Boolean)
}

const composeCanvases = (canvases) => {
  const [maxWidth, maxHeight] = canvases.reduce(
    ([width, height], canvas) => [
      Math.max(width, canvas.width),
      Math.max(height, canvas.height)
    ],
    [0, 0]
  )

  const resultCanvas = Canvas.createCanvas(
    maxWidth,
    maxHeight * canvases.length
  )
  const resultContext = resultCanvas.getContext('2d')

  canvases.forEach((canvas, index) => {
    resultContext.drawImage(canvas, 0, maxHeight * index)
  })

  return resultCanvas
}

const renderComponent = async (element, { size = 'A4' } = {}) => {
  const source = await renderToBuffer(
    <Document>
      <Page size={size}>{element}</Page>
    </Document>
  )

  const document = await pdfjs.getDocument({
    data: source.buffer,
    verbosity: 0
  }).promise

  const pages = range(document.numPages).map((pageIndex) =>
    document.getPage(pageIndex + 1)
  )

  return {
    async imageSnapshot (options) {
      if (pages.length === 1) {
        return checkers.imageSnapshot(pages[0], options)
      } else {
        const canvases = await Promise.all(
          pages.map((page) => getSnapshot(page))
        )
        const pageSnapshots = composeCanvases(canvases)

        if (options.crop) {
          return crop(pageSnapshots, options.crop)
        }

        return pageSnapshots.toBuffer()
      }
    },

    containsLinkTo: checkPagesWith(pages, checkers.containsLinkTo),

    containsAnchorTo: checkPagesWith(pages, checkers.containsAnchorTo)
  }
}

export { renderComponent }
