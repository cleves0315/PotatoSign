import { nanoid } from "nanoid";
import DropdownMenu from './layout/dropdown-menu'
import { signTmpl } from "./utils/mixin";
import { getSignAndMapSync, setSignSync, getFIdAsync, setFIdAsync, getStorageAsync, setStorageSync } from "./utils/utils";

const dropdownMenu = new DropdownMenu()
dropdownMenu.onClick(handleToClickMenu)
var options = document.querySelector("#options");
var menuList = document.querySelector("#menu-list");

const template = (data) => (`
  <a class="sign-item-link" href="${data.url}" title="${data.description}" target="_blank">
    <div class="sign-item" data-id="${data.id}" data-dropdown-type="sign">
      <div class="del-wrap" data-id="${data.id}"><div class="del-btn" data-id="${data.id}"></div></div>
      <div class="icon"><img src="${data.favIconUrl}" /></div>
      <div class="title" data-type="text"><p title="${data.title}">${data.title}</p></div>
      <div class="title" data-type="input" style="display: none;"><input data-id="${data.id}" value="${data.title}" /></div>
    </div>
  </a>
`)

const footItemTemplate = (data, folderId) => (`
  <div class="menu-item ${data.id === folderId ? 'menu-active-item':''}" data-dropdown-type="folder" data-id="${data.id}">
    ${data.id === '001' ? '默认收藏夹' : data.name}
  </div>
`)

const footAddItemTmpl = `
  <div class="menu-item" data-type="add">
    <svg t="1636131075814" class="icon" data-type="add" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2410" width="64" height="64"><path d="M874.666667 469.333333H554.666667V149.333333c0-23.466667-19.2-42.666667-42.666667-42.666666s-42.666667 19.2-42.666667 42.666666v320H149.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667s19.2 42.666667 42.666666 42.666667h320v320c0 23.466667 19.2 42.666667 42.666667 42.666666s42.666667-19.2 42.666667-42.666666V554.666667h320c23.466667 0 42.666667-19.2 42.666666-42.666667s-19.2-42.666667-42.666666-42.666667z" p-id="2411" fill="#ffffff"></path></svg>
  </div>
`

const footItemEmptyTmpl = `
  <div class="menu-item menu-active-item"><input id="addItem" type="text"></div>
`

/**
 * 根据当前floderId渲染数据格式里list的数据列表
 * @param {string} folderId
 */
async function renderSigns(folderId = '001') {
  const { sign, signMap } = await getStorageAsync(['sign', 'signMap'])
  setFIdAsync(folderId)

  try {
    const index = signMap[folderId]
    const footItemTmpl = sign.map((m) => footItemTemplate(m, folderId))
    menuList.innerHTML = footItemTmpl.join('') + footAddItemTmpl

    const tmpl = sign[index].list.map(template)
    options.innerHTML = tmpl.join('')
    addElementEvents()
  } catch (error) {
    console.error('renderSigns to innerHTML \n', error)
  }
}

/**
 * 删除当前folder的对应id的标签 并重新渲染
 * @method
 */
async function toDelSign(id) {
  console.log('toDelSign')
  const folderId = await getFIdAsync()
  const { sign, signMap } = await getSignAndMapSync()

  try {
    const index = signMap[folderId]
    const signList = sign[index].list
    const findIndex = signList.findIndex(m => m.id === id)

    signList.splice(findIndex, 1)

    await setSignSync(sign)
    renderSigns()
  } catch (error) {
    console.error('handleOnDelSign: \n', error)
  }
}

/**
 * 点击Sign删除按钮
 * @callback
 */
function handleOnDelSign(e) {
  e.preventDefault()
  const id = e.target.getAttribute('data-id')
  toDelSign(id)
}

function handleToEdit(e) {
  e.preventDefault()
  console.log(e)
  this.parentNode.style['display'] = 'none'
  this.parentNode.nextElementSibling.style['display'] = 'block'
  this.parentNode.nextElementSibling.querySelector('input').focus()
}

function handleToEnterInput(e) {
  const cancelKeys = [13, 27]
  if (cancelKeys.includes(e.keyCode)) {
    handleToCancelEdit(e)
  }
}

async function handleToCancelEdit(e) {
  const value = e.target.value
  const id = e.target.getAttribute('data-id')
  
  const folderId = await getFIdAsync()
  const { sign, signMap } = await getSignAndMapSync()

  try {
    const index = signMap[folderId]
    const signList = sign[index].list
    const findIndex = signList.findIndex(m => m.id === id)

    signList[findIndex].title = value
    
    await setSignSync(sign)
    renderSigns()
  } catch (error) {
    console.error('CancelEdit: \n', error)
  }
}

function menuItemInputFocus() {
  menuList.querySelector('#addItem').focus()
}
function handleToAddItemCancelEdit() {
  const addFolderElm = menuList.querySelector('#addItem')
  
  addFolderElm.addEventListener('keydown', (e) => {
    const { keyCode, target: {value} } = e
    if (keyCode === 13) {
      addFolder(value)
    }
  })
  addFolderElm.addEventListener('blur', (e) => addFolder(e.target.value))
}

async function addFolder(val) {
  console.log('addFolder')
  const value = val.trim()

  if (window.delayRunFunt) return
  window.delayRunFunt = true
  setTimeout(() => window.delayRunFunt = false, 300)

  if (value) {
    const { sign, signMap } = await getStorageAsync(['sign', 'signMap'])
    const addData = JSON.parse(JSON.stringify(signTmpl))
    addData.id = nanoid()
    addData.name = value
    // const addData = {
    //   ...signTmpl,
    //   id: nanoid(),
    //   name: value
    // }

    sign.push(addData)
    signMap[addData.id] = sign.length - 1
    setStorageSync({ sign, signMap, folderId: addData.id })

    const menuTmpl = menuList.innerHTML.replace('menu-active-item', '')
    menuList.innerHTML = menuTmpl.replace(footItemEmptyTmpl, footItemTemplate(addData, addData.id))
    addFootMenuListEvents()
  } else {
    menuList.innerHTML = menuList.innerHTML.replace(footItemEmptyTmpl, '')
    addFootMenuListEvents()
  }
}

async function handleToAddFolder() {
  menuList.innerHTML = menuList.innerHTML.replace(footAddItemTmpl, footItemEmptyTmpl + footAddItemTmpl)
  menuItemInputFocus()
  handleToAddItemCancelEdit()
  addFootMenuListEvents()
}

function handleToChoicefolder(e) {
  const { id } = e.target.dataset

  if (!id) return
  // setStorageSync({ folderId: id })

  renderSigns(id)
}

function handleToClickMenu(action, data) {
  const { DELETE, RENAME, MOVETO } = dropdownMenu.ACTIONS
  switch (+action) {
    case DELETE:
      toDelSign(data)
      break;
    case RENAME:
      
      break;
    case MOVETO:
      
      break;
  
    default:
      break;
  }
}


function addFootMenuListEvents() {
  menuList.querySelectorAll('.menu-item').forEach(elm => {
    const type = elm.getAttribute('data-type')

    if (type === 'folder') {
      elm.addEventListener('click', handleToChoicefolder)
    } else if (type === 'add') {
      elm.addEventListener('click', handleToAddFolder)
    }
  })

}

function addElementEvents() {
  document.querySelectorAll('.sign-item')
    .forEach(elm => {
      elm.querySelector('.del-wrap').addEventListener('click', handleOnDelSign)
      elm.querySelector('.title[data-type="text"]').querySelector('p').addEventListener('click', handleToEdit)
      elm.querySelector('.title[data-type="input"]').addEventListener('click', (e) => e.preventDefault())
      elm.querySelector('.title[data-type="input"]').querySelector('input').addEventListener('blur', handleToCancelEdit)
      elm.querySelector('.title[data-type="input"]').querySelector('input').addEventListener('keydown', handleToEnterInput)
    })

  addFootMenuListEvents()
}

renderSigns()
