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

let sign: Sign[];

const Options: React.FC<Props> = ({ title }: Props) => {
  const successMsg = '书签已成功保存 (•̀∀•́)';
  const errorMsg = '抱歉，保存时出错了 ╥﹏╥';
  const failMsg = '抱歉，无法提取该页面的url';
  const [data, setData] = useState<TabsData>();
  // const [inputElm, setInputElm] = useState<InputElm>();
  const [btnText, setBtnText] = useState('收藏');

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
    sign = await getSignSync();
  };

  const saveTabs = () => {
    // console.log('savetags: ', document.querySelector('.input').value);
    if (data) {
      setBtnText('已收藏');

      if (sign.length > 0) {
        const isRepeat = judgeToRepeat(sign[0].list, data);
        // 得知有重复数据
        if (isRepeat) return;

        data.id = nanoid();
        sign[0].list.push(data); // 0 => 目前默认往默认文件夹放数据

        setSignSync(sign);
      } else {
        initSign().then(() => {
          data.id = nanoid();
          sign[0].list.push(data); // 0 => 目前默认往默认文件夹放数据

          setSignSync(sign);
        });
      }
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
          <>
            <div className="content-wrap">
              {/* <div className="list-line">
              <div className="label">名称</div>
              <div className="content">
                <input className="input" defaultValue={data.title} />
              </div>
            </div>

            <div className="list-line">
              <div className="label">文件夹</div>
              <div className="content">
                <div className="folder-list-wrap">
                  {arr.map(m => (
                    <div className="folder-list-item">
                      <div className="folder-img-wrap">
                        <img
                          className="folder-img"
                          src="./icon-64.png"
                          alt=""
                        />
                      </div>
                      <div className="folder-name">{m}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
            </div>
            {/* <div className="content-wrap">
              <div className="logo-wrap">
                <img src="./icon-64.png" alt="logo" />
              </div>
              <div className="content">
                <input className="input" defaultValue={data.title} />
                <div className="folder-list-wrap" style={{ marginTop: '10px' }}>
                  <div className="folder-list-item">
                    <div className="folder-name">默认收藏夹</div>
                    <CaretDownOutlined />
                  </div>

                  <div className="folder-select-list">
                    {arr.map(m => (
                      <div className="folder-select-list-item">{m}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div> */}

            <div
              className="content-wrap"
              style={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div
                className="name-wrap"
                style={{
                  flex: '1',
                  marginRight: '10px',
                }}
              >
                <input className="input" defaultValue={data.title} />
                <div
                  className="folder-list-item"
                  style={{
                    width: '100%',
                    marginRight: '10px',
                    marginTop: '10px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    className="folder-name"
                    style={{ width: '100%', whiteSpace: 'nowrap' }}
                  >
                    默认收藏夹
                  </div>
                  <CaretDownOutlined />
                </div>
              </div>

              <div
                className="btns-wrap"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Button
                  className="finish-btn"
                  type="primary"
                  style={{ marginBottom: '10px' }}
                >
                  完成
                </Button>
                <Button className="remove-btn">移除</Button>
              </div>
            </div>
          </>
        ) : (
          //   /* <Button type="primary" onClick={saveTabs}>
          //   {btnText}
          // </Button> */
          <div className="tips">╥﹏╥ 抱歉，无法提取该页面的url</div>
        )}
      </div>

      {/* <div className="footer">
        <div className="btns-wrap">
          <Button className="remove-btn">移除</Button>
          <Button className="finish-btn" type="primary">
            完成
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default Options;
