export default class Slider {
  click (handler) {
    this.handlers.click.push(handler.bind(this))
    return this
  }

  getValue () {
    return this.value
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
  }
}
