import { Buffer } from 'buffer'
import { renderToStream } from '@react-pdf/renderer'

export const range = (length) => Array.from({ length }, (_, index) => index)

export const renderToBuffer = async function (element) {
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
