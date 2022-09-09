import { Folder, TabsData } from '@/types/common';
import React, { useContext, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { OptContext, tabsDropMenus } from '../../Options';
import { MOVE_MARK } from '../CommandPalette';
import { Input } from 'antd';
import { setFolderListSync } from '@/utils/utils';

export interface TabsCardProps {
  folder: Folder;
  data: TabsData;
}

const TabsCard: React.FC<TabsCardProps> = ({ data, folder }) => {
  const [editTabsId, setEditTabsId] = useState('');
  const [confirmDelTabs, setConfirmDelTabs] = useState('');

  const {
    folderList,
    selectFolder,
    setSelectFolder,
    toDelTabs,
    setDropMenus,
    setSelectData,
  }: { folderList: Folder[]; [name: string]: any } = useContext(OptContext) as any;

  const onTabsItemContextMenu = async (e: any, data: TabsData, folders: Folder) => {
    console.log('onTabsItemContextMenu: ', data, folders);
    // isTabsDropMenus = true;
    await Promise.resolve();
    setDropMenus(tabsDropMenus);
    setSelectData(data);
    setSelectFolder(folders.id);
  };

  const onFocusInptOptnTitle = (queryId: string) => {
    const curtFoldInput = document.querySelector(`#${queryId}`) as any;
    curtFoldInput && curtFoldInput.select();
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
    <div
      key={data.id}
      className="tabs-item-link"
      title={data.title}
      onClick={() => onTabsItemClick(data)}
      onContextMenu={e => onTabsItemContextMenu(e, data, folder)}
    >
      <div className="tabs-item" {...{ [MOVE_MARK]: data.id }}>
        <div
          className="del-wrap"
          data-confirm={confirmDelTabs === data.id}
          onClick={(e: any) => handleOnDelTabs(e, data.id, folder.id)}
        >
          {/* <div className="del-btn" data-id={data.id}></div> */}
          <DeleteOutlined className="del-btn" />
        </div>
        <div className="icon">
          <div
            className="img"
            style={{
              backgroundImage: data.favIconUrl && `url(${data.favIconUrl})`,
            }}
          ></div>
        </div>
        {/* * 编辑·标题 * */}
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
              onFocus={() => onFocusInptOptnTitle(`titleInput${data.id}`)}
            />
          </div>
        ) : (
          <div className="title" data-type="text" onClick={(e: any) => onTabsTitleClick(e, data.id, folder.id)}>
            <p>{data.title}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsCard;
