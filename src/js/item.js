'use strict'
import { cloneItem } from './helpers.js'
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

  setSelected () {
    if (this.selectedClass) {
      this.addClass(this.selectedClass)
    }
  }

  clone () {
    this.activeNode.parentNode.insertBefore(cloneItem(this.activeNode), this.activeNode)
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

  constructor (defaultClassList, selectedClass) {
    // vars
    this.activeNode = null
    this.defaultClassList = defaultClassList
    this.selectedClass = selectedClass
    this.makeToolbarCallback = null
    this.toolbarNode = null

    // functions
    this.addClasses = this.addClasses.bind(this)
    this.addClass = this.addClass.bind(this)
    this.make = this.make.bind(this)
    this.changeNode = this.changeNode.bind(this)
  }
}
