const dom = {}

dom.deleteElementsByClassNames = (classNames) => {
  dom.getElementsByClassNames(classNames).forEach((ele) => {
    ele.parentNode.removeChild(ele)
  })
}

dom.removeClassNamesFromElements = (classNames) => {
  dom.getElementsByClassNames(classNames).forEach((ele) => {
    classNames.forEach((className) => {
      if (ele.classList.contains(className)) {
        ele.classList.remove(className)
      }
    })
  })
}
dom.getAllNodes = (startNode) => {
  let nodes = [startNode]
  // These are nodes where all children have been added to nodes.
  const processedNodes = []

  // When this number is zero, it means no children were added.
  let totalAdded = 0

  do {
    // Reset the counter, so we can check if children are added.
    totalAdded = 0
    const unprocessed = nodes.filter((child) => {
      return (processedNodes.indexOf(child) === -1)
    })
    unprocessed.forEach((node) => {
      // Count the total number of nodes added,
      // so we know if the node we're looking at has been fully processed.
      let total = 0

      // Convert the collection to an array.
      let children = Object.values(node.children)
      children = children.filter((child) => {
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
dom.clone = (node) => {
  const newNode = node.cloneNode(true)
  const childNodes = dom.getAllNodes(newNode)
  childNodes.forEach((node) => {
    let removeNode = false
    const classList = Object.values(node.classList)
    classList.forEach((className) => {
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

dom.getElementsByClassNames = (classNames) => {
  const results = []
  classNames.forEach((className) => {
    const elements = document.getElementsByClassName(className)
    if (elements.length) {
      const keys = Object.keys(elements)
      keys.forEach((key) => {
        results.push(elements[key])
      })
    }
  })
  return results
}
dom.removeClassNamesFromElements = (classNames) => {
  dom.getElementsByClassNames(classNames).forEach((ele) => {
    classNames.forEach((className) => {
      if (ele.classList.contains(className)) {
        ele.classList.remove(className)
      }
    })
  })
}

export default dom
