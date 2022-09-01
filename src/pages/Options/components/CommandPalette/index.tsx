import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';
import { FolderOutlined, SearchOutlined } from '@ant-design/icons';

import { getFolderListSync } from '@/utils/utils';
import { Folder, TabsData } from '@/types/common';
import { MOVETOFOLDER, MOVETOTABS, GOOGLING } from './constanst';

import './index.scss';

export const MOVE_MARK = 'data-move-mark';

export interface TargetElement extends Element {
  offsetTop: number;
  parentElement: HTMLElement;
}

export interface OkParams {
  action: string;
  data: string;
  commandText?: string;
}

export interface Props {
  visible: boolean;
  maskClosable?: boolean; // 点击遮罩是否关闭
  escCancel?: boolean; // 是否支持键盘 esc 关闭
  onCancel?: () => void;
  onOk?: (params: OkParams) => void;
}

export interface SearchTabsResult extends TabsData {
  folderName: string;
}

export const CommandPalette: React.FC<Props> = ({
  visible = false,
  maskClosable = true,
  escCancel = true,
  onCancel,
  onOk,
}: Props) => {
  const [commandText, setCommandText] = useState('');
  const [topResultFolder, setTopResultFolder] = useState<Folder | null>(null);
  const [topResultTag, setTopResultTag] = useState<SearchTabsResult | null>(
    null
  );
  const [folSearResult, setFolSearResult] = useState<Folder[]>([]);
  const [searchTabsResult, setSearchTabsResult] = useState<SearchTabsResult[]>(
    []
  );

  useHotkeys('esc', (e: any) => {
    e.preventDefault();
    onCancel && onCancel();
  });

  useEffect(() => {
    if (visible) {
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
    setSearchTabsResult([]);
  };

  const onClickMask = () => {
    if (maskClosable) {
      onCancel && onCancel();
    }
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
    searchTabs(command);
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
      handleMoveToTabs(topResultTag.id);
      return;
    }

    // 执行模糊查询结果
    if (folSearResult.length) {
      handelMoveToFolder(folSearResult[0].id);
      return;
    }
    if (searchTabsResult.length) {
      handleMoveToTabs(searchTabsResult[0].id);
      return;
    }

    // 跳转搜索引擎搜索
    handleJumpToUrl();
  };

  const searchFolder = async (command: string) => {
    if (command) {
      const data = await getFolderListSync();
      const reg = new RegExp(`(${command})+`, 'i');
      const topReg = new RegExp(`^(${command})+$`, 'i');
      const topResult = data.find(s => topReg.test(s.name)) || null;
      const result: Folder[] = data.filter(s => reg.test(s.name));

      setTopResultFolder(topResult);
      setFolSearResult(result);
    } else {
      setTopResultFolder(null);
      setFolSearResult([]);
    }
  };

  const searchTabs = async (command: string) => {
    if (command) {
      let topResult: SearchTabsResult | null = null;
      const data = await getFolderListSync();
      const searched: SearchTabsResult[] = [];
      const reg = new RegExp(`(${command})+`, 'i');
      const topReg = new RegExp(`^(${command})+$`, 'i');

      data.forEach(folder => {
        folder.list.forEach(tabs => {
          if (!topResult && topReg.test(tabs.title)) {
            topResult = {
              ...tabs,
              folderName: folder.name,
            };
          }

          if (reg.test(tabs.title)) {
            searched.push({
              ...tabs,
              folderName: folder.name,
            });
          }
        });
      });

      setTopResultTag(topResult);
      setSearchTabsResult(searched);
    } else {
      setTopResultTag(null);
      setSearchTabsResult([]);
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
      case MOVETOTABS:
        handleMoveToTabs(id);
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
      onOk && onOk({ action: MOVETOFOLDER, data: folderId, commandText });
    }
  };

  const handleMoveToTabs = (tabsId: string) => {
    const targetElement: TargetElement | null = document.querySelector(
      `[${MOVE_MARK}="${tabsId}"]`
    );

    if (targetElement) {
      scrollTo(targetElement);
      tabsToSeeAnimation(tabsId);
      onOk && onOk({ action: MOVETOTABS, data: tabsId, commandText });
    }
  };

  const handleJumpToUrl = () => {
    const url = `http://www.baidu.com/s?wd=${commandText}`;
    onOk && onOk({ action: GOOGLING, data: url, commandText });
    chrome.tabs.update({ url });
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

  const tabsToSeeAnimation = (tabsId: string) => {
    const targetElement: TargetElement | null = document.querySelector(
      `[${MOVE_MARK}="${tabsId}"]`
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
                      data-action={MOVETOTABS}
                      data-id={topResultTag.id}
                    >
                      <FolderOutlined className="folder-icon" />
                      <div
                        className="result-content"
                        data-action={MOVETOTABS}
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

                {!!searchTabsResult.length && (
                  <div className="command-palette-group">
                    <div className="command-palette-header">标签</div>
                    {searchTabsResult.map(m => (
                      <div
                        className="command-palette-item"
                        key={m.id}
                        data-action={MOVETOTABS}
                        data-id={m.id}
                      >
                        <FolderOutlined className="folder-icon" />
                        <div
                          className="result-content"
                          data-action={MOVETOTABS}
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
