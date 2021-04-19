import { crop } from './crop'
import { getSnapshot } from './utils'

export const containsLinkTo = async (pagePromise, href) => {
  const page = await pagePromise
  const annotations = await page.getAnnotations()

  return annotations.some(
    (annotation) => annotation.subtype === 'Link' && annotation.url === href
  )
}

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

export const imageSnapshot = async (pagePromise, options = {}) => {
  let canvas = await getSnapshot(pagePromise)

  if (options.crop) {
    canvas = await crop(canvas, { sides: options.crop })
  }

  return canvas.toBuffer()
}
