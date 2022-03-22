'use strict'
import Item from '../item.js'
import { createIcon } from '../helpers.js'
import ElementCreator from '../helpers/element-creator.js'

const section = new Item(['container', 'pb-section'], 'pb-section-selected', 'section')
section.setMakeToolbarFunc(function () {
  return (new ElementCreator())
    .class('pb-section-toolbar')
    .children([
      createIcon('fa-solid fa-angle-up', 'pb-section-move-up pb-section-button', section.clone.bind(section)),
      createIcon('fa-solid fa-angle-down', 'pb-section-move-down pb-section-button', section.clone.bind(section)),
      createIcon('fa-solid fa-trash-can', 'pb-section-remove pb-section-button', section.clone.bind(section)),
      createIcon('fa-solid fa-clone', 'pb-section-clone pb-section-button', section.clone.bind(section)),
      createIcon('fa-solid fa-gear', 'pb-section-settings pb-section-button', section.clone.bind(section))
    ])
    .get()
})

export default section
