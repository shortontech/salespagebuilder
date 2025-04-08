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
    this.listeners[eventType].forEach((listeners) => {
      listeners.call(this, args)
    })
  }

  addEventListener (eventType, listener) {
    this.listeners[eventType].push(listener)
  }

  constructor () {
    this.listeners = []
    this.listenerTypes.forEach((listenerType) => {
      this.listeners[listenerType] = []
    })
    this.setValue = this.setValue.bind(this)
    this.addEventListener = this.addEventListener.bind(this)
    this.fireEvent = this.fireEvent.bind(this)
    this.getValue = this.getValue.bind(this)
    this.setValue = this.setValue.bind(this)
    this.getElement = this.getElement.bind(this)
  }
}

Widget.prototype.listenerTypes = [
  'click',
  'change',
  'attach'
]
