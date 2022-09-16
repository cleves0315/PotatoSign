import { v4 as uuidv4 } from 'uuid';
import React, { createContext, useEffect, useState } from 'react';
import { message } from 'antd';
import { setFolderListSync, getFolderListSync, folderToFindTagId, initData } from '@/utils/utils';

import { MOVE_MARK, OkParams, MOVETOFOLDER, MOVETOTABS, GOOGLING, CommandPalette } from '..';
import { Folder, TabsData } from '@/types/common';
import './index.scss';
import { backDropMenus } from '@/constant/enum-list';
import { DropdownMenu, InputModal, SelectModal } from '@/components';
import { DropMenusEnum } from '@/constant/enum';
import { useHotkeys } from 'react-hotkeys-hook';
import TabsPanel from '../TabsPanel';

interface Menu {
  text: string;
  value: string;
}

const defaltAddFoldValue = '新建文件夹';
const defaltRemoveFoldValue = '001';

export type OptContextType = { folderList: Folder[]; [name: string]: any };

export interface TabsListProps {}

export const OptContext = createContext({});

export const TabsList: React.FC<TabsListProps> = () => {
  const [dropMenus, setDropMenus] = useState<Menu[]>([]);
  const [editTabsId, setEditTabsId] = useState('');
  const [selectData, setSelectData] = useState<TabsData | any>({});
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [selectFolder, setSelectFolder] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [seltModalVisible, setSeltModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [commandVisible, setCommandVisible] = useState(false);
  const [currentShowPanel, setCurrentShowPanel] = useState<string[]>([]);

  useHotkeys('ctrl+k,command+k', (e: any) => {
    e.preventDefault();
    setCommandVisible(true);
  });

  useEffect(() => {
    fetchData();
    // storage.clear();
  }, []);

  const fetchData = async () => {
    let data = await getFolderListSync();
    console.log('folderList: ', data);
    console.log('folderList to json: ', JSON.stringify(data));

    if (!data.length) {
      data = await initData();
    }
    setFolderList(data);
    setCurrentShowPanel(data.map(m => m.id));
  };

  const handleChangeCollapse = (folderId: string) => {
    setCurrentShowPanel(state => {
      const index = state.findIndex(m => m === folderId);

      if (index === -1) {
        state.push(folderId);
      } else {
        state.splice(index, 1);
      }
      return state;
    });
  };

  const onDropMenuClick = (val: string) => {
    switch (val) {
      case DropMenusEnum.rename:
        if (selectData) setEditTabsId(selectData.id);
        break;
      case DropMenusEnum.delete:
        if (selectData) toDelTabs(selectFolder, selectData.id);
        break;
      case DropMenusEnum.create:
        showCreateFolderModal();
        break;
      case DropMenusEnum.moveto:
        showMoveTabsModal();
        break;
      case DropMenusEnum.reload:
        window.location.reload();
        break;
      case DropMenusEnum.command:
        setCommandVisible(true);
        break;

      default:
        break;
    }
  };

  const onDropMenuHide = () => {
    setDropMenus([]);
  };

  const onFolderContextMenu = () => {
    setDropMenus(backDropMenus);
  };

  const toDelTabs = async (folderId: string, tabsId: string) => {
    try {
      const index = folderList.findIndex(f => f.id === folderId);
      const tabsList = folderList[index].list;
      const findIndex = tabsList.findIndex((m: TabsData) => m.id === tabsId);

      const delData = tabsList.splice(findIndex, 1);

      setFolderList([...folderList]);
      await setFolderListSync(folderList);

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
                data[index].list.push(...delData);
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
    } catch (error) {
      console.error('handleOnDelTabs: \n', error);
    }
  };

  const showCreateFolderModal = () => {
    setModalVisible(true);
    setModalTitle('新建收藏夹');
  };

  const showMoveTabsModal = () => {
    setSeltModalVisible(true);
  };

  const onCreateFolder = (name: string) => {
    const folder: Folder = {
      id: uuidv4(),
      list: [],
      name,
    };

    folderList.push(folder);
    // setFolderList(folderList);
    setFolderListSync(folderList);
    fetchData();
    // setCurrentShowPanel([...currentShowPanel, folder.id]);
    message.success({ content: '创建成功' });
  };

  const handleMoveTabsToFolder = (toFoldId: string) => {
    const index = folderList.findIndex(f => f.id === selectFolder);
    const toIndex = folderList.findIndex(f => f.id === toFoldId);
    const findIndex = folderList[index].list.findIndex(m => m.id === selectData.id);
    const [data] = folderList[index].list.splice(findIndex, 1);
    folderList[toIndex].list.push(data);

    setFolderList(folderList);
    setFolderListSync(folderList);
  };

  const onModalFormFinish = ({ value }: { value: string }) => {
    const foldName = value.trim();
    onCreateFolder(foldName);
    setModalVisible(false);
  };

  const onSeltModalFormFinish = ({ value }: { value: string }) => {
    handleMoveTabsToFolder(value);
    message.success({ content: '移动成功' });
    setSeltModalVisible(false);
  };

  const onCommandOk = async ({ action, data: sg }: OkParams) => {
    switch (action) {
      case MOVETOFOLDER:
        break;
      case MOVETOTABS:
        // 如果文件夹折叠，则打开
        const folderId = await folderToFindTagId(sg);
        const isFolderShow = currentShowPanel.includes(folderId);

        if (!isFolderShow) {
          setCurrentShowPanel([...currentShowPanel, folderId]);
        }
        break;
      case GOOGLING:
        break;

      default:
        break;
    }
  };

  const onCommandCancel = () => {
    console.log('onCommandCancel: ');

    setCommandVisible(false);
  };

  return (
    <DropdownMenu
      menuList={dropMenus}
      delValue={DropMenusEnum.delete}
      onClick={onDropMenuClick}
      onHide={onDropMenuHide}
    >
      <OptContext.Provider
        value={
          {
            folderList,
            setFolderList,
            selectFolder,
            setSelectFolder,
            toDelTabs,
            setDropMenus,
            setSelectData,
            setCurrentShowPanel,
          } as OptContextType
        }
      >
        <div className="tabs-list" onContextMenu={onFolderContextMenu}>
          {folderList.map(folder => (
            <TabsPanel
              key={folder.id}
              activeKey={currentShowPanel}
              folder={folder}
              onChangeCollapse={handleChangeCollapse}
            />
          ))}
        </div>
      </OptContext.Provider>

      <InputModal
        visible={modalVisible}
        title={modalTitle}
        initialValue={defaltAddFoldValue}
        onFinish={onModalFormFinish}
        onCancel={() => setModalVisible(false)}
      />

      <SelectModal
        visible={seltModalVisible}
        initialValue={defaltRemoveFoldValue}
        fieldNames={{
          label: 'name',
          value: 'id',
        }}
        options={folderList}
        // options={folderList ? folderList.map(m => ({ name: m.name, id: m.id })) : []}
        onCancel={() => setSeltModalVisible(false)}
        onFinish={onSeltModalFormFinish}
      />

      <CommandPalette visible={commandVisible} onOk={onCommandOk} onCancel={onCommandCancel} />
    </DropdownMenu>
  );
};
