export class Sidebar {
  getElement () {
    return this.element
  }

  hide () {
    this.element.style.display = 'none'
  }

  show () {
    this.element.style.display = ''
    if (!this.elementsCreated) {
      this.fireEvent('createWidgets')
    }
  }

  addWidget (widget) {
    console.log('adding widget', widget)
    this.widgets.push(widget)
    this.widgetContainer.appendChild(widget.getElement())
  }

  _create () {
    this.element = document.createElement('div')
    this.element.classList.add('pb-' + this.itemType + '-settings')

    // Header
    const header = document.createElement('h1')
    header.innerText = 'Settings'

    // Create widget container.
    this.element.appendChild(header)
    this.widgetContainer = document.createElement('div')
    this.widgetContainer.classList.add('pb-' + this.itemType + 'widget-container')
    this.element.appendChild(this.widgetContainer)
    // Hide the sidebar.
    this.element.style.display = 'none'
  }

  editElement (ele) {
    this.selectedElement = ele
    this.show()
    this.fireEvent('change', ele)
    this.fireEvent('editStart', ele)
  }

  fireEvent (eventType) {
    const args = Object.keys(arguments)
    args.shift() // Remove the event type from args.
    const sidebar = this
    this.listeners[eventType].forEach(function (listeners) {
      listeners.call(sidebar, args)
    })
  }

  addEventListener (eventType, listener) {
    this.listeners[eventType].push(listener)
  }

  constructor (itemType) {
    this.itemType = itemType
    this.elementsCreated = false
    this.widgets = []
    this.listeners = {
      click: [],
      change: [],
      createWidgets: [],
      editStart: [],
      editEnd: []
    }
    this._create()
  }
}
