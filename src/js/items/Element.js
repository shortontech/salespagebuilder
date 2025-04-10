'use strict'
import Item from '../Item.js'
import {ElementCreator, createIcon} from '../helpers'

const element = new Item(['pb-element'], 'pb-element-selected', 'element')

// (defaultClassList, selectedClass, itemType)
element.setDefaultClassList(['pb-element'])
element.setItemType('element')

element.setMakeToolbarFunc(() => {
  return (new ElementCreator())
    .class('pb-element-toolbar')
    .children([
      createIcon('fa-solid fa-trash-can', 'pb-element-delete pb-element-button', element.remove.bind(element)),
      createIcon('fa-solid fa-clone', 'pb-element-clone pb-element-button', element.clone.bind(element)),
      // createIcon('fa-solid fa-angle-up', 'pb-element-clone pb-element-button', element.clone.bind(element)),
      // createIcon('fa-solid fa-angle-down', 'pb-element-clone pb-element-button', element.clone.bind(element)),
      createIcon('fa-solid fa-gear', 'pb-element-edit pb-element-button', element.edit.bind(element))
    ])
    .get()
})
export default element
