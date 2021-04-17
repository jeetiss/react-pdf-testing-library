import { Canvas } from 'canvas'
import { range, getSnapshot } from './utils'

describe('range', () => {
  it('should return array', () => {
    expect(range(5).length).toBe(5)
  })

  it('should return array with elements from 0 to lenght-1', () => {
    expect(range(5)).toEqual(expect.arrayContaining([0, 1, 2, 3, 4]))
  })

  it('should return return empty array', () => {
    expect(range(0)).toEqual(expect.arrayContaining([]))
  })
})

describe('getSnapshot', () => {
  const fakePage = Promise.resolve({
    getViewport () {
      return {
        width: 50,
        height: 50
      }
    },

    render (options) {
      const ctx = options.canvasContext

      ctx.fillStyle = 'black'
      ctx.fillRect(20, 20, 10, 10)

      return { promise: Promise.resolve() }
    }
  })

  it('should return snapshot', async () => {
    const snapshot = await getSnapshot(fakePage)

    expect(snapshot).toBeInstanceOf(Canvas)
    expect(snapshot.width).toBe(50)
    expect(snapshot.height).toBe(50)
  })
})
