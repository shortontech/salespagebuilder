import Widget from "./Widget.js"
export default class Slider extends Widget {
  changeBtnPos () {
    const box = this.barElement.getBoundingClientRect()
    const valBox = this.valueElement.getBoundingClientRect()
    const valueFraction = (this.value - this.settings.min) / (this.settings.max - this.settings.min)
    const newLeft = (valueFraction * box.width) - (valBox.width / 2)
    this.valueElement.style.left = newLeft + "px"
  }

  /**
   * Add a mouse up handler to the document.
   */
  _addMouseUpHandler () {
    const listenerFunc = (e) => {
      this.hasMouseDown = false
    }
    document.addEventListener("mouseup", listenerFunc)
    document.addEventListener("blur", listenerFunc)
  }
  /**
   * Add a mouse down handler to the slider.
   */
  _addMouseDownHandler () {
    this.barElement.addEventListener("mousedown", (e) => {
      e.preventDefault()
      const pos = this.calculatePosition(e.x)
      this.changeValue(this.calculateNewValue(pos))

      this.hasMouseDown = true
    })
  }

  /**
   * Change the value of the slider.
   * @param {Number} val 
   * @param {boolean} textChanged 
   */
  changeValue (val, textChanged) {
    if (this.value !== val) {
      // Set the value and change the button position.
      val = Math.min(val,this.settings.max)
      let barBox = this.barElement.getBoundingClientRect()
      let btnBox = this.valueElement.getBoundingClientRect()
      let barPercentage = val / this.settings.max
      let leftPos = (barBox.width * barPercentage) - (btnBox.width / 2)
      this.valueElement.style.left = leftPos + "px"
      this.setValue(val)
      if (!textChanged) {
        this.textBox.value = val
      }
      this.fireEvent('change', val)
    }
  }

  /**
   * Add a mouse move handler to the document.
   */
  _addMouseMoveHandler () {
    document.addEventListener("mousemove", (e) => {
      // Make sure the mouse is down.
      if (!this.hasMouseDown) {
        return
      }

      // Limit the number of times per second we can
      // the value to the refresh rate of the monitor
      if (!this.mouseMoveTimeout) {
        const pos = this.calculatePosition(e.x)
        let newValue = this.calculateNewValue(pos)

        this.changeValue(newValue)
        this.mouseMoveTimeout = true
        window.requestAnimationFrame(() => {
          this.mouseMoveTimeout = false
        })
      }
    })
  }

  /**
   * Create the slider element.
   */
  _create () {
    // Create the element
    this.element = document.createElement("DIV")
    this.element.classList.add("pb-slider")

    // Add the label element
    this.labelElement = document.createElement("LABEL")
    this.labelElement.innerText = this.settings.label
    this.element.appendChild(this.labelElement)

    // Add the bar element
    this.barElement = document.createElement("DIV")
    this.barElement.classList.add("pb-slider-bar")
    this.element.appendChild(this.barElement)

    // Add the value element
    this.valueElement = document.createElement("DIV")
    this.valueElement.classList.add("pb-slider-value")
    this.valueElement.innerHTML = "&nbsp;"
    this.barElement.appendChild(this.valueElement)

    // Add the text box
    this.textBox = document.createElement("INPUT")
    this.element.appendChild(this.textBox)
    this._addMouseMoveHandler()
    this._addMouseDownHandler()
    this._addMouseUpHandler()
    this._addInputChangeHandler()
  }

  /**
   * When the text box changes, update the value of the slider.
   * @param {String} val 
   */
  onTextChange(val) {
    // Validate the text
    if (isNaN(val)) {
      this.textBox.style.border = "solid 3px red"
    } else {
      // Format the value and update the value of the slider
      val = (new Number(val)) + 0
      this.textBox.style.border = "unset"
      if (val != self.value) {
        this.changeValue(val)
      }
    }
  }

  /**
   * Add a change handler to the text box.
   */
  _addInputChangeHandler () {
    this._textChangeEventHandled = false
    this.textBox.addEventListener('keyup', (evt)=> {
      if (!this._textChangeEventHandled) {
        this._textChangeEventHandled = true
        requestAnimationFrame(()=>{
          this._textChangeEventHandled = false
          this.onTextChange(evt.target.value)
        })
      }
    })
  }

  /**
   * 
   * @param {Number} mouseX 
   * @returns 
   */
  calculatePosition (mouseX) {
    const box = this.barElement.getBoundingClientRect()
    return (mouseX - box.left) / box.width
  }
  /**
   * Calculate the new value based on the percent.
   * @param {Number} percent
   * @returns {Number}
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
  }
}

Slider.prototype.hasMouseDown = false
Slider.prototype.mouseMoveTimeout = null
