export default class Slider {
  click (handler) {
    this.listeners.click.push(handler.bind(this))
    return this
  }

  /**
   * Set the value without firing events.
   * @param {*} val
   */
  setValue (val) {
    this.value = val
    this.changeBtnPos()
  }

  changeBtnPos () {
    const box = this.barElement.getBoundingClientRect()
    const valBox = this.valueElement.getBoundingClientRect()
    const valueFraction = (this.value - this.min) / (this.max - this.min)
    const newLeft = (valueFraction * box.width) - (valBox.width / 2)
    this.valueElement.style.left = newLeft + 'px'
    console.log()
  }

  changeValue (val) {
    if (this.value !== val) {
      this.setValue(this.value = val)
      this.fireEvent('change', val)
    }
  }

  getValue () {
    return this.value
  }

  getElement () {
    return this.element
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
    self.barElement.addEventListener('mousedown', function (e) {
      e.preventDefault()
      const pos = self.calculatePosition(e.x)
      self.changeValue(self.calculateNewValue(pos))

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

  fireEvent (eventType) {
    const args = Object.keys(arguments)
    args.shift() // Remove the event type from args.
    const self = this
    this.listeners[eventType].forEach(function (listeners) {
      listeners.call(self, args)
    })
  }

  calculatePosition (mouseX) {
    const box = this.barElement.getBoundingClientRect()
    return (mouseX - box.left) / box.width
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

    this.listeners = {
      click: [],
      change: []
    }
    this._create()
  }
}
