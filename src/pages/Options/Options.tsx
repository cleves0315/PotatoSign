import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useHotkeys } from 'react-hotkeys-hook';
import React, { createContext, useEffect, useState } from 'react';
import { Folder, TabsData } from '@/types/common';
import { InputModal, SelectModal, DropdownMenu } from '@/components';
import { initData, setFolderListSync, folderToFindTagId, getFolderListSync } from '@/utils/utils';
import { Header, Footer, CommandPalette, MOVETOFOLDER, MOVETOTABS, GOOGLING, OkParams, TabsList } from './components';

import './index.scss';

interface Props {}

interface Menu {
  text: string;
  value: string;
}

const defaltAddFoldValue = '新建文件夹';
const defaltRemoveFoldValue = '001';

export enum DropMenusEnum {
  create = 'create',
  reload = 'reload',
  rename = 'rename',
  moveto = 'moveto',
  delete = 'delete',
  command = 'command',
}

export const tabsDropMenus = [
  { text: '重命名', value: DropMenusEnum.create },
  { text: '移动', value: DropMenusEnum.moveto },
  { text: '删除', value: DropMenusEnum.delete },
];
export const folderDropMenus = [
  { text: '重命名', value: DropMenusEnum.rename },
  { text: '删除', value: DropMenusEnum.delete },
];
export const backDropMenus = [
  { text: '新建收藏夹', value: DropMenusEnum.create },
  { text: '命令面板', value: DropMenusEnum.command },
  { text: '刷新页面', value: DropMenusEnum.reload },
];

export const OptContext = createContext({});

const Options = () => {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [editTabsId, setEditTabsId] = useState('');
  const [dropMenus, setDropMenus] = useState<Menu[]>([]);
  const [selectData, setSelectData] = useState<TabsData | any>({});
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

  const clearContextMenu = () => {
    setDropMenus([]);
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
    // 生成弹窗
    setModalVisible(true);
    setModalTitle('新建收藏夹');
  };

  const showMoveTabsModal = () => {
    // 生成弹窗
    setSeltModalVisible(true);
  };

  const onCreateFolder = (name: string) => {
    const folder: Folder = {
      id: uuidv4(),
      list: [],
      name,
    };

    folderList.push(folder);
    setFolderList(folderList);
    setFolderListSync(folderList);
    setCurrentShowPanel([...currentShowPanel, folder.id]);
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
    setCommandVisible(false);
  };

  return (
    <OptContext.Provider
      value={{
        folderList,
        setFolderList,
        selectFolder,
        setSelectFolder,
        toDelTabs,
        setDropMenus,
        setSelectData,
        setCurrentShowPanel,
        currentShowPanel,
      }}
    >
      <DropdownMenu
        menuList={dropMenus}
        delValue={DropMenusEnum.delete}
        onClick={onDropMenuClick}
        onHide={onDropMenuHide}
      >
        <div className="app-container">
          <Header onContextMenu={clearContextMenu} />
          <TabsList />
          <Footer />

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
            // options={
            //   folderList
            //     ? folderList.map(m => ({ label: m.name, value: m.id }))
            //     : []
            // }
            onCancel={() => setSeltModalVisible(false)}
            onFinish={onSeltModalFormFinish}
          />

          <CommandPalette visible={commandVisible} onOk={onCommandOk} onCancel={onCommandCancel} />
        </div>
      </DropdownMenu>
    </OptContext.Provider>
  );
};

export default Options;
