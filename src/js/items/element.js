'use strict'
import Item from '../item.js'
import ElementCreator from '../helpers/element-creator.js'
import { createIcon } from '../helpers.js'
const element = new Item(['pb-element'], 'pb-element-selected', 'element')

// (defaultClassList, selectedClass, itemType)
element.setDefaultClassList(['pb-element'])
element.setItemType('element')

element.setMakeToolbarFunc(function () {
  return (new ElementCreator())
    .class('pb-element-toolbar')
    .children([
      createIcon('fa-solid fa-trash-can', 'pb-element-clone pb-element-button', element.remove.bind(element)),
      createIcon('fa-solid fa-clone', 'pb-element-clone pb-element-button', element.clone.bind(element)),
      // createIcon('fa-solid fa-angle-up', 'pb-element-clone pb-element-button', element.clone.bind(element)),
      // createIcon('fa-solid fa-angle-down', 'pb-element-clone pb-element-button', element.clone.bind(element)),
      createIcon('fa-solid fa-gear', 'pb-element-clone pb-element-button', element.clone.bind(element))
    ])
    .get()
})
export default element
