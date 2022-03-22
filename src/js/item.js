'use strict'
// import { cloneItem, rgbaToHex } from './helpers.js'
import { rgbaToHex } from './helpers.js'
import dom from './helpers/dom.js'
import color from './helpers/color.js'
import { Sidebar } from './tools/sidebar.js'
export default class Item {
  changeNode (node, callback) {
    if (this.activeNode === node) {
      return
    }
    // Clean up the original node.
    if (this.selectedClass) {
      this.removeClass(this.selectedClass)
    }

    // Set the active node and add the selected class
    this.activeNode = node

    // Remove the class used to show whether this is selected.
    if (callback) {
      callback(this.activeNode)
    }
  }

  editElement (ele) {
    this.selectedElement = ele
    this.sidebar.editElement(this.selectedElement)
  }

  setSelected () {
    if (this.selectedClass) {
      this.addClass(this.selectedClass)
    }
  }

  clone () {
    this.activeNode.parentNode.insertBefore(dom.cloneItem(this.activeNode), this.activeNode)
    return this
  }

  remove () {
    console.log('Remove called.')
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

  setMakeToolbarFunc (callback) {
    this.makeToolbarCallback = callback
  }

  createSidebar (itemType) {
    this.sidebar = new Sidebar(itemType)
  }

  getSidebar () {
    return this.sidebar
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

    classList.forEach(function (className) {
      if (this.activeNode.classList.contains(className)) {
        this.activeNode.classList.remove(className)
      }
    }.bind(this))
  }

  addClasses (classList) {
    if (this.activeNode == null) {
      return this
    }

    classList.forEach(function (className) {
      if (!this.activeNode.classList.contains(className)) {
        this.activeNode.classList.add(className)
      }
    }.bind(this))
  }

  make () {
    console.log('make not built.')
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
        .map(function (str) {
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
    console.log('readstyle')
    this.getStyleInt('padding-top')
    this.getStyleInt('padding-bottom')
    this.getStyleColor('background-color')
    this.getStyleColor('color')
  }

  constructor (defaultClassList, selectedClass, itemType) {
    // vars
    this.activeNode = null
    this.defaultClassList = defaultClassList
    this.selectedClass = selectedClass
    this.makeToolbarCallback = null
    this.toolbarNode = null
    this.sidebar = null

    // functions
    this.addClasses = this.addClasses.bind(this)
    this.addClass = this.addClass.bind(this)
    this.make = this.make.bind(this)
    this.changeNode = this.changeNode.bind(this)

    this.createSidebar(itemType)
  }
}
