import React, { useContext, useState } from 'react';
import { Collapse, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { setFolderListSync, getFolderListSync } from '@/utils/utils';

import { MOVE_MARK } from '..';
import { backDropMenus, OptContext, tabsDropMenus } from '../../Options';
import { Folder, TabsData } from '@/types/common';
import './index.scss';
import TabsCard from './TabsCard';

const { Panel } = Collapse;

export interface TabsListProps {}

export const TabsList: React.FC<TabsListProps> = () => {
  const [confirmDelFolder, setConfirmDelFolder] = useState('');
  const [isOpenEditFolder, setIsOpenEditFolder] = useState('');
  const {
    folderList,
    setDropMenus,
    setFolderList,
    setCurrentShowPanel,
    currentShowPanel,
  }: { folderList: Folder[]; [name: string]: any } = useContext(OptContext) as any;

  const onFolderContextMenu = () => {
    setDropMenus(backDropMenus);
  };

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

  const renderPanelHeader = (folder: Folder) => (
    <div className="option-title-container" data-folderid={folder.id}>
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
          onFocus={() => onFocusInptOptnTitle(`titleInput${folder.id}`)}
          onPressEnter={onCancelEditFoldName}
          onBlur={onCancelEditFoldName}
          onClick={e => e.stopPropagation()}
        />
      )}
    </div>
  );

  const renderExtra = (folder: Folder) => (
    <div>
      <EditOutlined className="option-title-icon edit-icon" onClick={e => handleOpenEditFolder(e, folder.id)} />
    </div>
  );

  return (
    <div className="content" onContextMenu={onFolderContextMenu}>
      <Collapse
        className="option-container"
        ghost
        expandIconPosition="right"
        activeKey={currentShowPanel.length ? currentShowPanel : folderList.map(m => m.id)}
        onChange={onChangeCollapse}
        // expandIcon={({ isActive }) => (
        //   <CaretRightOutlined
        //     className="option-title-icon"
        //     rotate={isActive ? 90 : 0}
        //   />
        // )}
      >
        {folderList.map(folder => (
          <Panel showArrow={false} header={renderPanelHeader(folder)} key={folder.id} extra={renderExtra(folder)}>
            <div className="option-wrap">
              {folder?.list.map((data: TabsData) => (
                <TabsCard key={data.id} folder={folder} data={data} />
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};
