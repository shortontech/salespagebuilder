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
   * Converts RGB into an Array of Numbers
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
    let r = null
    switch (Math.floor(Math.min(h, 5))) {
      case 0:
        r = [c + m, x + m, 0 + m]
        break
      case 1:
        r = [x + m, c + m, 0 + m]
        break
      case 2:
        r = [0 + m, c + m, x + m]
        break
      case 3:
        r = [0 + m, x + m, c + m]
        break
      case 4:
        r = [x + m, 0 + m, c + m]
        break
      case 5:
        r = [c + m, 0 + m, x + m]
        break
      default:
        throw Error('invalid h' + h, Math.floor(h))
    }
    return [
      Math.floor(r[0] * 255),
      Math.floor(r[1] * 255),
      Math.floor(r[2] * 255),
      a
    ]
  }

  /**
   * Converts Numbers representing RGBA or RGB to a hex code.
   * Not including the octothorpe
   * @returns String The hex code for the color
   */
  rgbaToHex () {
    return '#' + Object.values(arguments).map(function (arg) {
      if (Number.isNaN(arg)) {
        throw Error('Invalid number.')
      }
      return arg.toString(16).padStart(2, '0')
    })
      .join('')
      .padEnd(8, 'FF')
  }
}

export default new Color()
