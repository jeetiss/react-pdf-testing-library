import { instantiateStreaming } from '@assemblyscript/loader'
import { readFile } from 'fs/promises'

const asm = instantiateStreaming(readFile('./src/crop/assembly/code.wasm'))

const clamp = (min, value, max) => Math.min(max, Math.max(value, min))

export const crop = async (imageData, padding = 20) => {
  const { exports } = await asm
  const { __newArray, __getArray } = exports

  const [top, right, bottom, left] = __getArray(
    exports.crop(
      __newArray(exports.arrayPtr, imageData.data),
      imageData.width,
      imageData.height
    )
  )

  return {
    top: clamp(0, top - padding, imageData.height),
    right: clamp(0, right + padding, imageData.width),
    bottom: clamp(0, bottom + padding, imageData.height),
    left: clamp(0, left - padding, imageData.width)
  }
}
