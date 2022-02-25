import { nanoid } from 'nanoid';
import { SettingOutlined } from '@ant-design/icons';
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
  const [btnText, setBtnText] = useState('收藏');

  useEffect(() => {
    getTabs();
    getSign();
  }, []);

  const getTabs = async () => {
    const [activeTab]: TabsData[] = (await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })) as any[];
    setData(activeTab);
  };

  const getSign = async () => {
    sign = await getSignSync();
    console.log('getSign: ', sign);
  };

  const saveTabs = () => {
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

  return (
    <div className="popup-container">
      <div className="header">
        <div className="left">PotatoSign</div>
        <div className="right">
          <SettingOutlined className="setting-icon" onClick={gotoOptions} />
        </div>
      </div>

      <div className="main">
        {data ? (
          <div className="content-wrap">
            <div className="logo-wrap">
              <img src="./icon-64.png" alt="logo" />
            </div>
            <div className="center-content">
              <div className="title">{data?.title}</div>
              <div className="url">{data?.url}</div>
            </div>
            <div className="btn-wrap">
              <Button type="primary" onClick={saveTabs}>
                {btnText}
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
