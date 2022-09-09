import React, { useContext, useState } from 'react';
import { Collapse, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  initData,
  setFolderListSync,
  folderToFindTagId,
  getFolderListSync,
} from '@/utils/utils';

import { MOVE_MARK } from '..';
import { OptContext, tabsDropMenus } from '../../Options';
import { Folder, TabsData } from '@/types/common';
import './index.scss';

const { Panel } = Collapse;

export interface TabsListProps {
  folderList: Folder[];
  onContextMenu?: () => void;
}

export const TabsList = ({ folderList, onContextMenu }: TabsListProps) => {
  const [editTabsId, setEditTabsId] = useState('');
  const [confirmDelFolder, setConfirmDelFolder] = useState('');
  const [isOpenEditFolder, setIsOpenEditFolder] = useState('');
  const [confirmDelTabs, setConfirmDelTabs] = useState('');
  const {
    setFolderList,
    selectFolder,
    setSelectFolder,
    toDelTabs,
    setDropMenus,
    setSelectData,
    setCurrentShowPanel,
    currentShowPanel,
  } = useContext(OptContext) as any;

  const onChangeCollapse = (keys: string | string[]) => {
    if (Array.isArray(keys)) {
      setCurrentShowPanel(keys);
    } else {
      setCurrentShowPanel([keys]);
    }
  };

  const onCancelEditFoldName = (e: any) => {
    const value = e.target.value.trim();
    if (value) {
      for (let i = 0; i < folderList.length; i++) {
        const folder = folderList[i];
        if (folder.id === isOpenEditFolder) {
          folder.name = value;
          break;
        }
      }
      setFolderList(folderList);
      setFolderListSync(folderList);
    }

    setIsOpenEditFolder('');
  };

  const onTabsItemContextMenu = (data: TabsData, folders: Folder) => {
    console.log('onTabsItemContextMenu: ', data, folders);
    // isTabsDropMenus = true;
    setDropMenus(tabsDropMenus);
    setSelectData(data);
    setSelectFolder(folders.id);
  };

  const onFocusInptOptnTitle = (queryId: string) => {
    const curtFoldInput = document.querySelector(`#${queryId}`) as any;
    curtFoldInput && curtFoldInput.select();
  };

  const handleOpenEditFolder = (e: any, folderId: string) => {
    e.stopPropagation();
    setIsOpenEditFolder(folderId);
  };

  const handleClickDelFolder = (e: any, folderId: string) => {
    e.stopPropagation();

    if (confirmDelFolder === folderId) {
      // delete folder
      toDelFolder(folderId);
    } else {
      setConfirmDelFolder(folderId);
    }
  };

  const onTabsItemClick = (data: TabsData) => {
    const { url } = data;

    chrome.tabs.update({ url });
  };

  const handleOnDelTabs = (e: any, tabsId: string, folderId: string) => {
    e.stopPropagation();

    if (confirmDelTabs === tabsId) {
      setConfirmDelTabs('');
      toDelTabs(folderId, tabsId);
    } else {
      setConfirmDelTabs(tabsId);
    }
  };

  const onTabsTitleClick = (e: any, tabsId: string, folderId: string) => {
    e.stopPropagation();
    setSelectFolder(folderId);
    setEditTabsId(tabsId);
  };

  const toDelFolder = (folderId: string) => {
    const index = folderList.findIndex(f => f.id === folderId);
    const cloneTabs = JSON.parse(JSON.stringify(folderList));
    const delData = cloneTabs.splice(index, 1);

    setFolderList([...cloneTabs]);
    setConfirmDelFolder('');
    setFolderListSync(cloneTabs);

    const msgKey = Date.now();
    message.success({
      key: msgKey,
      content: (
        <div className="message-content-wrap">
          删除成功
          <div
            className="handle-wrapper"
            onClick={async () => {
              const data = await getFolderListSync();
              data.push(...delData);
              setFolderList(data);
              setFolderListSync(data);
              message.destroy(msgKey);
              delData.splice(0, 1);
            }}
          >
            撤回
          </div>
        </div>
      ),
    });
  };

  const handleToCancelEdit = async (e: any) => {
    const value = e.target.value.trim();

    const index = folderList.findIndex(f => f.id === selectFolder);
    const { list } = folderList[index];

    if (value) {
      list.forEach((m: TabsData) => {
        if (m.id === editTabsId) {
          m.title = value;
        }
      });
    }

    setEditTabsId('');
    setFolderListSync(folderList);
  };

  return (
    <div className="content" onContextMenu={onContextMenu}>
      <Collapse
        className="option-container"
        ghost
        expandIconPosition="right"
        activeKey={
          currentShowPanel.length ? currentShowPanel : folderList.map(m => m.id)
        }
        onChange={onChangeCollapse}
        // expandIcon={({ isActive }) => (
        //   <CaretRightOutlined
        //     className="option-title-icon"
        //     rotate={isActive ? 90 : 0}
        //   />
        // )}
      >
        {folderList.map(folder => (
          <Panel
            showArrow={false}
            header={
              <div
                className="option-title-container unit whole center-on-mobiles"
                data-folderid={folder.id}
              >
                {isOpenEditFolder !== folder.id ? (
                  <>
                    <div className="option-title">{folder.name}</div>
                    <div
                      className="del-wrap"
                      data-confirm={confirmDelFolder === folder.id}
                      onClick={e => handleClickDelFolder(e, folder.id)}
                    >
                      <DeleteOutlined className="del-btn" />
                    </div>
                  </>
                ) : (
                  <Input
                    id={`titleInput${folder.id}`}
                    autoFocus
                    className="option-title-input"
                    defaultValue={folder.name}
                    maxLength={24}
                    onFocus={() =>
                      onFocusInptOptnTitle(`titleInput${folder.id}`)
                    }
                    onPressEnter={onCancelEditFoldName}
                    onBlur={onCancelEditFoldName}
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </div>
            }
            key={folder.id}
            extra={
              <div>
                <EditOutlined
                  className="option-title-icon edit-icon"
                  onClick={e => handleOpenEditFolder(e, folder.id)}
                />
              </div>
            }
          >
            <div className="option-wrap">
              {folder.list.map((data: TabsData) => (
                <div
                  key={data.id}
                  className="tabs-item-link"
                  title={data.title}
                  onClick={() => onTabsItemClick(data)}
                  onContextMenu={() => onTabsItemContextMenu(data, folder)}
                >
                  <div className="tabs-item" {...{ [MOVE_MARK]: data.id }}>
                    <div
                      className="del-wrap"
                      data-confirm={confirmDelTabs === data.id}
                      onClick={(e: any) =>
                        handleOnDelTabs(e, data.id, folder.id)
                      }
                    >
                      {/* <div className="del-btn" data-id={data.id}></div> */}
                      <DeleteOutlined className="del-btn" />
                    </div>
                    <div className="icon">
                      <div
                        className="img"
                        style={{
                          backgroundImage:
                            data.favIconUrl && `url(${data.favIconUrl})`,
                        }}
                      ></div>
                    </div>
                    {/* 编辑·标题 */}
                    {editTabsId === data.id ? (
                      <div className="title" data-type="input">
                        <Input
                          id={`titleInput${data.id}`}
                          defaultValue={data.title}
                          autoFocus
                          maxLength={60}
                          onClick={e => e.stopPropagation()}
                          onBlur={handleToCancelEdit}
                          onPressEnter={handleToCancelEdit}
                          onFocus={() =>
                            onFocusInptOptnTitle(`titleInput${data.id}`)
                          }
                        />
                      </div>
                    ) : (
                      <div
                        className="title"
                        data-type="text"
                        onClick={(e: any) =>
                          onTabsTitleClick(e, data.id, folder.id)
                        }
                      >
                        <p>{data.title}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};
