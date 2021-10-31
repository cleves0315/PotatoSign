import ext from "./utils/ext";
import storage from "./utils/storage";

// storage.clear()

function judgeToRepeat(sign, data) {
  let isRepeat = false

  for (let i = 0; i < sign.length; i++) {
    const s = sign[i];
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
        storage.get('sign', function (data) {
          if (data && JSON.stringify(data) !== '{}') {            
            const sign = (typeof data.sign === 'string') ? JSON.parse(data.sign) : data.sign
            const reqData = (typeof request.data === 'string') ? JSON.parse(request.data) : request.data
            const isRepeat = judgeToRepeat(sign, reqData)

            if (isRepeat) return

            sign.push(reqData)
            storage.set({ sign: JSON.stringify(sign) })
          } else {
            const reqData = (typeof request.data === 'string') ? JSON.parse(request.data) : request.data
            storage.set({ sign: JSON.stringify(Array(reqData)) })
          }
        })

        sendResponse({ action: "saved" });
      }

    }
  }
);