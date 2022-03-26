import Widget from '../widgets/widget.js'
import color from '../helpers/color.js'
export default class ColorPicker extends Widget {
  changeBtnPos () {
    const box = this.canvas.getBoundingClientRect()
    const valBox = this.canvas.getBoundingClientRect()
    const valueFraction = (this.value - this.settings.min) / (this.settings.max - this.settings.min)
    const newLeft = (valueFraction * box.width) - (valBox.width / 2)
    this.canvas.style.left = newLeft + 'px'
  }

  _addAttachEvent () {
    const self = this
    this.addEventListener('attach', function () {
      self.resize()
    })
  }

  resize () {
    const rect = this.canvas.getBoundingClientRect()

    this.canvas.setAttribute('width', rect.width)
    this.canvas.setAttribute('height', rect.height)
    this.generateColors(0)
  }

  generateColors () {
    const width = this.canvas.width
    const height = this.canvas.height
    const imageData = this.context.createImageData(width, height)

    const maxP = imageData.data.length / 4
    for (let p = 0; p < maxP; p++) {
      const x = p % width
      const y = p / width
      const s = 1 - (x / width)
      const l = 1 - (y / height)

      const vals = color.hslToRgba(this.hue, s, l, 255)
      const i = p * 4
      imageData.data[i] = Math.floor(vals[0])
      imageData.data[i + 1] = Math.floor(vals[1])
      imageData.data[i + 2] = Math.floor(vals[2])
      imageData.data[i + 3] = 255
    }
    this.context.putImageData(imageData, 0, 0)
  }

  _addMouseUpHandler () {
    const self = this
    const listenerFunc = function (e) {
      self.hasMouseDown = false
    }
    document.addEventListener('mouseup', listenerFunc)
    document.addEventListener('blur', listenerFunc)
  }

  _addMouseDownHandler () {
    const self = this
    self.canvas.addEventListener('mousedown', function (e) {
      e.preventDefault()
      self.changeValue(self.getColor(e.x, e.y))
      self.hasMouseDown = true
    })
  }

  getColor (x, y) {
    const box = this.canvas.getBoundingClientRect()
    let s = 1 - ((x - box.left) / box.width)
    let l = 1 - ((y - box.top) / box.height)
    s = Math.max(0, Math.min(s, 1))
    l = Math.max(0, Math.min(l, 1))
    const vals = color.hslToRgba(this.hue, s, l, 255)
    return color.rgbaToHex.apply(null, vals)
  }

  _addMouseMoveHandler () {
    const self = this
    document.addEventListener('mousemove', function (e) {
      // Make sure the mouse is down.
      if (!self.hasMouseDown) {
        return
      }

      // Limit the number of times per second we can
      // the value to the refresh rate of the monitor
      if (!self.mouseMoveTimeout) {
        self.changeValue(self.getColor(e.x, e.y))
        self.mouseMoveTimeout = true
        window.requestAnimationFrame(function () {
          self.mouseMoveTimeout = false
        })
      }
    })
  }

  _create () {
    this.element = document.createElement('div')
    this.element.classList.add('pb-color')

    this.labelElement = document.createElement('label')
    this.labelElement.innerText = this.settings.label
    this.element.appendChild(this.labelElement)

    this.canvasWrapper = document.createElement('div')
    this.canvasWrapper.classList.add('pb-color-wrapper')
    this.element.appendChild(this.canvasWrapper)

    this.hueCanvas = document.createElement('canvas')
    this.hueCanvas.classList.add('pb-hue-canvas')

    this.canvas = document.createElement('canvas')
    this.canvas.classList.add('pb-color-canvas')
    this.canvas.innerHTML = '&nbsp;'
    this.canvasWrapper.appendChild(this.canvas)
    this.canvasWrapper.appendChild(this.hueCanvas)
    this.context = this.canvas.getContext('2d')
    this._addMouseMoveHandler()
    this._addMouseDownHandler()
    this._addMouseUpHandler()
    this._addAttachEvent()
  }

  calculateNewValue (percent) {
    const range = this.settings.max - this.settings.min
    const possibleValues = range / this.settings.increment
    let newVal = Math.round(possibleValues * percent) * this.settings.increment
    // Force the new value into the range.
    newVal = Math.max(newVal, this.settings.min)
    return Math.min(newVal, this.settings.max)
  }

  constructor (settings) {
    super(settings)
    this.settings = settings
    this._create()
    this.hue = 0
  }
}

ColorPicker.prototype.hasMouseDown = false
ColorPicker.prototype.mouseMoveTimeout = null
