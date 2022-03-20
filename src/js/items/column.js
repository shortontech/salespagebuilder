'use strict'
import Item from '../item.js'

const column = new Item(['pb-column'], null, 'column')
column.setMakeToolbarFunc(function () {
  console.log('Making toolbar for column item.')
})
export default column
