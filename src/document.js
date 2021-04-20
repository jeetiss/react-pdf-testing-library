import { isValidElement } from 'react'
import * as pdfjs from 'pdfjs-dist/es5/build/pdf'

import * as checkers from './checkers'
import { renderToBuffer, range } from './utils'

/**
 * Renders react-pdf component or parse raw pdf and return test helpers
 * @param {Buffer | import('react').ReactElement} doc — the pdf for testing or react element
 * @returns {DocumentWrapper}
 */
const renderDocument = async (doc) => {
  const source = isValidElement(doc) ? await renderToBuffer(doc) : doc

  const document = await pdfjs.getDocument({
    data: source.buffer,
    verbosity: 0
  }).promise

  /**
   * @typedef PageChecker - a object with all helpers for this page
   */
  const pageCheckers = range(document.numPages).map((pageIndex) =>
    // bind all checkers to page with pageIndex
    Object.fromEntries(
      Object.entries(checkers).map(([name, fn]) => [
        name,
        fn.bind(null, document.getPage(pageIndex + 1))
      ])
    )
  )

  /**
   * @typedef DocumentWrapper - a Document wrapper with access to pdf content
   */
  return {
    // Returns amount of pages in pdf
    get pagesNumber () {
      return document.numPages
    },

    // Returns {@link PageChecker}
    page (index) {
      return pageCheckers[index ?? 0]
    },

    // Returns pdf metadata (author, description, subject, etc)
    async metadata () {
      return (await document.getMetadata()).info
    }
  }
}

export { renderDocument }
