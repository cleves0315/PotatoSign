const menuTypes = [
  'sign',
  'folder'
]

class DropdownMenu {
  constructor() {
    this.ACTION = {
      DELETE: 0, // 删除
      RENAME: 1, // 重命名
      MOVETO: 2 // 移动
    }
    this.menuList = [] // 展示列表
    this.sign = [
      { action: this.ACTION['RENAME'], text: '重命名' },
      { action: this.ACTION['MOVETO'], text: '移动' },
      { action: this.ACTION['DELETE'], text: '删除' }
    ]
    this.folder = [
      { action: this.ACTION['RENAME'], text: '重命名' }
    ]

    document.body.addEventListener('click', (e) => {
      e.preventDefault()
      this.hide()
    })
    document.body.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      let target = e.target
      const { clientX, clientY } = e

      while ((target.tagName !== 'BODY') && !target.dataset['dropdownType']) {
        target = target.parentNode
      }

      const { dropdownType } = target.dataset

      if (menuTypes.includes(dropdownType)) {
        this.menuList = this[dropdownType]
        this.show(clientX, clientY, dropdownType)
      } else {
        this.hide()
      }
    })

    this.mount()
    this.mentElm = document.querySelector('.dropdown-menu')
  }

  menuListTmpl() {
    return (
      this.menuList.map(m => (
        m.action !== this.ACTION['DELETE'] ? (
          `<li class="dropdown-menu-item" data-action="${m.action}">${m.text}</li>`
        ) : (
          `<li class="dropdown-menu-divider"></li>
          <li class="dropdown-menu-item dropdown-menu-danger" data-action="${m.action}">${m.text}</li>`
        )
      )).join('')
    )
  }
  
  
  addDrodownEvents(fn) {
    document.querySelector('.dropdown-menu-root')
      .addEventListener('click', fn)
  }
  
  show(x, y) {
    const menu = this.mentElm
    menu.style.display = 'block'
    this.mentElm.querySelector('.dropdown-menu-root')
      .innerHTML = this.menuListTmpl()
    
    let left, top = 0
    const { innerWidth, innerHeight } = window
    const { offsetWidth, offsetHeight } = menu
  
    if ((x + offsetWidth) > innerWidth) {
      left = x - offsetWidth
    } else {
      left = x
    }
  
    if ((y + offsetHeight) > innerHeight) {
      top = y - offsetHeight
    } else {
      top = y
    }
  
    menu.style.top = `${top}px`
    menu.style.left = `${left}px`
  }

  hide() {
    const menu = this.mentElm
    menu.style.display = 'none'
  }
  
  mount() {
    const dropdownMenu = document.createElement('div')
    dropdownMenu.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; width: 100%;">
        <div>
          <div class="dropdown-menu" style="top: 300px; left: 600px; display: none;">
            <ul class="dropdown-menu-root"></ul>
          </div>
        </div>
      </div>
    `
  
    document.body.appendChild(dropdownMenu)
  }
}

export default new DropdownMenu()
