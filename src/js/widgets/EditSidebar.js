import Slider from './Slider.js'
import ColorPicker from './ColorPicker.js'
import { UnexpectedError } from '../helpers/Errors.js'

export default class EditSidebar {
  getElement () {
    if (!this.element) {
      this._create()
    }
    return this.element
  }
  /**
   * Hides the sidebar.
   */
  hide () {
    this.element.style.display = 'none'
  }

  show () {
    this.element.style.display = ''
    if (!this.elementsCreated) {
      this.createWidgets()
    }
  }

   /**
   * Updates the style of the selected element.
   * @param {object} widget - The widget associated with the style change.
   * @param {string} value - The new value for the style property.
   * @param {String} value 
   */
  changeStyle (widget, value) {
    const settings = widget.settings
    this.selectedElement.style[settings.path] = this.getFormattedValue(value, settings.type)
  }

    /**
   * Formats the style value based on its type.
   * @param {string} value - The value to format.
   * @param {string} type - The type of the value (e.g., 'pixel', 'color').
  getFormattedValue (value, type) {
    switch (type) {
      case 'pixel':
        return value + 'px'
      case 'color':
        return value
      default:
        throw Error('Unknown type ' + type)
    }
  }

  /**
   * Updates the padding of the selected element.
   * @param {string} value - The new padding value.
   */
  updatePadding(value) {
    console.log("updatePadding called");
    this.updateStyle("padding", value);
  }

  /**
   * Updates the margin of the selected element.
   * @param {string} value - The new margin value.
   */

   updateStyle(property, value) {
    console.log(`updateStyle called with property: ${property}, value: ${value}, item:`, this.item);
    this.item.style[property] = value;
  }
  /**
   * Creates and adds widgets to the sidebar.
   * Each widget is associated with a specific style property.
   * When a widget's value changes, the associated style property of the selected element is updated.
   *
   */
  createWidgets () {
    const sidebar = this
    const configs = sidebar.getWidgetConfigs()
    configs.forEach((config) => {
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
        widget.addEventListener('change', (value) => {
          sidebar.changeStyle(widget, value)
        })
        sidebar.addWidget(widget)
      }
    })
  }
  /**
   *Adds a widget to the sidebar.
   * @param {*} widget 
   */
  addWidget (widget) {
    this.widgets.push(widget)
    this.widgetContainer.appendChild(widget.getElement())
    widget.fireEvent('attach')
  }

  _create() {
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
   /**
   * Selects an element and prepares the sidebar for editing.
   * @param {PointerEvent} evt - The event that triggered the selection.
   */

  selectElement (evt) {
    console.log(evt)
    let ele = null

    if (!evt instanceof HTMLDivElement) {
        throw new UnexpectedError("Expecting HTMLDivElement")
    }

    this.selectedElement = ele
    this.show()
    this.fireEvent('change', ele)
    this.fireEvent('editStart', ele)
  }

  fireEvent (eventType) {
    const args = Object.keys(arguments)
    args.shift() // Remove the event type from args.
    const sidebar = this
    this.listeners[eventType].forEach((listeners) => {
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
    },
    {
      id: 'color',
      type: 'color',
      path: 'color',
      label: 'Font Color',
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

  /**
   * Updates the text color of the selected element.
   * @param {string} value - The new text color value.
   */
  updateTextColor(value) {
    console.log("updateTextColor called");
    this.updateStyle("color", value);
  }

  /**
   * Updates the background color of the selected element.
   * @param {string} value - The new background color value.
   */
  updateBackgroundColor(value) {
    console.log("updateBackgroundColor called");
    this.updateStyle("backgroundColor", value);
  }

    /**
   * Updates the margin of the selected element.
   * @param {string} value - The new margin value.
   */
  updateMargin(value) {
    console.log("updateMargin called");
    this.updateStyle("margin", value);
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
    this.addWidget = this.addWidget.bind(this)
    this.setItemType = this.setItemType.bind(this)
    this.selectElement = this.selectElement.bind(this)
  }
}
