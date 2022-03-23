'use strict'
import Item from '../item.js'
import { createIcon } from '../helpers.js'
import ElementCreator from '../helpers/element-creator.js'

const row = new Item()

row.setItemType('row')
row.setDefaultClassList(['pb-row', 'row'])

row.setMakeToolbarFunc(function () {
  return (new ElementCreator())
    .class('pb-row-toolbar')
    .children([
      createIcon('fa-solid fa-trash-can', 'pb-row-clone pb-row-button', row.remove.bind(row)),
      createIcon('fa-solid fa-clone', 'pb-row-clone pb-row-button', row.clone.bind(row)),
      createIcon('fa-solid fa-angle-up', 'pb-row-clone pb-row-button', row.moveUp.bind(row)),
      createIcon('fa-solid fa-angle-down', 'pb-row-clone pb-row-button', row.moveDown.bind(row)),
      createIcon('fa-solid fa-gear', 'pb-row-clone pb-row-button', row.clone.bind(row))
    ])
    .get()
})

export default row
