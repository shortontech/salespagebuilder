'use strict'
import '../scss/custom.scss'
import column from './items/column.js'
import row from './items/row.js'
import section from './items/section.js'
import element from './items/element.js'

import feather from 'feather-icons'
import {
  removeClassNamesFromElements,
  deleteElementsByClassNames
} from './helpers.js'
let mouseMoveHandle = null
const pageBuilder = {
  row: row,
  column: column,
  section: section,
  element: element
}
pageBuilder.getNarrowestActiveItem = function () {
  let items = ['element', 'row', 'section']

  items = items.filter(function (item) {
    return (pageBuilder[item].activeNode != null)
  })

  return items.shift()
}

pageBuilder.updateEditorBoxes = function () {
  const activeItem = pageBuilder.getNarrowestActiveItem()
  const classNamesToRemove = [
    'pb-element-selected',
    'pb-row-selected',
    'pb-section-selected'
  ]
  removeClassNamesFromElements(classNamesToRemove)
  const toolbarClassNames = [
    'pb-section-toolbar',
    'pb-row-toolbar',
    'pb-element-toolbar'
  ]
  deleteElementsByClassNames(toolbarClassNames)
  pageBuilder[activeItem].moveToolbar()
  pageBuilder[activeItem].setSelected()
}
// Wait for the last event to fire.
function mouseMoveCallback (e) {
  // Reset the time until the mouse move event can be called.
  mouseMoveHandle = null
  let section = null
  let row = null
  let col = null
  let ele = null
  let currentNode = e.target

  // Progress through the parent nodes.
  do {
    const keys = Object.keys(currentNode.classList)
    keys.forEach(function (key) {
      const val = currentNode.classList[key]
      switch (val) {
        case 'pb-section':
          section = currentNode
          break
        case 'pb-row':
          row = currentNode
          break
        case 'pb-column':
          col = currentNode
          break
        case 'pb-element':
          ele = currentNode
          break
      }
    })

    // Progress to next node.
    currentNode = currentNode.parentNode
  } while (currentNode !== document)
  const isValid = (section || row || col || ele)
  // Make sure the selected node has changed.
  if (!isValid) {
    return
  }
  let needsUpdate = false
  const success = function () {
    needsUpdate = true
  }

  // Change the nodes, and if successful, let us know.
  // console.log({section, row, col, ele})
  pageBuilder.section.changeNode(section, success)
  pageBuilder.row.changeNode(row, success)
  pageBuilder.column.changeNode(col, success)
  pageBuilder.element.changeNode(ele, success)
  if (needsUpdate) {
    pageBuilder.updateEditorBoxes()
  }
}
document.addEventListener('mousemove', function (e) {
  if (mouseMoveHandle !== null) {
    return
  }
  mouseMoveHandle = setTimeout(function () {
    mouseMoveCallback(e)
  }, 100)
})

window.pageBuilder = pageBuilder
window.feather = feather

window.addEventListener('load', function () {
  const itemTypes = ['section', 'row', 'column', 'element']
  const editorArr = Object.values(document.getElementsByClassName('pb-editor'))
  const editorEle = editorArr.pop()

  itemTypes.forEach(function (itemType) {
    const sidebar = pageBuilder[itemType].getSidebar()
    editorEle.appendChild(sidebar.getElement())
  })

  // DEBUG CODE: Show the sidebar
  const rows = Object.values(document.getElementsByClassName('pb-row'))
  const rowIndex = Math.floor(Math.random() * rows.length)
  const selectedRow = rows[rowIndex]
  pageBuilder.row.editElement(selectedRow)
  pageBuilder.row.readStyle()
  // Test code.
})
