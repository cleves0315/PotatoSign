import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
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

  if (!sign || (Array.isArray(sign) && sign.length === 0)) {
    await setSignSync(defaultSign);
  }

  if (!signMap || JSON.stringify(signMap) === '{}') {
    await setSignMapSync(defaultSignMap);
  }
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const successMsg = '书签已成功保存 (•̀∀•́)';
  const errorMsg = '抱歉，保存时出错了 ╥﹏╥';
  const failMsg = '抱歉，无法提取该页面的url';
  const [data, setData]: any = useState();
  const [message, setMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    getTabs();
  }, []);

  const getTabs = async () => {
    const [activeTab]: any[] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    setData(activeTab);
  };

  const saveTabs = () => {
    // const sign = await getSignSync()
    getSignSync().then((sign: any) => {
      console.log('getSignSync: ', sign);
      setIsSaved(true);
      setMessage(successMsg);
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
  };

  const gotoOptions = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  };

  console.log('pupop-function,: ', isSaved);
  return (
    <div className="OptionsContainer">
      <h1 className="app-name">土豆签</h1>

      <div id="display-container">
        {data ? (
          <>
            {isSaved ? (
              <p className="message">{message}</p>
            ) : (
              <>
                <div className="site-description">
                  <h3 className="title">{data.title}</h3>
                  <p className="description">{data.description}</p>
                  <a
                    href={data.url}
                    target="_blank"
                    className="url"
                    rel="noreferrer"
                  >
                    {data.url}
                  </a>
                </div>
                <div className="action-container">
                  <button
                    id="save-btn"
                    className="btn btn-primary"
                    onClick={saveTabs}
                  >
                    保存
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <p className="message">{failMsg}</p>
        )}
      </div>

      <footer>
        <p>
          <span className="option-btn" onClick={gotoOptions}>
            选项
          </span>
        </p>
      </footer>
    </div>
  );
};

export default Options;
