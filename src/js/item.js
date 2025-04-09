'use strict'
// import { cloneItem, rgbaToHex } from './helpers.js'
import dom from './helpers/Dom.js'
import color from './helpers/Color.js'

export default class Item {
  changeNode (node, callback) {
    if (this.activeNode === node) {
      return
    }
    // Clean up the original node.
    if (this.itemType !== 'column') {
      this.removeClass('pb-' + this.itemType + '-selected')
    }

    // Set the active node and add the selected class
    this.activeNode = node

    // Remove the class used to show whether this is selected.
    if (callback) {
      callback(this.activeNode)
    }
  }

  edit (ele) {
    if (!ele) {
      throw Error('Element is invalid')
    }
    this.selectedElement = ele
    this.sidebar.selectElement(this.selectedElement)
  }

  setSelected () {
    if (this.itemType !== 'column') {
      this.addClass('pb-' + this.itemType + '-selected')
    }
  }

  clone () {
    this.activeNode.parentNode.insertBefore(dom.clone(this.activeNode), this.activeNode)
    this.fireEvent('clone', this.activeNode)
    return this
  }

  remove () {
    this.activeNode.parentNode.removeChild(this.activeNode)
    return this
  }

  moveUp () {
    console.log('Move up called.')
    return this
  }

  moveDown () {
    console.log('Move down called.')
    return this
  }

  fireEvent (eventType) {
    const args = Object.values(arguments)
    args.shift() // Remove the event type from args.
    const self = this
    this.listeners[eventType].forEach((listeners) => {
      listeners.call(self, args)
    })
  }

  addEventListener (eventType, listener) {
    this.listeners[eventType].push(listener)
  }

  setMakeToolbarFunc (callback) {
    this.makeToolbarCallback = callback
  }

  setSidebar (sidebar) {
    this.sidebar = sidebar
    if (this.itemType) {
      this.sidebar.setItemType(this.itemType)
    }
  }

  getSidebar () {
    this.sidebar.setItemType(this.itemType)
    return this.sidebar
  }

  getItemType () {
    return this.itemType
  }

  moveToolbar () {
    // Create it if it doesn't exist.
    if (this.toolbarNode == null) {
      this.toolbarNode = this.makeToolbar()
    }
    if (this.activeNode == null) {
      return
    }

    if (this.toolbarNode.parentNode != null) {
      // Don't bother moving the toolbar if it's already a child
      // of the active node.
      if (this.toolbarNode.parentNode === this.activeNode) {
        return this
      }
      // I don't think we need to do this.
      // I'm not going to test behavior of moving nodes around.
      this.toolbarNode.parentNode.removeChild(this.toolbarNode)
    }

    if (this.activeNode.firstChild) {
      this.activeNode.insertBefore(this.toolbarNode, this.activeNode.firstChild)
    } else {
      this.activeNode.appendChild(this.toolbarNode)
    }
    return this
  }

  makeToolbar () {
    if (!this.makeToolbarCallback) {
      return null
    }
    return this.makeToolbarCallback()
  }

  addClass (className) {
    this.addClasses([className])
  }

  removeClass (className) {
    this.removeClasses([className])
  }

  removeClasses (classList) {
    if (this.activeNode == null) {
      return this
    }

    classList.forEach(((className) => {
      if (this.activeNode.classList.contains(className)) {
        this.activeNode.classList.remove(className)
      }
    }).bind(this))
  }

  addClasses (classList) {
    if (this.activeNode == null) {
      return this
    }

    classList.forEach(((className) => {
      if (!this.activeNode.classList.contains(className)) {
        this.activeNode.classList.add(className)
      }
    }).bind(this))
  }

  make () {
    this.activeNode = document.createElement('div')
    this.addClasses(this.defaultClassList)
    return this.activeNode
  }

  getStyle (property) {
    return window.getComputedStyle(this.selectedElement, null).getPropertyValue(property)
  }

  getStyleInt (property) {
    return Number.parseFloat(this.getStyle(property))
  }

  getStyleColor (property) {
    let val = this.getStyle(property)
    if (val.startsWith('#')) {
      return val.repelace('#', '')
    }
    if (val.startsWith('rgb')) {
      // Strip rgba?
      const start = val.indexOf('(')
      const end = val.indexOf(')')

      const arr = val.slice(start + 1, end).split(',')
        .map((str) => {
          return Number.parseInt(str.trim())
        })

      // Make sure the alpha transparency number is in the array before converting.
      if (arr.length === 3) {
        arr.push(255)
      }

      val = color.rgbaToHex.apply(null, arr)
    }
    return val
  }

  readStyle () {
    // const e = this.selectedElement
    this.getStyleInt('padding-top')
    this.getStyleInt('padding-bottom')
    this.getStyleColor('background-color')
    this.getStyleColor('color')
  }

  setDefaultClassList (defaultClassList) {
    this.defaultClassList = defaultClassList
  }

  setItemType (itemType) {
    this.itemType = itemType
  }
}

Item.prototype.defaultClassList = null
Item.prototype.activeNode = null
Item.prototype.makeToolbarCallback = null
Item.prototype.toolbarNode = null
Item.prototype.sidebar = null

Item.prototype.listeners = {
  clone: []
}
