class DropdownMenu {
  constructor() {
    this.ACTION = {
      DELETE: 0, // 删除
      RENAME: 1, // 重命名
      MOVETO: 2 // 移动
    }

    this.actionList = [
      { action: this.ACTION['RENAME'], text: '重命名' },
      { action: this.ACTION['MOVETO'], text: '移动' },
      { action: this.ACTION['DELETE'], text: '删除' },
    ]
    
    this.template = `
      <div style="position: absolute; top: 0; left: 0; width: 100%;">
        <div>
          <div class="dropdown-menu" style="top: 300px; left: 600px; display: none;">
            <ul class="dropdown-menu-root">
              ${
                this.actionList.map(m => (
                  m.action !== this.ACTION['DELETE'] ? (
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

    document.body.addEventListener('click', (e) => {
      e.preventDefault()
    })
    
    document.body.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      const { clientX, clientY } = e
    
      this.show(clientX, clientY)
    })

    this.mount()
  }
  
  
  addDrodownEvents(fn) {
    document.querySelector('.dropdown-menu-root')
      .addEventListener('click', fn)
  }
  
  show(x, y) {
    const menu = document.querySelector('.dropdown-menu')
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
    menu.style.display = 'block'
  }
  
  mount() {
    const dropdownMenu = document.createElement('div')
    dropdownMenu.innerHTML = this.template
  
    document.body.appendChild(dropdownMenu)
  }
}

export default new DropdownMenu()
