'use strict'
import Item from '../item.js'
import { DivCreator, createIcon } from '../helpers.js'
import Slider from '../tools/slider.js'

const row = new Item(['pb-row', 'row'], 'pb-row-selected', 'row')

row.setMakeToolbarFunc(function () {
  return (new DivCreator())
    .class('pb-row-toolbar')
    .children([
      createIcon('fa-solid fa-trash-can', 'pb-row-clone pb-row-button', row.clone.bind(row)),
      createIcon('fa-solid fa-clone', 'pb-row-clone pb-row-button', row.clone.bind(row)),
      createIcon('fa-solid fa-angle-up', 'pb-row-clone pb-row-button', row.clone.bind(row)),
      createIcon('fa-solid fa-angle-down', 'pb-row-clone pb-row-button', row.clone.bind(row)),
      createIcon('fa-solid fa-gear', 'pb-row-clone pb-row-button', row.clone.bind(row))
    ])
    .get()
})

row.sidebar.addEventListener('createWidgets', function () {
  const sidebar = this
  const options = sidebar.getStyleOptions()
  const indexes = Object.keys(options)
  indexes.forEach(function (index) {
    const settings = options[index]
    const widget = new Slider(settings)
    sidebar.addWidget(widget)
  })
  // const topMarginSlider = new Slider('Top Margin', 'top-margin', 0, 200, 10)
  // sidebar.addWidget(topMarginSlider)
})
export default row
