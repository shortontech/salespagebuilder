import Slider from '../tools/slider.js'
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
      this.createWidgets()
    }
  }

  createWidgets () {
    const sidebar = this
    const configs = sidebar.getWidgetConfigs()
    configs.forEach(function (config) {
      console.log('type', config.type)
      let widget = null
      switch (config.type) {
        case 'pixel':
          widget = new Slider(config)
          break
        default:
          console.log('Unknown type \'' + config.type + '\'')
      }
      if (widget != null) {
        widget.addEventListener('change', function () {
          console.log('change')
        })
        sidebar.addWidget(widget)
      }
    })
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

  getWidgetConfigs () {
    const options = [{
      id: 'margin-top',
      type: 'pixel',
      path: 'marginTop',
      label: 'Top Margin',
      default: 10,
      increment: 10,
      min: 0,
      max: 100
    }, {
      id: 'padding-top',
      type: 'pixel',
      path: 'paddingTop',
      label: 'Bottom Padding',
      default: 10,
      increment: 10,
      min: 0,
      max: 100
    }, {
      id: 'padding-bottom',
      type: 'pixel',
      path: 'paddingTop',
      label: 'Top Padding',
      default: 10,
      increment: 10,
      min: 0,
      max: 100
    }]
    return options
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
      editStart: [],
      editEnd: []
    }
    this._create()
  }
}
