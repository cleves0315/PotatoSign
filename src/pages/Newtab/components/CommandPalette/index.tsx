import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';
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
  const [topResultFolder, setTopResultFolder] = useState<Sign | null>(null);
  const [topResultTag, setTopResultTag] = useState<SignSearResult | null>(null);
  const [folSearResult, setFolSearResult] = useState<Sign[]>([]);
  const [signSearResult, setSignSearResult] = useState<SignSearResult[]>([]);

  useHotkeys('esc', (e: any) => {
    e.preventDefault();
    onCancel && onCancel();
  });

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
    setTopResultFolder(null);
    setTopResultTag(null);
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

  const onKeyDownCommand = (e: any) => {
    const key = e.key;
    if (key === 'Escape') {
      onCancel && onCancel();
    }
  };

  const onChangeCommand = (e: any) => {
    const { value } = e.target;
    const command = value.trim();

    setCommandText(command);
    searchFolder(command);
    searchSign(command);
  };

  const onPressEnter = () => {
    if (!commandText) return;

    onCancel && onCancel();

    // 执行进准查询结果
    if (topResultFolder) {
      handelMoveToFolder(topResultFolder.id);
      return;
    }
    if (topResultTag) {
      handleMoveToSign(topResultTag.id);
      return;
    }

    // 执行模糊查询结果
    if (folSearResult.length) {
      handelMoveToFolder(folSearResult[0].id);
      return;
    }
    if (signSearResult.length) {
      handleMoveToSign(signSearResult[0].id);
      return;
    }

    // 跳转搜索引擎搜索
    handleJumpToUrl();
  };

  const searchFolder = (command: string) => {
    if (command) {
      const reg = new RegExp(`(${command})+`, 'i');
      const topReg = new RegExp(`^(${command})+$`, 'i');
      const topResult = localSign.find(s => topReg.test(s.name)) || null;
      const result: Sign[] = localSign.filter(s => reg.test(s.name));

      setTopResultFolder(topResult);
      setFolSearResult(result);
    } else {
      setTopResultFolder(null);
      setFolSearResult([]);
    }
  };

  const searchSign = (command: string) => {
    if (command) {
      let topResult: SignSearResult | null = null;
      const searched: SignSearResult[] = [];
      const reg = new RegExp(`(${command})+`, 'i');
      const topReg = new RegExp(`^(${command})+$`, 'i');

      localSign.forEach(folder => {
        folder.list.forEach(sign => {
          if (!topResult && topReg.test(sign.title)) {
            topResult = {
              ...sign,
              folderName: folder.name,
            };
          }

          if (reg.test(sign.title)) {
            searched.push({
              ...sign,
              folderName: folder.name,
            });
          }
        });
      });

      setTopResultTag(topResult);
      setSignSearResult(searched);
    } else {
      setTopResultTag(null);
      setSignSearResult([]);
    }
  };

  const onClickStack = (e: any) => {
    const { action, id } = e.target.dataset;

    if (!action) return;

    onCancel && onCancel();

    switch (action) {
      case MOVETOFOLDER:
        handelMoveToFolder(id);
        break;
      case MOVETOSIGN:
        handleMoveToSign(id);
        break;
      case GOOGLING:
        handleJumpToUrl();
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
      onOk && onOk({ action: MOVETOFOLDER, sign: folderId, commandText });
    }
  };

  const handleMoveToSign = (signId: string) => {
    const targetElement: TargetElement | null = document.querySelector(
      `[data-signid="${signId}"]`
    );

    if (targetElement) {
      scrollTo(targetElement);
      tagToSeeAnimation(signId);
      onOk && onOk({ action: MOVETOSIGN, sign: signId, commandText });
    }
  };

  const handleJumpToUrl = () => {
    const url = `http://www.baidu.com/s?wd=${commandText}`;
    onOk && onOk({ action: GOOGLING, sign: url, commandText });
    window.open(url);
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
                  onKeyDown={onKeyDownCommand}
                  onChange={onChangeCommand}
                  onPressEnter={onPressEnter}
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

                {topResultFolder && (
                  <div className="command-palette-group">
                    <div className="command-palette-header">最佳结果</div>
                    <div
                      className="command-palette-item"
                      key={topResultFolder.id}
                      data-action={MOVETOFOLDER}
                      data-id={topResultFolder.id}
                    >
                      <FolderOutlined className="folder-icon" />
                      <div
                        className="result-content"
                        data-action={MOVETOFOLDER}
                        data-id={topResultFolder.id}
                      >
                        {topResultFolder.name}
                      </div>
                    </div>
                  </div>
                )}

                {!topResultFolder && topResultTag && (
                  <div className="command-palette-group">
                    <div className="command-palette-header">最佳结果</div>
                    <div
                      className="command-palette-item"
                      key={topResultTag.id}
                      data-action={MOVETOSIGN}
                      data-id={topResultTag.id}
                    >
                      <FolderOutlined className="folder-icon" />
                      <div
                        className="result-content"
                        data-action={MOVETOSIGN}
                        data-id={topResultTag.id}
                      >
                        {topResultTag.folderName} / {topResultTag.title}
                      </div>
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
