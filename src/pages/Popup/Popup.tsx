import { v4 as uuidv4 } from 'uuid';
import { SettingOutlined, CaretDownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import Button from '../../components/Button';
import { Sign, TabsData } from '../../types/sign';
import {
  initSign,
  setSignSync,
  getSignSync,
  judgeToRepeat,
} from '../../utils/utils';
import './index.scss';

interface MapSign {
  [name: string]: string;
}
interface InputDom {
  select: () => void;
}

interface Elem {
  click: () => void;
}

interface Props {}

const Options: React.FC<Props> = Props => {
  const successMsg = '书签已成功保存 (•̀∀•́)';
  const errorMsg = '抱歉，保存时出错了 ╥﹏╥';
  const failMsg = '抱歉，无法提取该页面的url';
  const [data, setData] = useState<TabsData>();
  const [sign, setSign] = useState<Sign[]>([]);
  const [signNameMap, setSignNameMap] = useState<MapSign>({});
  const [choiceFolder, setChoiceFolder] = useState('');
  const [showFolderList, setShowFolderList] = useState(false);

  useEffect(() => {
    initProcess();
  }, []);

  const initProcess = async () => {
    getTabs();
    await getSign();
    // 触发saveTabs
    document.querySelector<Elem & Element>('#toSave')?.click();
  };

  const getTabs = async () => {
    const [activeTab]: TabsData[] = (await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })) as any[];
    setData(activeTab);

    const input = document.querySelector('.input') as InputDom & Element;
    input?.select();
  };

  const getSign = async () => {
    const sign = await getSignSync();

    setSign(sign);
    setChoiceFolder(sign[0].id); // 默认展示第一个文件
    mapSignIdToName(sign);
    console.log('sign: ', sign);
  };

  const findSign = () => {};

  const onMountSave = () => {
    saveTabs();
  };

  const mapSignIdToName = (sign: Sign[]) => {
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

        // 判断是否有重复数据
        const isRepeat = judgeToRepeat(findFolder.list, data);
        if (!isRepeat) {
          data.id = uuidv4();
          findFolder.list.push(data);

          setSignSync(sign);
        }
      } else {
        initSign().then(() => {
          data.id = uuidv4();
          sign[0].list.push(data); // 0 => 目前默认往默认文件夹放数据

          setSignSync(sign);
        });
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
    saveTabs(id);
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
              <input className="input" defaultValue={data.title} />
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
              {/* 此元素没有渲染在页面，只是当作页面刚渲染时自动触发函数的元素 */}
              <button
                id="toSave"
                className="hide"
                onClick={onMountSave}
              ></button>
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
