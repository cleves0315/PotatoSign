import { storage } from "./storage";

/**
 * @param {string} json
 * @returns
 */
function JSONToParse(json) {
  return (typeof json === 'string') ? JSON.parse(json) : json
}

/**
 * @param {string} json
 * @returns JSONString
 */
function JSONToStringify(json) {
  return (typeof json === 'string') ? json : JSON.stringify(json)
}

/**
 * 
 * @param {array} list 
 * @param {object} data 
 * @returns boolean
 */
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

/**
 * 
 * @param {string | string[]} params 
 */
async function getStorageAsync(params) {
  return new Promise((resolve) => {
    storage.get(params, function(result) {
      const resultData = {}
      const payload = (typeof params === 'string') ? [params] : params

      payload.forEach(key => {
        resultData[key] = JSONToParse(result[key])
      })

      resolve(resultData)
    })
  })
}

/**
 * 
 * @param {object} params 
 */
async function setStorageSync(params) {
  return new Promise((resolve) => {
    const payload = {}
    const keys = Object.getOwnPropertyNames(params)

    keys.forEach(key => {
      payload[key] = JSONToStringify(params[key])
    })

    storage.set(payload, resolve)
  })
}

async function getSignSync() {
  return new Promise((resolve) => {
    storage.get('sign', function(result) {
      const { sign: signJson } = result
      const sign = JSONToParse(signJson) || []

      resolve(sign)
    })
  })
}

async function getSignMapSync() {
  return new Promise((resolve) => {
    storage.get('sign', function(result) {
      const { signMap: signMapJson } = result
      const signMap = JSONToParse(signMapJson) || {}

      resolve(signMap)
    })
  })
}

/**
 * 
 * @returns {object} { sign, signMap }
 */
async function getSignAndMapSync() {
  return new Promise((resolve) => {
    storage.get(['sign', 'signMap'], function(result) {
      const { sign: signJson, signMap: signMapJson } = result
      const sign = JSONToParse(signJson) || []
      const signMap = JSONToParse(signMapJson) || {}

      resolve({ sign, signMap })
    })
  })
}

/**
 * 
 * @param {array} sign
 */
async function setSignSync(sign) {
  return new Promise((resolve) => {

    storage.set({ sign: JSONToStringify(sign) }, resolve)
  })
}

/**
 * 
 * @param {array} signMap
 */
async function setSignMapSync(signMap) {
  return new Promise((resolve) => {

    storage.set({ signMap: JSONToStringify(signMap) }, resolve)
  })
}

/**
 * 
 * @returns {string} folderId
 */
async function getFIdAsync() {
  return new Promise((resolve) => {
    storage.get('folderId', function(result) {
      const { folderId } = result

      resolve(folderId)
    })
  })
}

/**
 * 
 * @param {string} folderId
 */
async function setFIdAsync(folderId) {
  return new Promise((resolve) => {
    storage.set({ folderId }, resolve)
  })
}

export {
  JSONToParse,
  JSONToStringify,
  judgeToRepeat,
  getStorageAsync,
  setStorageSync,
  getSignSync,
  getSignMapSync,
  getSignAndMapSync,
  setSignSync,
  setSignMapSync,
  getFIdAsync,
  setFIdAsync
}
