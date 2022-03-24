import Slider from '../widgets/slider.js'
import ColorPicker from '../widgets/color-picker.js'

export default class Sidebar {
  getElement () {
    if (!this.element) {
      this._create()
    }
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

  changeStyle (widget, value) {
    console.log('widget, name', widget.settings.id, value)
    const settings = widget.settings
    this.selectedElement.style[settings.path] = this.getFormattedValue(value, settings.type)
  }

  getFormattedValue (value, type) {
    switch (type) {
      case 'pixel':
        return value + 'px'
      case 'color':
        console.log('color not implemented.')
        break
      default:
        throw Error('Unknown type ' + type)
    }
  }

  createWidgets () {
    const sidebar = this
    const configs = sidebar.getWidgetConfigs()
    configs.forEach(function (config) {
      let widget = null
      switch (config.type) {
        case 'pixel':
          widget = new Slider(config)
          break
        case 'color':
          widget = new ColorPicker(config)
          break
        default:
          throw Error('Unknown type \'' + config.type + '\'')
      }
      if (widget != null) {
        widget.addEventListener('change', function (value) {
          sidebar.changeStyle(widget, value)
        })
        sidebar.addWidget(widget)
      }
    })
  }

  addWidget (widget) {
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
      label: 'Top padding',
      default: 10,
      increment: 10,
      min: 0,
      max: 100
    }, {
      id: 'padding-bottom',
      type: 'pixel',
      path: 'paddingBottom',
      label: 'Bottom Padding',
      default: 10,
      increment: 10,
      min: 0,
      max: 100
    },
    {
      id: 'background-color',
      type: 'color',
      path: 'backgroundColor',
      label: 'Background Color',
      default: '#000000ff',
      increment: 10,
      min: 0,
      max: 100
    }]
    return options
  }

  addEventListener (eventType, listener) {
    this.listeners[eventType].push(listener)
  }

  setItemType (itemType) {
    this.itemType = itemType
  }

  constructor (itemType) {
    this.elementsCreated = false
    this.widgets = []
    this.listeners = {
      click: [],
      change: [],
      editStart: [],
      editEnd: []
    }
  }
}
