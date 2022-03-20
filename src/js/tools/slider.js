export default class Slider {
  click (handler) {
    this.handlers.click.push(handler.bind(this))
    return this
  }

  getValue () {
    return this.value
  }

  _create () {
    // <div class="pb-slider">
    // <div class="pb-slider-value">
    // &nbsp;
    // </div>
    // </div>
    this.element = document.createElement('div')
    this.element.classList.add('pb-slider')
    this.valueElement = document.createElement('div')
    this.valueElement.classList.add('pb-slider-value')
    this.element.appendChild(this.valueElement)
  }

  constructor (min, max, value) {
    this.min = min
    this.max = max
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
