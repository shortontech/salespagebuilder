export default class ElementCreator {
  class (className) {
    this.node.classList.add(className)
    return this
  }

  classes (classNames) {
    classNames.forEach(function (className) {
      this.node.classList.add(className)
    }.bind(this))
    return this
  }

  text (text) {
    const textNode = document.createTextNode(text)
    this.node.appendChild(textNode)
    return this
  }

  children (children) {
    children.forEach(function (child) {
      this.node.appendChild(child)
    }.bind(this))
    return this
  }

  click (f) {
    this.node.addEventListener('click', f.bind(this))
    return this
  }

  html (h) {
    this.node.innerHTML = h
    return this
  }

  get () {
    return this.node
  }

  constructor () {
    this.node = document.createElement('div')
  }
}
