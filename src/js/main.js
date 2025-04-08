'use strict'
import '../scss/custom.scss'
import column from './items/column.js'
import row from './items/row.js'
import section from './items/section.js'
import element from './items/element.js'
import dom from './helpers/dom.js'
import Sidebar from './tools/sidebar.js'

let mouseMoveHandle = null
const pageBuilder = {
  row: row,
  column: column,
  section: section,
  element: element
}
pageBuilder.getNarrowestActiveItem = () => {
  let items = ['element', 'row', 'section']

  items = items.filter((item) => {
    return (pageBuilder[item].activeNode != null)
  })

  return items.shift()
}

pageBuilder.updateEditorBoxes = () => {
  const activeItem = pageBuilder.getNarrowestActiveItem()
  const classNamesToRemove = [
    'pb-element-selected',
    'pb-row-selected',
    'pb-section-selected'
  ]
  const toolbarClassNames = [
    'pb-section-toolbar',
    'pb-row-toolbar',
    'pb-element-toolbar'
  ]

  dom.removeClassNamesFromElements(classNamesToRemove)
  dom.deleteElementsByClassNames(toolbarClassNames)
  pageBuilder[activeItem].moveToolbar()
  pageBuilder[activeItem].setSelected()
}
// Wait for the last event to fire.
let mouseMoveCallback = (e) => {
  // Reset the time until the mouse move event can be called.
  mouseMoveHandle = null
  let section = null
  let row = null
  let col = null
  let ele = null
  let currentNode = e.target

  // Progress through the parent nodes.
  do {
    Object.keys(currentNode.classList).forEach((key) =>{
      const val = currentNode.classList[key]
      switch (val) {
        case 'pb-section':
          section = currentNode
          break
        case 'row':
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
  const success = () => { needsUpdate = true }

  // Change the nodes, and if successful, let us know.
  pageBuilder.section.changeNode(section, success)
  pageBuilder.row.changeNode(row, success)
  pageBuilder.column.changeNode(col, success)
  pageBuilder.element.changeNode(ele, success)
  if (needsUpdate) {
    pageBuilder.updateEditorBoxes()
  }
}
document.addEventListener('mousemove', (e) => {
  if (mouseMoveHandle !== null) {
    return
  }
  mouseMoveHandle = setTimeout(() => {
    mouseMoveCallback(e)
  }, 100)
})

window.pageBuilder = pageBuilder

window.addEventListener('load', () => {
  const itemTypes = ['section', 'row', 'column', 'element']
  const editorArr = Object.values(document.getElementsByClassName('pb-editor'))
  const editorEle = editorArr.pop()

  itemTypes.forEach((itemType) => {
    const sidebar = new Sidebar()
    sidebar.setItemType(itemType)
    pageBuilder[itemType].setSidebar(sidebar)
    editorEle.appendChild(sidebar.getElement())
  })

  // DEBUG CODE: Show the sidebar
  const rows = Object.values(document.getElementsByClassName('row'))
  const rowIndex = Math.floor(Math.random() * rows.length)
  const selectedRow = rows[rowIndex]
  pageBuilder.row.edit(selectedRow)
  pageBuilder.row.readStyle()
  // Test code.
})
