import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
// import ext from '../../utils/ext';
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

interface Props {
  title: string;
}

async function initSign() {
  const { sign, signMap } = (await getSignAndMapSync()) as any;
  console.log('sign: ', sign);

  if (!sign || (Array.isArray(sign) && sign.length === 0)) {
    await setSignSync(defaultSign);
  }

  if (!signMap || JSON.stringify(signMap) === '{}') {
    await setSignMapSync(defaultSignMap);
  }
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const [data, setData]: any = useState();
  const [message, setMessage] = useState('');

  useEffect(() => {
    getTabs();
  }, []);

  const getTabs = async () => {
    const [activeTab]: any[] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    console.log('activeTab: ', activeTab);
    setData(activeTab);
    // chrome.tabs.sendMessage(
    //   activeTab.id,
    //   { action: 'process-page', value: activeTab },
    //   renderBookmark
    // );
  };

  const saveTabs = () => {
    // const sign = await getSignSync()
    getSignSync().then((sign: any) => {
      console.log('getSignSync: ', sign);
      try {
        const isRepeat = judgeToRepeat(sign[0].list, data);
        console.log('isRepeat: ', isRepeat);
        // 得知有重复数据
        if (isRepeat) return;

        data.id = nanoid();
        sign[0].list.push(data); // 0 => 目前默认往默认文件夹放数据

        setSignSync(sign);
      } catch (error) {
        // await initSign()
        initSign().then(() => {
          data.id = nanoid();
          sign[0].list.push(data); // 0 => 目前默认往默认文件夹放数据

          setSignSync(sign);
        });
      }
    });

    // chrome.runtime.sendMessage(
    //   { action: 'perform-save', data: data },
    //   function (response) {
    //     console.log('sendMessage - callback ', response);
    //     if (response && response.action === 'saved') {
    //       renderMessage('书签已成功保存 (•̀∀•́)');
    //     } else {
    //       renderMessage('抱歉，保存时出错了 ╥﹏╥');
    //     }
    //   }
    // );
  };

  const gotoOptions = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  };

  console.log('pupop-function,: ', title);
  return (
    <div className="OptionsContainer">
      <h1 className="app-name">土豆签</h1>

      <div id="display-container">
        {data ? (
          <>
            <div className="site-description">
              <h3 className="title">${data.title}</h3>
              <p className="description">${data.description}</p>
              <a href="${data.url}" target="_blank" className="url">
                ${data.url}
              </a>
            </div>
            <div className="action-container">
              <button
                data-bookmark="${json}"
                id="save-btn"
                className="btn btn-primary"
                onClick={saveTabs}
              >
                保存
              </button>
            </div>
          </>
        ) : (
          <p className="message">${message || '抱歉，无法提取该页面的url'}</p>
        )}
      </div>

      <footer>
        <p>
          <small>
            <a href="#" className="js-options" onClick={gotoOptions}>
              选项
            </a>
          </small>
        </p>
      </footer>
    </div>
  );
};

export default Options;
