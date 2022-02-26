import { nanoid } from 'nanoid';
import { SettingOutlined, CaretDownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import Button from '../../components/Button';
import { Sign, TabsData } from '../../types/sign';
import { defaultSign, defaultSignMap } from '../../utils/mixin';
import {
  JSONToParse,
  setSignSync,
  setSignMapSync,
  getSignSync,
  getSignAndMapSync,
  judgeToRepeat,
} from '../../utils/utils';
import './index.scss';

interface InputDom {
  select: () => void;
}

type InputElm = Element & InputDom;

interface Props {
  title: string;
}

async function initSign() {
  const { sign, signMap } = (await getSignAndMapSync()) as any;

  if (!sign || (Array.isArray(sign) && sign.length === 0)) {
    await setSignSync(defaultSign);
  }

  if (!signMap || JSON.stringify(signMap) === '{}') {
    await setSignMapSync(defaultSignMap);
  }
}

// let sign: Sign[];

const Options: React.FC<Props> = ({ title }: Props) => {
  const successMsg = '书签已成功保存 (•̀∀•́)';
  const errorMsg = '抱歉，保存时出错了 ╥﹏╥';
  const failMsg = '抱歉，无法提取该页面的url';
  const [data, setData] = useState<TabsData>();
  const [sign, setSign] = useState<Sign[]>([]);
  // const [inputElm, setInputElm] = useState<InputElm>();
  const [btnText, setBtnText] = useState('收藏');
  const [showFolderList, setShowFolderList] = useState(false);

  useEffect(() => {
    // const inputElm = document.querySelector('input') as InputElm;
    // setInputElm(inputElm);
    getTabs();
    getSign();
  }, []);

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
    console.log('sign: ', sign);
  };

  const saveTabs = () => {
    // console.log('savetags: ', document.querySelector('.input').value);
    if (data) {
      setBtnText('已收藏');

      if (sign.length > 0) {
        // 判断是否有重复数据
        const isRepeat = judgeToRepeat(sign[0].list, data);
        if (!isRepeat) {
          data.id = nanoid();
          sign[0].list.push(data); // 0 => 目前默认往默认文件夹放数据

          setSignSync(sign);
        }
      } else {
        initSign().then(() => {
          data.id = nanoid();
          sign[0].list.push(data); // 0 => 目前默认往默认文件夹放数据

          setSignSync(sign);
        });
      }

      window.close();
    }
  };

  const gotoOptions = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  };

  const arr = [
    '默认文件夹1',
    '默认文件夹2',
    '默认文件夹3',
    '默认文件夹4',
    '默认文件夹4',
    '默认文件夹5',
    '默认文件夹6',
    '默认文件夹7',
    '默认文件夹8',
    '默认文件夹9',
    '默认文件夹0',
  ];

  return (
    <div className="popup-container">
      <div className="header">
        <div className="left">
          <div className="logo-wrap">
            <img src="./icon-64.png" alt="logo" />
          </div>
          已加入书签
          {/* <div className="tips">╥﹏╥ 抱歉，无法提取该页面的url</div> */}
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
                  <div className="folder-name">{sign[0]?.name}</div>
                  <CaretDownOutlined />
                </div>

                <div className="folder-select-list-wrap">
                  {sign?.map((m, i) => (
                    <div className="folder-select-list-item" key={`${m.id}`}>
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="btns-wrap">
              <Button className="finish-btn" type="primary" onClick={saveTabs}>
                完成
              </Button>
              <Button className="remove-btn">移除</Button>
            </div>
          </div>
        ) : (
          //   /* <Button type="primary" onClick={saveTabs}>
          //   {btnText}
          // </Button> */
          <div className="tips">╥﹏╥ 抱歉，无法提取该页面的url</div>
        )}
      </div>
    </div>
  );
};

export default Options;
