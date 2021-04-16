import React from 'react'
import { Document, Page } from '@react-pdf/renderer'
import * as pdfjs from 'pdfjs-dist/es5/build/pdf'

import { PageChecker } from './checkers'
import { renderToBuffer, range } from './utils'

const renderComponent = async (element) => {
  const source = await renderToBuffer(
    <Document>
      <Page size='A4'>{element}</Page>
    </Document>
  )

  const document = await pdfjs.getDocument({
    data: source.buffer,
    verbosity: 0
  }).promise

  const pages = range(document.numPages).map((pageIndex) =>
    new PageChecker(document.getPage(pageIndex + 1))
  )

  return {
    async imageSnapshot (options) {
      const checker = pages[0]

      return checker.imageSnapshot(options)
    },

    async containsLinkTo (href) {
      const checker = pages[0]

      return checker.containsLinkTo(href)
    },

    async containsAnchorTo (dest) {
      const checker = pages[0]

      return checker.containsAnchorTo(dest)
    }
  }
}

export { renderComponent }
