import { v4 as uuidv4 } from 'uuid';
import { SettingOutlined, CaretDownOutlined } from '@ant-design/icons';
import React, { useEffect, useReducer, useState } from 'react';

import { Button } from '@/components';
import { Folder, TabsData } from '@/types/common';
import { initSign, setSignSync, getSignSync } from '@/utils/utils';
import './index.scss';

interface MapSign {
  [name: string]: string;
}
interface InputDom {
  select: () => void;
}

interface Props {}

const Options: React.FC<Props> = Props => {
  const successMsg = '书签已成功保存 (•̀∀•́)';
  const errorMsg = '抱歉，保存时出错了 ╥﹏╥';
  const failMsg = '抱歉，无法提取该页面的url';
  const [data, setData] = useState<TabsData>();
  const [sign, setSign] = useState<Folder[]>([]);
  const [signNameMap, setSignNameMap] = useState<MapSign>({});
  const [choiceFolder, setChoiceFolder] = useState('');
  const [showFolderList, setShowFolderList] = useState(false);

  useEffect(() => {
    getSign();
  }, []);

  useEffect(() => {
    if (sign.length) {
      getTabs();
    }
  }, [sign]);

  useEffect(() => {
    if (data && sign.length) {
      folderToFindTag(sign);
    }
  }, [data, sign]);

  useEffect(() => {
    if (choiceFolder) {
      saveTabs(choiceFolder);
    }
  }, [choiceFolder]);

  const getTabs = async () => {
    const [activeTab]: TabsData[] = (await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })) as any[];

    let findTab = null;
    for (let i = 0; i < sign.length; i++) {
      const folder = sign[i];
      findTab = folder.list.find(m => m.url === activeTab.url);

      if (findTab) break;
    }

    if (findTab) {
      setData(findTab);
    } else {
      setData(activeTab);
    }

    const input = document.querySelector('.input') as InputDom & Element;
    input?.select();
  };

  const getSign = async () => {
    const sign = await getSignSync();

    if (sign.length) {
      setSign(sign);
      mapSignIdToName(sign);
    } else {
      await initSign();
      getSign();
    }

    console.log('sign: ', sign);
  };

  const onInputBlur = (e: any) => {
    const value = e.target.value.trim();

    if (value && data) {
      data.title = value;
      setData(data);
      saveTabs(choiceFolder);
    }
  };

  const onKeyDown = (e: any) => {
    const { keyCode } = e;

    if (keyCode === 13) {
      onInputBlur(e);
      window.close();
    }
  };

  const folderToFindTag = (sign: Folder[]) => {
    if (data) {
      let find;
      for (let i = 0; i < sign.length; i++) {
        const list = sign[i].list;

        find = list.find(s => s.url === data.url);

        if (find) {
          setChoiceFolder(sign[i].id);
          return;
        }
      }

      if (!find) setChoiceFolder(sign[0].id); // 默认展示第一个文件
    } else {
      setChoiceFolder(sign[0].id); // 默认展示第一个文件
    }
  };

  const mapSignIdToName = (sign: Folder[]) => {
    const obj: MapSign = {};
    sign.forEach(s => {
      obj[s.id] = s.name;
    });

    setSignNameMap(obj);
  };

  const saveTabs = (id?: string) => {
    if (data) {
      if (sign.length > 0) {
        const findFolder = sign.find(s => s.id === id) || sign[0];
        const findIndex = findFolder.list.findIndex(m => m.url === data.url);

        if (findIndex === -1) {
          data.id = uuidv4();
          findFolder.list.push(data);
        } else {
          findFolder.list.splice(findIndex, 1, data);
        }
        setSignSync(sign);
      }
    }
  };

  const removeTabs = (folderId: string) => {
    const findFolder = sign.find(m => m.id === folderId) || sign[0];
    const findIndex = findFolder.list.findIndex(m => m.url === data?.url);

    if (findIndex > -1) {
      findFolder.list.splice(findIndex, 1);
      setSignSync(sign);
    }
  };

  const gotoOptions = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  };

  const onDelete = () => {
    removeTabs(choiceFolder);
    window.close();
  };

  const onChoiceFolder = (e: any) => {
    const { id } = e.target.dataset;

    removeTabs(choiceFolder);
    setChoiceFolder(id);
    setShowFolderList(false);
  };

  return (
    <div className="popup-container">
      <div className="header">
        <div className="left">
          <div className="logo-wrap">
            <img src="./icon-64.png" alt="logo" />
          </div>
          已加入书签
        </div>
        <div className="right">
          <SettingOutlined className="setting-icon" onClick={gotoOptions} />
        </div>
      </div>

      <div className="main">
        {data ? (
          <div className="content-wrap">
            <div className="content">
              <input
                className="input"
                defaultValue={data.title}
                onBlur={onInputBlur}
                onKeyDown={onKeyDown}
              />
              <div
                className="folder-list-wrap"
                style={{
                  height: showFolderList ? `${sign?.length * 35}px` : '',
                }}
              >
                <div
                  className="folder-list-item"
                  onClick={() => {
                    setShowFolderList(!showFolderList);
                  }}
                >
                  <div className="folder-name">
                    {signNameMap[choiceFolder] || ''}
                  </div>
                  <CaretDownOutlined />
                </div>

                <div
                  className="folder-select-list-wrap"
                  hidden={!showFolderList}
                  onClick={onChoiceFolder}
                >
                  {sign?.map((m, i) => (
                    <div
                      className="folder-select-list-item"
                      key={`${m.id}`}
                      data-id={m.id}
                    >
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="btns-wrap">
              <Button
                className="finish-btn"
                type="primary"
                onClick={() => window.close()}
              >
                完成
              </Button>
              <Button className="remove-btn" onClick={onDelete}>
                移除
              </Button>
            </div>
          </div>
        ) : (
          <div className="tips">╥﹏╥ 抱歉，无法提取该页面的url</div>
        )}
      </div>
    </div>
  );
};

export default Options;
