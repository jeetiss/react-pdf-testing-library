import { isValidElement } from 'react'
import * as pdfjs from 'pdfjs-dist/es5/build/pdf'

import { PageChecker } from './checkers'
import { renderToBuffer, range } from './utils'

const renderDocument = async (doc) => {
  const source = isValidElement(doc)
    ? await renderToBuffer(doc)
    : doc

  const document = await pdfjs.getDocument({
    data: source.buffer,
    verbosity: 0
  }).promise

  const pages = range(document.numPages).map((pageIndex) =>
    new PageChecker(document.getPage(pageIndex + 1))
  )

  return {
    get pagesNumber () {
      return document.numPages
    },

    page (index) {
      return pages[index ?? 0]
    },

    async metadata () {
      return (await document.getMetadata()).info
    }
  }
}

export { renderDocument }
