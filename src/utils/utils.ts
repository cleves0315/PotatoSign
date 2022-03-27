import { storage } from './storage';
import { defaultSign } from './mixin';
import { Sign, TabsData } from '../types/sign';

/**
 * @param {string} json
 * @returns
 */
function JSONToParse(json: string) {
  return typeof json === 'string' ? JSON.parse(json) : json;
}

function JSONToStringify(json: any) {
  return JSON.stringify(json);
}

async function initSign() {
  const { sign } = (await getSignAndMapSync()) as any;

  if (!sign || (Array.isArray(sign) && sign.length === 0)) {
    await setSignSync(defaultSign);
  }
}

/**
 *
 * @param {string | string[]} params
 */
async function getStorageAsync(params: any): Promise<any> {
  return new Promise(resolve => {
    storage.get(params, function (result) {
      const resultData: any = {};
      const payload = typeof params === 'string' ? [params] : params;

      payload.forEach((key: any) => {
        resultData[key] = JSONToParse(result[key]);
      });

      resolve(resultData);
    });
  });
}

/**
 *
 * @param {object} params
 */
async function setStorageSync(params: any) {
  return new Promise<void>(resolve => {
    const payload: any = {};
    const keys = Object.getOwnPropertyNames(params);

    keys.forEach(key => {
      payload[key] = JSONToStringify(params[key]);
    });

    storage.set(payload, resolve);
  });
}

async function getSignSync(): Promise<Sign[]> {
  return new Promise(resolve => {
    storage.get('sign', function (result) {
      const { sign: signJson } = result;
      const sign = JSONToParse(signJson) || [];

      resolve(sign);
    });
  });
}

/**
 *
 * @returns {object} { sign }
 */
async function getSignAndMapSync() {
  return new Promise(resolve => {
    storage.get(['sign'], function (result) {
      const { sign: signJson } = result;
      const sign = JSONToParse(signJson) || [];

      resolve({ sign });
    });
  });
}

/**
 *
 * @param {array} sign
 */
async function setSignSync(sign: Sign[]) {
  return new Promise<void>(resolve => {
    storage.set({ sign: JSONToStringify(sign) }, resolve);
  });
}

/**
 *
 * @returns {string} folderId
 */
async function getFIdAsync() {
  return new Promise(resolve => {
    storage.get('folderId', function (result) {
      const { folderId } = result;

      resolve(folderId);
    });
  });
}

/**
 *
 * @param {string} folderId
 */
async function setFIdAsync(folderId: string) {
  return new Promise<void>(resolve => {
    storage.set({ folderId }, resolve);
  });
}

export {
  JSONToParse,
  JSONToStringify,
  initSign,
  getStorageAsync,
  setStorageSync,
  getSignSync,
  getSignAndMapSync,
  setSignSync,
  getFIdAsync,
  // setFIdAsync,
};
