import { storage } from './storage';
import { STOG_FOLDER } from '@/constant/common';
import { defaultData } from '@/constant/default-tabs';
import { Folder, TabsData } from '@/types/common';

/**
 * @param {string} json
 * @returns
 */
export function JSONToParse(json: string) {
  return typeof json === 'string' ? JSON.parse(json) : json;
}

export function JSONToStringify(json: any) {
  return JSON.stringify(json);
}

export async function initData() {
  const folder = await getFolderListSync();

  if (!folder || (Array.isArray(folder) && folder.length === 0)) {
    await setFolderListSync(defaultData);
  }
}

export async function getStorageAsync(keys: string | string[]): Promise<any> {
  return new Promise(resolve => {
    storage.get(keys, function (result) {
      const resultData: any = {};
      const payload = typeof keys === 'string' ? [keys] : keys;

      payload.forEach((key: any) => {
        resultData[key] = JSONToParse(result[key]);
      });

      resolve(resultData);
    });
  });
}

export async function setStorageSync(params: any) {
  return new Promise<void>(resolve => {
    const payload: any = {};
    const keys = Object.getOwnPropertyNames(params);

    keys.forEach(key => {
      payload[key] = JSONToStringify(params[key]);
    });

    storage.set(payload, resolve);
  });
}

export async function getFolderListSync(): Promise<Folder[]> {
  return new Promise(resolve => {
    storage.get(STOG_FOLDER, function (result) {
      const { folder: dataJson } = result;
      const folder = JSONToParse(dataJson) || [];

      resolve(folder);
    });
  });
}

export async function setFolderListSync(data: Folder[]) {
  return new Promise<void>(resolve => {
    storage.set({ [STOG_FOLDER]: JSONToStringify(data) }, resolve);
  });
}

/**
 * 查找出传入的标签id所在的文件夹id
 */
export async function folderToFindTagId(tagId: string, folders?: Folder[]) {
  let folderList: Folder[];
  let folderId = '';

  if (!folders) {
    folderList = await getFolderListSync();
  } else {
    folderList = folders;
  }

  for (let i = 0; i < folderList.length; i++) {
    const folder = folderList[i];
    const find = folder.list.find(m => m.id === tagId);

    if (find) {
      folderId = folder.id;
      break;
    }
  }

  return folderId;
}
