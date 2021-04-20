import React from 'react'
import { Document, Page } from '@react-pdf/renderer'
import Canvas from 'canvas'
import * as pdfjs from 'pdfjs-dist/es5/build/pdf'

import { renderToBuffer, getSnapshot, range } from './utils'
import * as checkers from './checkers'
import { crop } from './crop'
/**
 * Create function that runs all pages with one checker
 * @param {Promise<PDFPageProxy>[]} pages - the array of pages to check
 * @param {fn} checker — the check function that returns boolean
 * @returns {fn} — new checker function that runs over all pages
 */
const checkPagesWith = (pages, checker) => async (original) => {
  const results = await Promise.all(
    pages.map((page) => checker(page, original))
  )

  return results.some(Boolean)
}

/**
 * Create new canvas that contains all canvases
 * @param {canvas[]} canvases — the array of canvases for concatenation
 * @returns {canvas} a canvas
 */
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

/**
 * Renders react element and return test helpers
 * @param {import('react').ReactElement} element — the element to test
 * @param {{size: string|[number, number]}} options — size of page
 * @returns {Checkers} a object with methods that helps in testing
 */
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
    // Returns image snapshot of the component
    async imageSnapshot (options) {
      if (pages.length === 1) {
        return checkers.imageSnapshot(pages[0], options)
      } else {
        const canvases = await Promise.all(
          pages.map((page) => getSnapshot(page))
        )
        let pageSnapshots = composeCanvases(canvases)

        if (options.crop) {
          pageSnapshots = await crop(pageSnapshots, { sides: options.crop })
        }

        return pageSnapshots.toBuffer()
      }
    },

    // Checks that link with href exists in the component
    containsLinkTo: checkPagesWith(pages, checkers.containsLinkTo),

    // Checks that component contains goto construction
    containsAnchorTo: checkPagesWith(pages, checkers.containsAnchorTo)
  }
}

export { renderComponent }
