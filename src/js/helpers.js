export function createIcon (iconClassStr, classStr, clickEvt) {
  // <i class="fa-solid fa-trash-can"></i>
  const btn = document.createElement('div')
  btn.addEventListener('click', clickEvt)
  const classNames = classStr.split(' ')
  classNames.forEach((className) => {
    btn.classList.add(className)
  })
  const icon = document.createElement('i')
  const iconClassNames = iconClassStr.split(' ')
  iconClassNames.forEach((className) => {
    icon.classList.add(className)
  })
  btn.appendChild(icon)
  return btn
}