import { Folder, TabsData } from '@/types/common';
import { Collapse, Input, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { OptContext, OptContextType } from '../index';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TabsCard from '../TabsCard';
import { getFolderListSync, setFolderListSync } from '@/utils/utils';
import './index.scss';

const { Panel } = Collapse;

export interface TabsPanelProps {
  folder: Folder;
  activeKey?: string[];
  onChangeCollapse?: (id: string) => void;
}

const TabsPanel: React.FC<TabsPanelProps> = props => {
  const { folder, activeKey, onChangeCollapse } = props;
  const [isOpenEditFolder, setIsOpenEditFolder] = useState('');
  const [sureToDelete, setSureToDelete] = useState(false);
  const { folderList, setFolderList } = useContext(OptContext) as OptContextType;
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (sureToDelete) {
      timer.current = setTimeout(() => {
        setSureToDelete(false);
      }, 3000);
    } else {
      clearTimeout(timer.current as NodeJS.Timeout);
    }
  }, [sureToDelete]);

  const handleChange = () => {
    onChangeCollapse?.(folder.id);
  };

  const handleClickDelFolder = (e: any) => {
    e.stopPropagation();

    if (sureToDelete) {
      // delete folder
      toDelFolder(folder.id);
      setSureToDelete(false);
    } else {
      setSureToDelete(true);
    }
  };

  const toDelFolder = (folderId: string) => {
    const index = folderList.findIndex(f => f.id === folderId);
    const cloneTabs = JSON.parse(JSON.stringify(folderList));
    const delData = cloneTabs.splice(index, 1);

    setFolderList([...cloneTabs]);
    setSureToDelete(false);
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

  const onFocusInptOptnTitle = (queryId: string) => {
    const curtFoldInput = document.querySelector(`#${queryId}`) as any;
    curtFoldInput?.select();
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

  const handleOpenEditFolder = (e: any) => {
    e.stopPropagation();
    setIsOpenEditFolder(folder.id);
  };

  return (
    <Collapse
      className="tabs-collapse"
      ghost
      expandIconPosition="right"
      activeKey={activeKey}
      onChange={handleChange}
      // expandIcon={({ isActive }) => (
      //   <CaretRightOutlined
      //     className="tabs-panel-title-icon"
      //     rotate={isActive ? 90 : 0}
      //   />
      // )}
    >
      <Panel
        showArrow={false}
        key={folder.id}
        header={
          <div className="tabs-panel-title-wrap" data-folderid={folder.id}>
            {isOpenEditFolder !== folder.id ? (
              <React.Fragment>
                <div className="tabs-panel-title">{folder.name}</div>
                <div className="del-wrap" data-confirm={sureToDelete} onClick={handleClickDelFolder}>
                  <DeleteOutlined className="del-btn" />
                </div>
              </React.Fragment>
            ) : (
              <Input
                id={`titleInput${folder.id}`}
                autoFocus
                className="tabs-panel-title-input"
                defaultValue={folder.name}
                maxLength={24}
                onFocus={() => onFocusInptOptnTitle(`titleInput${folder.id}`)}
                onPressEnter={onCancelEditFoldName}
                onBlur={onCancelEditFoldName}
                onClick={e => e.stopPropagation()}
              />
            )}
          </div>
        }
        extra={<EditOutlined className="tabs-panel-title-icon edit-icon" onClick={handleOpenEditFolder} />}
      >
        <div className="tabs-panel-wrap">
          {folder?.list.map((data: TabsData) => (
            <TabsCard key={data.id} folder={folder} data={data} />
          ))}
        </div>
      </Panel>
    </Collapse>
  );
};

export default TabsPanel;
