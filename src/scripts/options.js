import ext from "./utils/ext";
import storage from "./utils/storage";

var options = document.querySelector("#options");

const template = (data) => (`
  <a class="sign-item-link" href="${data.url}" title="${data.description}" target="_blank">
    <div class="sign-item">
      <div class="del-wrap" data-id="${data.id}"><div class="del-btn" data-id="${data.id}"></div></div>
      <div class="icon"><img src="${data.favIconUrl}" /></div>
      <div class="title"><p>${data.title}</p></div>
    </div>
  </a>
`)

function getSign() {
  storage.get('sign', function(result) {
    console.log('get sign: ', (result.sign))
    if (result && result.sign) {
      const sign = (typeof result.sign === 'string') ? JSON.parse(result.sign) : result.sign
      const tmpl = sign.map(m => template(m))
      
      options.innerHTML = tmpl.join('')
      addElementEvents()
    }
  })
}

function handleToDelSign(e) {
  console.log('handleToDelSign: ', e.target.getAttribute('data-id'))
  e.preventDefault()
  const id = e.target.getAttribute('data-id')

  storage.get('sign', function(result) {
    console.log('sign: ', result)
    if (result && result.sign) {
      const sign = (typeof result.sign === 'string') ? JSON.parse(result.sign) : result.sign
      const findIndex = sign.findIndex(m => m.id === id)
      console.log('findindex: ', findIndex)
      sign.splice(findIndex, 1)
      console.log('sign: ', sign)
      storage.set({ sign: sign }, function() {
        getSign()
      })
    }
  })
}

function addElementEvents() {
  document.querySelectorAll('.del-wrap')
    .forEach(elm => {
      elm.addEventListener('click', handleToDelSign)
    })
}

getSign()
