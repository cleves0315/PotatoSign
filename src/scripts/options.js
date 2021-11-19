import { getSignAndMapSync, setSignSync, getFIdAsync, setFIdAsync } from "./utils/utils";
import storage from "./utils/storage";

var options = document.querySelector("#options");

const template = (data) => (`
  <a class="sign-item-link" href="${data.url}" title="${data.description}" target="_blank">
    <div class="sign-item">
      <div class="del-wrap" data-id="${data.id}"><div class="del-btn" data-id="${data.id}"></div></div>
      <div class="icon"><img src="${data.favIconUrl}" /></div>
      <div class="title" data-type="text"><p title="${data.title}">${data.title}</p></div>
      <div class="title" data-type="input" style="display: none;"><input data-id="${data.id}" value="${data.title}" /></div>
    </div>
  </a>
`)

/**
 * 
 * @param {string} folderId
 */
async function renderSigns(folderId = '001') {
  const { sign, signMap } = await getSignAndMapSync()
  setFIdAsync(folderId)

  try {
    const index = signMap[folderId]
    const tmpl = sign[index].list.map(template)
    options.innerHTML = tmpl.join('')
    addElementEvents()
  } catch (error) {
    console.error('renderSigns to innerHTML \n', error)
  }
}

async function handleToDelSign(e) {
  e.preventDefault()
  const id = e.target.getAttribute('data-id')
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
    console.error('handleToDelSign: \n', error)
  }
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

function addElementEvents() {
  document.querySelectorAll('.sign-item')
    .forEach(elm => {
      elm.querySelector('.del-wrap').addEventListener('click', handleToDelSign)
      elm.querySelector('.title[data-type="text"]').querySelector('p').addEventListener('click', handleToEdit)
      elm.querySelector('.title[data-type="input"]').addEventListener('click', (e) => e.preventDefault())
      elm.querySelector('.title[data-type="input"]').querySelector('input').addEventListener('blur', handleToCancelEdit)
      elm.querySelector('.title[data-type="input"]').querySelector('input').addEventListener('keydown', handleToEnterInput)
    })
}

renderSigns()
