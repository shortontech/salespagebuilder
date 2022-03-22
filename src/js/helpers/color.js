class Color {
  /**
   * Converts an RGB or RGBA hex string to a series of RGBA numbers.
   * Not including the octothorpe.
   * @param String str
   * @returns Number[]
   */
  hexToRgba (str) {
    const arr = []
    for (let i = 0; i < 8; i += 2) {
      arr.push((str) ? Number.parseInt(str.substr(i, 2).padStart(1, '0'), 16) : 255)
    }

    return arr
  }

  /**
   * Converts values for hue, saturation, lightness, and alpha transparency into an Array of Numbers
   * representing a color.
   * @param Number h The hue
   * @param Number s The saturation
   * @param Number l The lightness
   * @param Number a The alpha transparency
   * @returns Number[]
   */
  hslToRgba (h, s, l, a) {
    const c = (1 - Math.abs((2 * l) - 1)) * s
    h *= 6
    const m = l - (c / 2)
    const x = c * (1 - Math.abs(h % 2 - 1))
    if (!a) {
      a = 255
    }
    switch (Math.floor(h)) {
      case 0:
        return [c + m, x + m, 0 + m, a]
      case 1:
        return [x + m, c + m, 0 + m, a]
      case 2:
        return [0 + m, c + m, x + m, a]
      case 3:
        return [0 + m, x + m, c + m, a]
      case 4:
        return [x + m, 0 + m, c + m, a]
      case 5:
        return [c + m, 0 + m, x + m, a]
    }
  }

  generateColors (canvas, h) {
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const imageData = ctx.createImageData(width, height)

    const maxP = imageData.data.length / 4
    for (let p = 0; p < maxP; p++) {
      const x = p % width
      const y = p / width
      const s = 1 - (x / width)
      const l = 1 - (y / height)

      const vals = this.hslToRgba(h, s, l, 255)
      const i = p * 4
      imageData.data[i] = Math.floor(vals[0] * 256)
      imageData.data[i + 1] = Math.floor(vals[1] * 256)
      imageData.data[i + 2] = Math.floor(vals[2] * 256)
      imageData.data[i + 3] = 255
    }
    ctx.putImageData(imageData, 0, 0)
  }

  /**
   * Converts Numbers representing RGBA or RGB to a hex code.
   * Not including the octothorpe
   * @returns String The hex code for the color
   */
  rgbaToHex () {
    return Object.values(arguments).map(function (arg) {
      return arg.toString(16).padStart(2, '0')
    })
      .join('')
      .padEnd(8, 'FF')
  }
}

export default new Color()
