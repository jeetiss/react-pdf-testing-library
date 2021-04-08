import { instantiate } from '@assemblyscript/loader'
import { readFile } from 'fs/promises'

const asm = instantiate(readFile('./src/crop/assembly/code.wasm'))

const clamp = (min, value, max) => Math.min(max, Math.max(value, min))

export const crop = async (imageData, padding = 20) => {
  const { exports } = await asm
  const { crop, dataId } = exports
  const { __newArray, __getUint32Array } = exports

  const [top, right, bottom, left] = __getUint32Array(
    crop(__newArray(dataId, imageData.data), imageData.width, imageData.height)
  )

  return {
    top: clamp(0, top - padding, imageData.height),
    right: clamp(0, right + padding, imageData.width),
    bottom: clamp(0, bottom + padding, imageData.height),
    left: clamp(0, left - padding, imageData.width)
  }
}
