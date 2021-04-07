// The entry file of your WebAssembly module.

export function crop(arr: Uint8ClampedArray, width: u32, height: u32): Array<u32> {
  const result: Array<u32> = new Array<u32>(4);

  // top
  result[0] = height;
  // right
  result[1] = 0;
  // bottom
  result[2] = 0;
  // left
  result[3] = width;

  for (let y: u32 = 0; y < height; ++y) {
    for (let x: u32 = 0; x < width; ++x) {
      const pos: u32 = (y * width + x) * 4;

      if (
        arr[pos] !== 255 ||
        arr[pos + 1] !== 255 ||
        arr[pos + 2] !== 255
      ) {
        // top
        result[0] = min(result[0], y);
        // right
        result[1] = max(x, result[1]);
        // bottom
        result[2] = max(result[2], y);
        // left
        result[3] = min(result[3], x);
      }
    }
  }

  return result;
}

export const dataId = idof<Uint8ClampedArray>()
