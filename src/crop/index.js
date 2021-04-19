import { instantiateStreaming } from '@assemblyscript/loader'
import { readFile } from 'fs/promises'
import Canvas from 'canvas'

// asm module
const asm = instantiateStreaming(readFile('./src/crop/assembly/code.wasm'))

const clamp = (min, value, max) => Math.min(max, Math.max(value, min))

/**
 * Js wrapper for assemblyscript crop module
 * @param {ImageData} imageData — the image date of canvas to crop
 * @param {number} padding — the value in px on that content area will be increased
 * @returns {{top: number, left: number, right: number, bottom: number}} content dimension
 */
const cropAsm = async (imageData, padding) => {
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

/**
 * Sides to crop
 * @typedef {'bottom' | 'left' | 'right' | 'top'} CropSides
 */

/**
 * Converts accepted parameters to array with CropSides
 * @param {true | CropSides | CropSides[]} sides - dimensions to crop
 * @returns {CropSides[]}
 */
const optionsToDimentions = (sides) => {
  if (!Array.isArray(sides)) {
    return typeof sides === 'boolean'
      ? ['bottom', 'left', 'right', 'top']
      : [sides]
  }

  return sides
}

/**
 * Crop options
 * @typedef {Object} CropOptions
 * @property {true | CropSides | CropSides[]} [sides] — sides on canvas that will be cropped
 *   if value is true, content will be cropped on all directions.
 * @property {number} [padding] — extends the content area on this value in all dimensions
 */

/**
 * Crops white color zones on canvas.
 * @param {canvas} canvas — the canvas with content to crop. *should be on white background*
 * @param {CropOptions} option — the crop options
 * @returns {canvas} a new cropped canvas.
 */
export const crop = async (canvas, { sides = [], padding = 20 } = {}) => {
  const context = canvas.getContext('2d')
  const docCoods = {
    top: 0,
    left: 0,
    bottom: canvas.height - 1,
    right: canvas.width - 1
  }
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const contentCoords = await cropAsm(imageData, padding)
  const cropDimensions = optionsToDimentions(sides)

  cropDimensions.forEach((dimension) => {
    docCoods[dimension] = contentCoords[dimension]
  })

  const sx = docCoods.left
  const sy = docCoods.top
  const sWidth = docCoods.right - docCoods.left + 1
  const sHeight = docCoods.bottom - docCoods.top + 1

  const croppedCanvas = Canvas.createCanvas(sWidth, sHeight)
  const ctx = croppedCanvas.getContext('2d')

  ctx.drawImage(canvas, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

  return croppedCanvas
}
