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
