import { instantiateStreaming } from '@assemblyscript/loader'
import { readFile } from 'fs/promises'
import Canvas from 'canvas'

const asm = instantiateStreaming(readFile('./src/crop/assembly/code.wasm'))

const clamp = (min, value, max) => Math.min(max, Math.max(value, min))

const cropAsm = async (imageData, padding = 20) => {
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

const optionsToDimentions = (options) => {
  if (!Array.isArray(options)) {
    return typeof options === 'boolean'
      ? ['bottom', 'left', 'right', 'top']
      : [options]
  }

  return options
}

export const crop = async (canvas, options = {}) => {
  const context = canvas.getContext('2d')
  const docCoods = {
    top: 0,
    left: 0,
    bottom: canvas.height,
    right: canvas.width
  }
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const contentCoords = await cropAsm(imageData)
  const cropDimensions = optionsToDimentions(options)

  cropDimensions.forEach((dimension) => {
    docCoods[dimension] = contentCoords[dimension]
  })

  const sx = docCoods.top
  const sy = docCoods.left
  const sWidth = docCoods.right - docCoods.left + 1
  const sHeight = docCoods.bottom - docCoods.top + 1

  const croppedCanvas = Canvas.createCanvas(sWidth, sHeight)
  const ctx = croppedCanvas.getContext('2d')

  ctx.drawImage(canvas, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

  return croppedCanvas.toBuffer()
}
