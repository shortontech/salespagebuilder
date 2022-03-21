export function removeClassNamesFromElements (classNames) {
  getElementsByClassNames(classNames).forEach(function (ele) {
    classNames.forEach(function (className) {
      if (ele.classList.contains(className)) {
        ele.classList.remove(className)
      }
    })
  })
}
export function deleteElementsByClassNames (classNames) {
  getElementsByClassNames(classNames).forEach(function (ele) {
    ele.parentNode.removeChild(ele)
  })
}

export function getAllNodes (startNode) {
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
      let children = collectionToArray(node.children)
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
export function collectionToArray (collection) {
  const keys = Object.keys(collection)
  return keys.map(function (key) {
    return collection[key]
  })
}
// TODO (and forget to do): Instead of deleting IDs, regenerate them.
export function cloneItem (node) {
  console.log('clone item called.')
  const newNode = node.cloneNode(true)
  const childNodes = getAllNodes(newNode)
  childNodes.forEach(function (node) {
    let removeNode = false
    const classList = collectionToArray(node.classList)
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
export function getElementsByClassNames (classNames) {
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
export class DivCreator {
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
export function createIcon (iconClassStr, classStr, clickEvt) {
  // <i class="fa-solid fa-trash-can"></i>
  const btn = document.createElement('div')
  const classNames = classStr.split(' ')
  classNames.forEach(function (className) {
    btn.classList.add(className)
  })
  const icon = document.createElement('i')
  const iconClassNames = iconClassStr.split(' ')
  iconClassNames.forEach(function (className) {
    icon.classList.add(className)
  })
  btn.appendChild(icon)
  return btn
}
/**
 * Converts Numbers representing RGBA or RGB to a hex code.
 * Not including the octothorpe
 * @returns String The hex code for the color
 */
export function rgbaToHex () {
  return Object.values(arguments).map(function (arg) {
    return arg.toString(16).padStart(2, '0')
  })
    .join('')
    .padEnd(8, 'FF')
}

/**
 * Converts an RGB or RGBA hex string to a series of RGBA numbers.
 * Not including the octothorpe.
 * @param String str
 * @returns Number[]
 */
export function hexToRgba (str) {
  const arr = []
  for (let i = 0; i < 8; i += 2) {
    arr.push((str) ? Number.parseInt(str.substr(i, 2).padStart(1, '0'), 16) : 255)
  }

  return arr
}
/**
 * Converts values for hue, saturation, lightness, and alpha transparency into an Array of Numbers
 * representing a color.
 * @param Number h The hue
 * @param Number s The saturation
 * @param Number l The lightness
 * @param Number a The alpha transparency
 * @returns Number[]
 */
export function HslToRgba (h, s, l, a) {
  const c = (1 - Math.abs((2 * l) - 1)) * s
  h *= 6
  const m = l - (c / 2)
  const x = c * (1 - Math.abs(h % 2 - 1))
  if (!a) {
    a = 255
  }
  switch (Math.floor(h)) {
    case 0:
      return [c + m, x + m, 0 + m, a]
    case 1:
      return [x + m, c + m, 0 + m, a]
    case 2:
      return [0 + m, c + m, x + m, a]
    case 3:
      return [0 + m, x + m, c + m, a]
    case 4:
      return [x + m, 0 + m, c + m, a]
    case 5:
      return [c + m, 0 + m, x + m, a]
  }
}
export function generateColors (canvas, h) {
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const imageData = ctx.createImageData(width, height)

  const maxP = imageData.data.length / 4
  for (let p = 0; p < maxP; p++) {
    const x = p % width
    const y = p / width
    const s = 1 - (x / width)
    const l = 1 - (y / height)

    const vals = HslToRgba(h, s, l, 255)
    const i = p * 4
    imageData.data[i] = Math.floor(vals[0] * 256)
    imageData.data[i + 1] = Math.floor(vals[1] * 256)
    imageData.data[i + 2] = Math.floor(vals[2] * 256)
    imageData.data[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}
