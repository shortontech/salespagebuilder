export default class Widget {
  changeValue (val) {
    if (this.value !== val) {
      // Set the value and change the button position.
      this.setValue(this.value = val)
      this.fireEvent('change', val)
    }
  }

  /**
   * Set the value without firing events.
   * @param {*} val
   */
  setValue (val) {
    this.value = val
    this.changeBtnPos()
  }

  getValue () {
    return this.value
  }

  getElement () {
    return this.element
  }

  fireEvent (eventType) {
    const args = Object.values(arguments)
    args.shift() // Remove the event type from args.
    const self = this
    this.listeners[eventType].forEach(function (listeners) {
      listeners.call(self, args)
    })
  }

  addEventListener (eventType, listener) {
    this.listeners[eventType].push(listener)
  }

  constructor () {
    const self = this
    this.listeners = []
    this.listenerTypes.forEach(function (listenerType) {
      self.listeners[listenerType] = []
    })
  }
}

Widget.prototype.listenerTypes = [
  'click',
  'change',
  'attach'
]
