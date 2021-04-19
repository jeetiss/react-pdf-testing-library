import Canvas from 'canvas'
import { crop } from './crop'

const createCanvas = () => {
  const canvas = Canvas.createCanvas(50, 50)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'black'
  ctx.fillRect(20, 20, 10, 10)

  return canvas
}

it('should work', async () => {
  const canvas = createCanvas()
  const cropped = await crop(canvas, { sides: true, padding: 0 })

  expect(cropped.width).toBe(10)
  expect(cropped.height).toBe(10)
  expect(cropped.toBuffer()).toMatchImageSnapshot()
})

it('should crop content on all sides', async () => {
  const testOptions = [
    { sides: 'top', padding: 0, result: { width: 50, height: 30 } },
    { sides: 'bottom', padding: 0, result: { width: 50, height: 30 } },
    { sides: 'left', padding: 0, result: { width: 30, height: 50 } },
    { sides: 'right', padding: 0, result: { width: 30, height: 50 } },

    { sides: ['top', 'bottom'], padding: 0, result: { width: 50, height: 10 } },
    { sides: ['top', 'left'], padding: 0, result: { width: 30, height: 30 } },
    { sides: ['top', 'right'], padding: 0, result: { width: 30, height: 30 } },

    {
      sides: ['bottom', 'left'],
      padding: 0,
      result: { width: 30, height: 30 }
    },
    {
      sides: ['bottom', 'right'],
      padding: 0,
      result: { width: 30, height: 30 }
    },

    {
      sides: ['left', 'right'],
      padding: 0,
      result:
    { width: 10, height: 50 }
    },

    {
      sides: ['top', 'left', 'right'],
      padding: 0,
      result: { width: 10, height: 30 }
    },

    {
      sides: ['top', 'left', 'right', 'bottom'],
      padding: 0,
      result: { width: 10, height: 10 }
    }
  ]

  const canvas = createCanvas()

  for (const { result, ...options } of testOptions) {
    const cropped = await crop(canvas, options)

    expect(cropped.width).toBe(result.width)
    expect(cropped.height).toBe(result.height)
    expect(cropped.toBuffer()).toMatchImageSnapshot()
  }
})
