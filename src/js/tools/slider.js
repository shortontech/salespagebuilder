export default class Slider {
  click (handler) {
    this.handlers.click.push(handler.bind(this))
    return this
  }

  getValue () {
    return this.value
  }

  getElement () {
    return this.element
  }

  _addMouseUpHandler () {
    const self = this
    self.barElement.addEventListener('mouseup', function (e) {
      self.hasMouseDown = false
    })
  }

  _addMouseDownHandler () {
    const self = this
    self.barElement.addEventListener('mousedown', function (e) {
      // if (e.target !== self.barElement) {
      //   return
      // }
      const pos = self.calculatePosition(e.x)
      console.log(self.calculateNewValue(pos))
      self.hasMouseDown = true
    })
  }

  _addMouseMoveHandler () {
    const self = this
    document.addEventListener('mousemove', function (e) {
      // Make sure the mouse is down.
      if (!self.hasMouseDown) {
        return
      }
      // Limit the number of times per second we can change the value.
      if (!self.mouseMoveTimeout) {
        const pos = self.calculatePosition(e.x)
        console.log(self.calculateNewValue(pos))
        self.mouseMoveTimeout = setTimeout(function () {
          self.mouseMoveTimeout = null
        }, 100)
      }
    })
  }

  _create () {
    this.element = document.createElement('div')
    this.element.classList.add('pb-slider')
    this.labelElement = document.createElement('label')
    this.labelElement.innerText = this.label
    this.element.appendChild(this.labelElement)
    this.barElement = document.createElement('div')
    this.barElement.classList.add('pb-slider-bar')
    this.element.appendChild(this.barElement)
    this.valueElement = document.createElement('div')
    this.valueElement.classList.add('pb-slider-value')
    this.valueElement.innerHTML = '&nbsp;'
    this.barElement.appendChild(this.valueElement)

    this._addMouseMoveHandler()
    this._addMouseDownHandler()
    this._addMouseUpHandler()
  }

  calculatePosition (mouseX) {
    const boundingClientRect = this.barElement.getBoundingClientRect()
    return (mouseX - boundingClientRect.left) / boundingClientRect.width
  }

  calculateNewValue (percent) {
    const range = this.max - this.min
    const possibleValues = range / this.increment
    let newVal = Math.round(possibleValues * percent) * this.increment
    // Force the new value into the range.
    newVal = Math.max(newVal, this.min)
    return Math.min(newVal, this.max)
  }

  constructor (label, name, min, max, increment, value) {
    if (!label || !name || Number.isNaN(min) || Number.isNaN(max) || Number.isNaN(increment)) {
      throw Error('Invalid aruments')
    }
    this.label = label
    this.name = name
    this.min = min
    this.max = max
    this.increment = increment
    this.hasMouseDown = false
    this.mouseMoveTimeout = null
    if (value) {
      this.value = value
    } else {
      this.value = min
    }

    this.handlers = {
      click: [],
      change: []
    }
    this._create()
  }
}
