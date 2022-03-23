import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { FolderOutlined, SearchOutlined } from '@ant-design/icons';

import { getStorageAsync } from '../../utils/utils';
import { Sign, TabsData } from '../../types/sign';

import './index.scss';

interface Props {
  visible: boolean;
  maskClosable?: boolean; // 点击遮罩是否关闭
  escCancel?: boolean; // 是否支持键盘 esc 关闭
  onCancel?: () => void;
  onOk?: () => void;
}

interface SignSearResult extends TabsData {
  folderName: string;
}

const CommandPalette: React.FC<Props> = ({
  visible = false,
  maskClosable = true,
  escCancel = true,
  onCancel,
  onOk,
}: Props) => {
  // actionType
  const MOVETOFOLDER = 'moveToFolder';
  const MOVETOSIGN = 'moveToSign';
  const GOOGLING = 'googling';
  const [commandText, setCommandText] = useState('');
  const [localSign, setLocalSign] = useState<Sign[]>([]);
  const [folSearResult, setFolSearResult] = useState<Sign[]>([]);
  const [signSearResult, setSignSearResult] = useState<SignSearResult[]>([]);

  useEffect(() => {
    if (visible) {
      getSign();
      const commandInput: any = document.querySelector('#commandInput');
      commandInput && commandInput.select();
    } else {
      clearResulted();
    }
  }, [visible]);

  const clearResulted = () => {
    setCommandText('');
    setFolSearResult([]);
    setSignSearResult([]);
  };

  const onClickMask = () => {
    if (maskClosable) {
      onCancel && onCancel();
    }
  };

  const getSign = async () => {
    const { sign } = await getStorageAsync(['sign']);
    setLocalSign(sign);
  };

  const onChangeCommand = (e: any) => {
    const { value } = e.target;
    const command = value.trim();

    setCommandText(command);

    if (command) {
      searchFolder(command);
      searchSign(command);
    }
  };

  const searchFolder = (command: string) => {
    const searched: Sign[] = localSign.filter(s => s.name.includes(command));
    setFolSearResult(searched);
  };

  const searchSign = (command: string) => {
    const searched: SignSearResult[] = [];

    localSign.forEach(folder => {
      folder.list.forEach(sign => {
        if (sign.title.includes(command)) {
          searched.push({
            ...sign,
            // ...folder
            folderName: folder.name,
          });
        }
      });
    });

    setSignSearResult(searched);
  };

  const onClickStack = (e: any) => {
    const { action, id } = e.target.dataset;

    if (commandText.trim()) {
      onCancel && onCancel();
    }

    switch (action) {
      case MOVETOFOLDER:
        handelMoveToFolder(id);
        break;
      case MOVETOSIGN:
        handleMoveToSign(id);
        break;
      case GOOGLING:
        window.open(`http://www.baidu.com/s?wd=${commandText}`);
        break;

      default:
        break;
    }
  };

  const handelMoveToFolder = (folderId: string) => {
    let element: any = document.querySelector(`[data-folderid="${folderId}"]`);

    if (element) {
      let offsetTop = 0;

      while (element.offsetTop < 100) {
        element = element.parentElement;
      }

      offsetTop = element.offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleMoveToSign = (signId: string) => {
    let element: any = document.querySelector(`[data-signid="${signId}"]`);

    if (element) {
      let offsetTop = 0;

      while (element.offsetTop < 100) {
        element = element.parentElement;
      }

      offsetTop = element.offsetTop;
      window.scrollTo({
        top: offsetTop - 30,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="command-palette-root">
      {visible && (
        <>
          <div className="command-palette-mask"></div>

          <div className="command-palette-wrap" onClick={onClickMask}>
            <div
              className="command-palette-container"
              onClick={e => e.stopPropagation()}
            >
              <div className="command-palette-input-container">
                <Input
                  id="commandInput"
                  // size="large"
                  bordered={false}
                  autoComplete="off"
                  className="command-input"
                  prefix={<SearchOutlined className="search-icon" />}
                  allowClear
                  onChange={onChangeCommand}
                />
              </div>

              <div className="command-palette-stack" onClick={onClickStack}>
                {!commandText && (
                  <div className="command-palette-group">
                    <div className="command-palette-header">
                      提示：输入文件名
                    </div>
                  </div>
                )}

                {!!folSearResult.length && (
                  <div className="command-palette-group">
                    <div className="command-palette-header">文件夹</div>
                    {folSearResult.map(m => (
                      <div
                        className="command-palette-item"
                        key={m.id}
                        data-action={MOVETOFOLDER}
                        data-id={m.id}
                      >
                        <FolderOutlined className="folder-icon" />
                        <div
                          className="result-content"
                          data-action={MOVETOFOLDER}
                          data-id={m.id}
                        >
                          {m.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!!signSearResult.length && (
                  <div className="command-palette-group">
                    <div className="command-palette-header">标签</div>
                    {signSearResult.map(m => (
                      <div
                        className="command-palette-item"
                        key={m.id}
                        data-action={MOVETOSIGN}
                        data-id={m.id}
                      >
                        <FolderOutlined className="folder-icon" />
                        <div
                          className="result-content"
                          data-action={MOVETOSIGN}
                          data-id={m.id}
                        >
                          {m.folderName} / {m.title}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {commandText && (
                  <div className="command-palette-group">
                    <div
                      className="command-palette-item"
                      data-action={GOOGLING}
                    >
                      <SearchOutlined className="search-icon" />
                      在百度搜索中搜索
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CommandPalette;
