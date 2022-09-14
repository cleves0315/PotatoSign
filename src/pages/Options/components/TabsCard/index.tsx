import { Folder, TabsData } from '@/types/common';
import React, { useContext, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

import { OptContext, OptContextType } from '../TabsList';
import { MOVE_MARK } from '../CommandPalette';
import { Input } from 'antd';
import { setFolderListSync } from '@/utils/utils';
import { tabsDropMenus } from '@/constant/enum-list';
import './index.scss';

export interface TabsCardProps {
  folder: Folder;
  data: TabsData;
}

const TabsCard: React.FC<TabsCardProps> = ({ data, folder }) => {
  const [editTabsId, setEditTabsId] = useState('');
  const [confirmDelTabs, setConfirmDelTabs] = useState('');
  const { folderList, selectFolder, setSelectFolder, toDelTabs, setDropMenus, setSelectData } = useContext(
    OptContext
  ) as OptContextType;

  const onTabsItemContextMenu = async () => {
    await Promise.resolve();
    setDropMenus(tabsDropMenus);
    setSelectData(data);
    setSelectFolder(folder.id);
  };

  const onFocusInptOptnTitle = (queryId: string) => {
    const curtFoldInput = document.querySelector(`#${queryId}`) as any;
    curtFoldInput && curtFoldInput.select();
  };

  const handleOnDelTabs = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (confirmDelTabs === data.id) {
      setConfirmDelTabs('');
      toDelTabs(folder.id, data.id);
    } else {
      setConfirmDelTabs(data.id);
    }
  };

  const onTabsTitleClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectFolder(folder.id);
    setEditTabsId(data.id);
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
    <a
      key={data.id}
      href={data.url}
      className="tabs-item-link"
      title={data.title}
      onContextMenu={onTabsItemContextMenu}
    >
      <div className="tabs-item" {...{ [MOVE_MARK]: data.id }}>
        <div className="del-wrap" data-confirm={confirmDelTabs === data.id} onClick={handleOnDelTabs}>
          {/* <div className="del-btn" data-id={data.id}></div> */}
          <DeleteOutlined className="del-btn" />
        </div>
        <div className="icon">
          {data.favIconUrl ? (
            <img className="tabs-icon" src={data.favIconUrl} alt="" />
          ) : (
            <div className="default-icon"></div>
          )}
        </div>
        {/* * 编辑·标题 * */}
        {editTabsId === data.id ? (
          <div className="title" data-type="input">
            <Input
              id={`titleInput${data.id}`}
              defaultValue={data.title}
              autoFocus
              maxLength={60}
              onClick={e => e.preventDefault()}
              onBlur={handleToCancelEdit}
              onPressEnter={handleToCancelEdit}
              onFocus={() => onFocusInptOptnTitle(`titleInput${data.id}`)}
            />
          </div>
        ) : (
          <div className="title" data-type="text" onClick={onTabsTitleClick}>
            <p>{data.title}</p>
          </div>
        )}
      </div>
    </a>
  );
};

export default TabsCard;
