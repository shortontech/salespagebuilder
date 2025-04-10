/**
 * Creates a font awesome icon.
 * @param {Str} iconClassStr 
 * @param {String} classStr
 * @param {function(PointerEvent)} clickEvt 
 * @returns 
 */
export default function createIcon (iconClassStr, classStr, clickEvt) {
  const btn = document.createElement('div')
  const classNames = classStr.split(' ')
  classNames.forEach((className) => {
    btn.classList.add(className)
  })

  // Add the icon class to the icon element
  const icon = document.createElement('i')
  const iconClassNames = iconClassStr.split(' ')
  // Add all classes
  iconClassNames.forEach((className) => {
    icon.classList.add(className)
  })

  // Change the target of the click to the parent element of the icon
  icon.addEventListener('click', function(evt) {
    evt.target = btn.parentElement
    clickEvt(evt)
  })
  btn.appendChild(icon)
  return btn
}