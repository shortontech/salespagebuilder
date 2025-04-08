import Widget from './Widget.js'
import color from '../helpers/color.js'
export default class ColorPicker extends Widget {

  /**
   * Draws the canvases on the first frame of animation once the page is loaded.
   */
  resize () {
    const rect = this.canvas.getBoundingClientRect()

    this.canvas.setAttribute('width', rect.width)
    this.canvas.setAttribute('height', rect.height)
    this.generateColors()
    this.generateHues()
  }

  /**
   * 
   */
  generateColors () {
    const rect = this.canvas.getBoundingClientRect()

    const [w, h] = [rect.width, rect.height]
    const imageData = this.context.createImageData(w, h)
    
    const maxP = imageData.data.length / 4
    for (let p = 0; p < maxP; p++) {
      const x = p % w
      const y = p / w
      const s = 1 - (x / w)
      const l = 1 - (y / h)

      const vals = color.hslToRgba(this.hue, s, l, 255)
      const i = p * 4
      imageData.data[i] = Math.floor(vals[0])
      imageData.data[i + 1] = Math.floor(vals[1])
      imageData.data[i + 2] = Math.floor(vals[2])
      imageData.data[i + 3] = 255
    }
    this.context.putImageData(imageData, 0, 0)
  }

  /**
   * 
   */
  generateHues () {
    const width = this.hueCanvas.width
    const height = this.hueCanvas.height
    const imageData = this.hueContext.createImageData(width, height)

    const maxP = imageData.data.length / 4
    for (let p = 0; p < maxP; p++) {
      const h = 1 - ((p / width) / height)
      const vals = color.hslToRgba(h, 1, 0.5, 255)
      const i = p * 4
      imageData.data[i] = Math.floor(vals[0])
      imageData.data[i + 1] = Math.floor(vals[1])
      imageData.data[i + 2] = Math.floor(vals[2])
      imageData.data[i + 3] = 255
    }
    this.hueContext.putImageData(imageData, 0, 0)
  }

  /**
   * 
   */
  _addAttachEvent () {
    this.addEventListener('attach', () => {
      this.resize()
    })
  }

  /**
   * Adds a mouse up handler to the document, so we know when the mouse is released.
   */
  _addMouseUpHandler () {
    const listenerFunc = (e) => {
      this.hasMouseDown = false
    }
    document.addEventListener('mouseup', listenerFunc)
    document.addEventListener('blur', listenerFunc)
  }
  /**
   * Adds a blur handler to the document, so that we treat the mouse as released
   */
  _addMouseUpHandler () {
    const listenerFunc = (e) => {
      this.hasMouseDown = false
    }
    document.addEventListener('mouseup', listenerFunc)
    document.addEventListener('blur', listenerFunc)
  }
  /**
   * 
   */
  _addMouseDownHandler () {
    // this.hueCanvas.addEventListener('')

    this.element.addEventListener('mousedown', (e) => {
      this.mouseDownTarget = e.target
      if (e.target === this.canvas) {
        e.preventDefault()
        this.changeValue(this.getColor(e.x, e.y))
        this.hasMouseDown = true
      } else if (e.target === this.hueCanvas) {
        this.hue = this.getHue(e.y)
        this.generateColors()
        this.hasMouseDown = true
      }
    })
  }

  /**
   * 
   */
  getHue (y) {
    const box = this.hueCanvas.getBoundingClientRect()
    let h = 1 - ((y - box.top) / box.height)
    h = Math.max(0, Math.min(h, 1))
    return h
  }

  /**
   * 
   */
  getColor (x, y) {
    const box = this.canvas.getBoundingClientRect()
    let s = 1 - ((x - box.left) / box.width)
    let l = 1 - ((y - box.top) / box.height)
    s = Math.max(0, Math.min(s, 1))
    l = Math.max(0, Math.min(l, 1))
    const vals = color.hslToRgba(this.hue, s, l, 255)
    return color.rgbaToHex.apply(null, vals)
  }

  /**
   * 
   */
  _addMouseMoveHandler () {
    document.addEventListener('mousemove', (e)=> {
      // Make sure the mouse is down.
      if (!this.hasMouseDown) {
        return
      }

      // Limit the number of times per second we can
      // the value to the refresh rate of the monitor
      if (!this.mouseMoveTimeout) {
        // this.canvas represents the saturation and brightness selection canvas
        // Should probably rename
        if (this.mouseDownTarget == this.canvas) {
          this.changeValue(this.getColor(e.x, e.y))
        } else if (this.mouseDownTarget) {
          // Update the hue
          this.hue = this.getHue(e.y)
          this.generateColors()
        }
        // Ensure that this function is not called until the page has been redrawn
        this.mouseMoveTimeout = true
        window.requestAnimationFrame(() => {
          this.mouseMoveTimeout = false
        })
      }
    })
  }

  /**
   * 
   */
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
    this.hueContext = this.hueCanvas.getContext('2d')

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

  /**
   * 
   */
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
    this.generateColors = this.generateColors.bind(this)
  }
}

ColorPicker.prototype.hasMouseDown = false
ColorPicker.prototype.mouseMoveTimeout = null
ColorPicker.prototype.mouseDownTarget = null