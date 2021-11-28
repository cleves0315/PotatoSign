const ACTION = {
  DELETE: 0, // 删除
  RENAME: 1, // 重命名
  MOVETO: 2 // 移动
}

const actionList = [
  { action: ACTION['RENAME'], text: '重命名' },
  { action: ACTION['MOVETO'], text: '移动' },
  { action: ACTION['DELETE'], text: '删除' },
]


const template = `
  <div style="position: absolute; top: 0; left: 0; width: 100%;">
    <div>
      <div class="dropdown-menu" style="top: 300px; left: 600px;">
        <ul class="dropdown-menu-root">
          ${
            actionList.map(m => (
              m.action !== ACTION['DELETE'] ? (
                `<li class="dropdown-menu-item" data-action="${m.action}">${m.text}</li>`
              ) : (
                `<li class="dropdown-menu-divider"></li>
                <li class="dropdown-menu-item dropdown-menu-danger" data-action="${m.action}">${m.text}</li>`
              )
            )).join('')
          }
        </ul>
      </div>
    </div>
  </div>
`

function addDrodownEvents(fn) {
  document.querySelector('.dropdown-menu-root')
    .addEventListener('click', fn)
}

function render() {
  const dropdownMenu = document.createElement('div')
  dropdownMenu.innerHTML = template

  document.body.appendChild(dropdownMenu)
}

document.body.addEventListener('contextmenu', function(e) {
  e.preventDefault()
  console.log('e: ', e.target.parentNode)
})

render()

export {
  ACTION,
  addDrodownEvents
}
