import ext from "./utils/ext";
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

function getSign(id = '001') {
  storage.get(['sign', 'signMap'], function(result) {
    console.log('get sign: ', (result))
    const { sign: signJson, signMap: signMapJson } = result
    const sign = (typeof signJson === 'string') ? JSON.parse(signJson) : signJson
    const signMap = (typeof signMapJson === 'string') ? JSON.parse(signMapJson) : signMapJson

    if (Array.isArray(sign) && signMap
      && (sign.length > 0) && (JSON.stringify(signMap) !== '{}')) {
      const index = signMap[id]
      const tmpl = sign[index].list.map(m => template(m))
      
      options.innerHTML = tmpl.join('')
      addElementEvents()
    }

    // if (result && result.sign) {
    //   const sign = (typeof result.sign === 'string') ? JSON.parse(result.sign) : result.sign
    //   const tmpl = sign.map(m => template(m))
      
    //   options.innerHTML = tmpl.join('')
    //   addElementEvents()
    // }
    
  })
}

function handleToDelSign(e) {
  e.preventDefault()
  const id = e.target.getAttribute('data-id')

  storage.get('sign', function(result) {
    if (result && result.sign) {
      const sign = (typeof result.sign === 'string') ? JSON.parse(result.sign) : result.sign
      const findIndex = sign.findIndex(m => m.id === id)
      sign.splice(findIndex, 1)
      storage.set({ sign: sign }, function() {
        getSign()
      })
    }
  })
}

function handleToEdit(e) {
  e.preventDefault()
  console.log(e)
  this.parentNode.style['display'] = 'none'
  this.parentNode.nextElementSibling.style['display'] = 'block'
  this.parentNode.nextElementSibling.querySelector('input').focus()
}

function handleToEnterInput(e) {
  if (e.keyCode === 13) {
    handleToCancelEdit(e)
  }
}

function handleToCancelEdit(e) {
  const value = e.target.value
  const id = e.target.getAttribute('data-id')

  storage.get('sign', function(result) {
    if (result && result.sign) {
      const sign = (typeof result.sign === 'string') ? JSON.parse(result.sign) : result.sign
      const findIndex = sign.findIndex(m => m.id === id)
      sign[findIndex].title = value
      storage.set({ sign: sign }, function() {
        getSign()
      })
    }
  })
}

function addElementEvents() {
  document.querySelectorAll('.sign-item')
    .forEach(elm => {
      elm.querySelector('.del-wrap').addEventListener('click', handleToDelSign)
      elm.querySelector('.title[data-type="text"]').querySelector('p').addEventListener('click', handleToEdit)
      elm.querySelector('.title[data-type="input"]').addEventListener('click', function(e) { e.preventDefault() })
      elm.querySelector('.title[data-type="input"]').querySelector('input').addEventListener('blur', handleToCancelEdit)
      elm.querySelector('.title[data-type="input"]').querySelector('input').addEventListener('keydown', handleToEnterInput)
    })
}

getSign()
