import Widget from '../widgets/widget.js'
import color from '../helpers/color.js'
export default class ColorPicker extends Widget {
  changeBtnPos () {
    const box = this.barElement.getBoundingClientRect()
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

  generateColors (h) {
    const width = this.canvas.width
    const height = this.canvas.height
    const imageData = this.context.createImageData(width, height)

    const maxP = imageData.data.length / 4
    for (let p = 0; p < maxP; p++) {
      const x = p % width
      const y = p / width
      const s = 1 - (x / width)
      const l = 1 - (y / height)

      const vals = color.hslToRgba(h, s, l, 255)
      const i = p * 4
      imageData.data[i] = Math.floor(vals[0] * 256)
      imageData.data[i + 1] = Math.floor(vals[1] * 256)
      imageData.data[i + 2] = Math.floor(vals[2] * 256)
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
    // self.barElement.addEventListener('mousedown', function (e) {
    //   e.preventDefault()
    //   const pos = self.calculatePosition(e.x)
    //   self.changeValue(self.calculateNewValue(pos))

    //   self.hasMouseDown = true
    // })
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
        const pos = self.calculatePosition(e.x)
        self.changeValue(self.calculateNewValue(pos))
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

    this.canvas = document.createElement('canvas')
    this.canvas.classList.add('pb-color-canvas')
    this.canvas.innerHTML = '&nbsp;'
    this.canvasWrapper.appendChild(this.canvas)
    this.context = this.canvas.getContext('2d')
    this._addMouseMoveHandler()
    this._addMouseDownHandler()
    this._addMouseUpHandler()
    this._addAttachEvent()
  }

  calculatePosition (mouseX) {
    const box = this.barElement.getBoundingClientRect()
    return (mouseX - box.left) / box.width
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
  }
}

ColorPicker.prototype.hasMouseDown = false
ColorPicker.prototype.mouseMoveTimeout = null
