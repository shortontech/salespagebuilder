export class Sidebar {
  getElement () {
    return this.element
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

  constructor (itemType) {
    this.itemType = itemType
    this.handlers = {
      click: [],
      change: []
    }
    this._create()
  }
}
