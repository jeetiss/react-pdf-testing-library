import { crop } from './crop'
import { getCanvas } from './utils'

/**
 * Checks that link with href exists on the page
 * @param {Promise<PDFPageProxy>} pagePromise — the promise that will be resolved with PDFPageProxy instance
 * @param {string} href - the link
 * @returns {boolean}
 */
export const containsLinkTo = async (pagePromise, href) => {
  const page = await pagePromise
  const annotations = await page.getAnnotations()

  return annotations.some(
    (annotation) => annotation.subtype === 'Link' && annotation.url === href
  )
}

/**
 * Checks that page contains goto construction
 * @param {Promise<PDFPageProxy>} pagePromise — the promise that will be resolved with PDFPageProxy instance
 * @param {string} dest - the id of destination, should starts with #
 * @returns {boolean}
 */
export const containsAnchorTo = async (pagePromise, dest) => {
  const page = await pagePromise
  const annotations = await page.getAnnotations()

  if (dest.startsWith('#')) {
    dest = dest.substring(1)
  }

  return annotations.some(
    (annotation) => annotation.subtype === 'Link' && annotation.dest === dest
  )
}

/**
 * Returns image snapshot of the page
 * @param {Promise<PDFPageProxy>} pagePromise — the promise that will be resolved with PDFPageProxy instance
 * @param {{ crop: CropSides }} options — directions for crop
 * @returns {Buffer} - a raw png image
 */
export const imageSnapshot = async (pagePromise, options = {}) => {
  let canvas = await getCanvas(pagePromise)

  if (options.crop) {
    canvas = await crop(canvas, { sides: options.crop })
  }

  return canvas.toBuffer()
}
