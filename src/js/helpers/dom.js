const dom = {}

dom.deleteElementsByClassNames = function (classNames) {
  dom.getElementsByClassNames(classNames).forEach(function (ele) {
    ele.parentNode.removeChild(ele)
  })
}

dom.removeClassNamesFromElements = function (classNames) {
  dom.getElementsByClassNames(classNames).forEach(function (ele) {
    classNames.forEach(function (className) {
      if (ele.classList.contains(className)) {
        ele.classList.remove(className)
      }
    })
  })
}
dom.getAllNodes = function (startNode) {
  let nodes = [startNode]
  // These are nodes where all children have been added to nodes.
  const processedNodes = []

  // When this number is zero, it means no children were added.
  let totalAdded = 0

  do {
    // Reset the counter, so we can check if children are added.
    totalAdded = 0
    const unprocessed = nodes.filter(function (child) {
      return (processedNodes.indexOf(child) === -1)
    })
    unprocessed.forEach(function (node) {
      // Count the total number of nodes added,
      // so we know if the node we're looking at has been fully processed.
      let total = 0

      // Convert the collection to an array.
      let children = Object.values(node.children)
      children = children.filter(function (child) {
        return (nodes.indexOf(child) === -1)
      })

      total += children.length

      // Merge all child nodes into the nodes array.
      nodes = nodes.concat(children)

      if (total === 0) {
        processedNodes.push(node)
      } else {
        totalAdded += total
      }
    })
  } while (totalAdded !== 0)
  return nodes
}
// TODO (and forget to do): Instead of deleting IDs, regenerate them.
dom.clone = function (node) {
  const newNode = node.cloneNode(true)
  const childNodes = dom.getAllNodes(newNode)
  childNodes.forEach(function (node) {
    let removeNode = false
    const classList = Object.values(node.classList)
    classList.forEach(function (className) {
      if (className.match(/pb-[a-z]+-toolbar/) !== null) {
        removeNode = true
      }
    })
    if (removeNode) {
      node.parentNode.removeChild(node)
      return
    }
    if (node.hasAttribute('id')) {
      node.removeAttribute('id')
    }
  })
  return newNode
}

dom.getElementsByClassNames = function (classNames) {
  const results = []
  classNames.forEach(function (className) {
    const elements = document.getElementsByClassName(className)
    if (elements.length) {
      const keys = Object.keys(elements)
      keys.forEach(function (key) {
        results.push(elements[key])
      })
    }
  })
  return results
}
dom.removeClassNamesFromElements = function (classNames) {
  dom.getElementsByClassNames(classNames).forEach(function (ele) {
    classNames.forEach(function (className) {
      if (ele.classList.contains(className)) {
        ele.classList.remove(className)
      }
    })
  })
}

export default dom
