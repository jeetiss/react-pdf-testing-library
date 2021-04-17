import { isValidElement } from 'react'
import * as pdfjs from 'pdfjs-dist/es5/build/pdf'

import * as checkers from './checkers'
import { renderToBuffer, range } from './utils'

const renderDocument = async (doc) => {
  const source = isValidElement(doc) ? await renderToBuffer(doc) : doc

  const document = await pdfjs.getDocument({
    data: source.buffer,
    verbosity: 0
  }).promise

  const pageCheckers = range(document.numPages).map((pageIndex) =>
    Object.fromEntries(
      Object.entries(checkers).map(([name, fn]) => [
        name,
        fn.bind(null, document.getPage(pageIndex + 1))
      ])
    )
  )

  return {
    get pagesNumber () {
      return document.numPages
    },

    page (index) {
      return pageCheckers[index ?? 0]
    },

    async metadata () {
      return (await document.getMetadata()).info
    }
  }
}

export { renderDocument }
