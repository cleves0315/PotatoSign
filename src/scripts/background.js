import { nanoid } from "nanoid";
import ext from "./utils/ext";
import storage from "./utils/storage";

// storage.clear()

function initSign() {
  console.log('storage: ', storage)
  storage.get(['sign', 'signMap'], function(data) {
    console.log('init-sign: ', data)
    const { sign, signMap } = data
    const signValue = [
      {
        id: '001',
        name: '默认书签',
        list: [],
        type: 'folder'
      }
    ]
    const signMapValue = {
      '001': 0
    }

    if (!sign || (Array.isArray(sign) && sign.length === 0)) {
      storage.set({
        sign: JSON.stringify(signValue)
      })
    }
    
    if (!signMap || (JSON.stringify(signMap) === '{}')) {
      storage.set({
        signMap: JSON.stringify(signMapValue)
      })
    }
  })
}

function judgeToRepeat(list, data) {
  let isRepeat = false

  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    if (s.url === data.url) {
      isRepeat = true
      break
    }
  }

  return isRepeat
}

ext.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action === "perform-save") {
      console.log("Extension Type: ", "/* @echo extension */");
      console.log("PERFORM AJAX", JSON.parse(request.data));

      if (request.data) {
        storage.get(['sign'], function (data) {
          const { sign: signJson } = data
          const sign = (typeof signJson === 'string') ? JSON.parse(signJson) : signJson
          const reqData = (typeof request.data === 'string') ? JSON.parse(request.data) : request.data

          if (Array.isArray(sign) && sign.length > 0) {
            const isRepeat = judgeToRepeat(sign[0].list, reqData)
            if (isRepeat) return

            reqData.id = nanoid()
            sign[0].list.push(reqData)

            storage.set({
              sign: JSON.stringify(sign)
            })
          } else {
            initSign()
          }

          // if (data && JSON.stringify(data) !== '{}') {
          //   const sign = (typeof data.sign === 'string') ? JSON.parse(data.sign) : data.sign
          //   const reqData = (typeof request.data === 'string') ? JSON.parse(request.data) : request.data
          //   const isRepeat = judgeToRepeat(sign, reqData)

          //   if (isRepeat) return

          //   sign.push(Object.assign({ id: nanoid() }, reqData))
          //   storage.set({ sign: JSON.stringify(sign) })
          // } else {
          //   const reqData = (typeof request.data === 'string') ? JSON.parse(request.data) : request.data
          //   const setData = Object.assign({ id: nanoid() }, reqData)

          //   storage.set({ sign: JSON.stringify(Array(setData)) })
          // }
        })

        sendResponse({ action: "saved" });
      }

    }
  }
);

initSign()
