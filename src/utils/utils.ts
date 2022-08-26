import { storage } from './storage';
import { defaultSign } from '@/constant';
import { Folder, TabsData } from '@/types/common';

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
  const { folder } = (await getSignAndMapSync()) as any;

  if (!folder || (Array.isArray(folder) && folder.length === 0)) {
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

async function getSignSync(): Promise<Folder[]> {
  return new Promise(resolve => {
    storage.get('folder', function (result) {
      const { folder: signJson } = result;
      const folder = JSONToParse(signJson) || [];

      resolve(folder);
    });
  });
}

const getSignAndMapSync: Promise<Folder[]> = () => {
  return new Promise(resolve => {
    storage.get(['sign'], result => {
      const { sign: signJson } = result;
      const sign = (JSONToParse(signJson) as Folder[]) || [];

      resolve({ sign });
    });
  });
};

/**
 *
 * @param {array} sign
 */
async function setSignSync(sign: Folder[]) {
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

/**
 * 查找出传入的标签id所在的文件夹id
 * @param tagId
 * @param sign
 * @returns
 */
async function folderToFindTagId(tagId: string, sign?: Folder[]) {
  let signs: Folder[];
  let folderId = '';

  if (!sign) {
    signs = await getSignSync();
  } else {
    signs = sign;
  }

  for (let i = 0; i < signs.length; i++) {
    const folder = signs[i];
    const find = folder.list.find(m => m.id === tagId);

    if (find) {
      folderId = folder.id;
      break;
    }
  }

  return folderId;
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
  folderToFindTagId,
  // setFIdAsync,
};
