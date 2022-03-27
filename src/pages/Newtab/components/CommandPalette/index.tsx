import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { FolderOutlined, SearchOutlined } from '@ant-design/icons';

import { getStorageAsync } from '../../../../utils/utils';
import { Sign, TabsData } from '../../../../types/sign';
import { MOVETOFOLDER, MOVETOSIGN, GOOGLING } from './constanst';

import './index.scss';

interface TargetElement extends Element {
  offsetTop: number;
  parentElement: HTMLElement;
}

interface OkParams {
  action: string;
  sign: string;
  commandText?: string;
}

interface Props {
  visible: boolean;
  maskClosable?: boolean; // 点击遮罩是否关闭
  escCancel?: boolean; // 是否支持键盘 esc 关闭
  onCancel?: () => void;
  onOk?: (params: OkParams) => void;
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
    searchFolder(command);
    searchSign(command);
  };

  const searchFolder = (command: string) => {
    if (command) {
      const reg = new RegExp(`(${command})+`, 'i');
      const searched: Sign[] = localSign.filter(s => reg.test(s.name));
      setFolSearResult(searched);
    } else {
      setFolSearResult([]);
    }
  };

  const searchSign = (command: string) => {
    const searched: SignSearResult[] = [];

    if (command) {
      const reg = new RegExp(`(${command})+`, 'i');
      localSign.forEach(folder => {
        folder.list.forEach(sign => {
          if (reg.test(sign.title)) {
            searched.push({
              ...sign,
              // ...folder
              folderName: folder.name,
            });
          }
        });
      });

      setSignSearResult(searched);
    } else {
      setSignSearResult([]);
    }
  };

  const onClickStack = (e: any) => {
    const { action, id } = e.target.dataset;

    if (!action) return;

    onCancel && onCancel();

    switch (action) {
      case MOVETOFOLDER:
        onOk && onOk({ action, sign: id, commandText });
        handelMoveToFolder(id);
        break;
      case MOVETOSIGN:
        onOk && onOk({ action, sign: id, commandText });
        handleMoveToSign(id);
        break;
      case GOOGLING:
        const url = `http://www.baidu.com/s?wd=${commandText}`;
        onOk && onOk({ action, sign: url, commandText });
        window.open(url);
        break;

      default:
        break;
    }
  };

  const handelMoveToFolder = (folderId: string) => {
    let targetElement: TargetElement | null = document.querySelector(
      `[data-folderid="${folderId}"]`
    );

    if (targetElement) {
      scrollTo(targetElement);
      folderToSeeAnimation(folderId);
    }
  };

  const handleMoveToSign = (signId: string) => {
    const targetElement: TargetElement | null = document.querySelector(
      `[data-signid="${signId}"]`
    );

    if (targetElement) {
      scrollTo(targetElement);
      tagToSeeAnimation(signId);
    }
  };

  const scrollTo = (targetElement: TargetElement) => {
    let offsetTop = 0;
    let element: TargetElement | HTMLElement = targetElement;

    while (element.offsetTop < 100) {
      if (element.parentElement) {
        element = element.parentElement;
      } else {
        break;
      }
    }

    offsetTop = element.offsetTop;
    window.scrollTo({
      top: offsetTop - 200,
      behavior: 'smooth',
    });
  };

  const folderToSeeAnimation = (folderId: string) => {
    const targetElement: TargetElement | null = document.querySelector(
      `[data-folderid="${folderId}"]`
    );

    if (targetElement) {
      targetElement.classList.add('checking');
      setTimeout(() => {
        targetElement.classList.remove('checking');
      }, 1500);
    }
  };

  const tagToSeeAnimation = (signId: string) => {
    const targetElement: TargetElement | null = document.querySelector(
      `[data-signid="${signId}"]`
    );

    if (targetElement) {
      targetElement.parentElement.classList.add('checking');
      setTimeout(() => {
        targetElement.parentElement.classList.remove('checking');
      }, 1500);
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
