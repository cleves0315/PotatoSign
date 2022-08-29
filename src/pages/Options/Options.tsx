import { v4 as uuidv4 } from 'uuid';
import { useHotkeys } from 'react-hotkeys-hook';
import { Collapse, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { Folder, TabsData } from '@/types/common';
import { InputModal, SelectModal, DropdownMenu, Switch } from '@/components';
import CommandPalette, {
  MOVE_MARK,
  OkParams,
} from './components/CommandPalette';
import {
  MOVETOFOLDER,
  MOVETOTABS,
  GOOGLING,
} from './components/CommandPalette/constanst';
import {
  initData,
  setFolderListSync,
  folderToFindTagId,
  getFolderListSync,
} from '@/utils/utils';

import './index.scss';

const { Panel } = Collapse;

interface Props {}

interface Menu {
  text: string;
  value: string;
}

const Options: React.FC<Props> = () => {
  let isTabsDropMenus = false;
  const CREATE = 'create';
  const RELODAD = 'reload';
  const RENAME = 'rename';
  const MOVETO = 'moveto';
  const DELETE = 'delete';
  const COMMAND = 'command';
  const defaltAddFoldValue = '新建文件夹';
  const defaltRemoveFoldValue = '001';
  const tabsDropMenus = [
    { text: '重命名', value: RENAME },
    { text: '移动', value: MOVETO },
    { text: '删除', value: DELETE },
  ];
  const folderDropMenus = [
    { text: '重命名', value: RENAME },
    { text: '删除', value: DELETE },
  ];
  const backDropMenus = [
    { text: '新建收藏夹', value: CREATE },
    { text: '命令面板', value: COMMAND },
    { text: '刷新页面', value: RELODAD },
  ];

  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [editTabsId, setEditTabsId] = useState('');
  const [dropMenus, setDropMenus] = useState<Menu[]>([]);
  const [selectData, setSelectData] = useState<TabsData | any>({});
  const [selectFolder, setSelectFolder] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [seltModalVisible, setSeltModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [isOpenEditFolder, setIsOpenEditFolder] = useState('');
  const [confirmDelTabs, setConfirmDelTabs] = useState('');
  const [confirmDelFolder, setConfirmDelFolder] = useState('');
  const [commandVisible, setCommandVisible] = useState(false);
  const [showCurrentFolder, setShowCurrentFolder] = useState<string[]>([]);

  useHotkeys('ctrl+k,command+k', (e: any) => {
    e.preventDefault();
    setCommandVisible(true);
  });

  useEffect(() => {
    fetchData();
    // chrome.storage.local.clear();
  }, []);

  const fetchData = async () => {
    const data = await getFolderListSync();
    console.log('folderList: ', data);
    console.log('folderList to json: ', JSON.stringify(data));

    if (!data) {
      await initData();
      fetchData();
    } else {
      setFolderList(data);
      setShowCurrentFolder(data.map(m => m.id));
    }
  };

  const onTabsItemContextMenu = (data: TabsData, folders: Folder) => {
    console.log('onTabsItemContextMenu: ', data, folders);
    isTabsDropMenus = true;
    setDropMenus(tabsDropMenus);
    setSelectData(data);
    setSelectFolder(folders.id);
  };

  const onBackContextMenu = () => {
    if (!isTabsDropMenus) {
      setDropMenus(backDropMenus);
    } else {
      isTabsDropMenus = false;
    }
  };

  const onChangeCollapse = (keys: string | string[]) => {
    if (Array.isArray(keys)) {
      setShowCurrentFolder(keys);
    } else {
      setShowCurrentFolder([keys]);
    }
  };

  const clearContextMenu = () => {
    setDropMenus([]);
  };

  const onDropMenuClick = (val: string) => {
    switch (val) {
      case RENAME:
        if (selectData) setEditTabsId(selectData.id);
        break;
      case DELETE:
        if (selectData) toDelTabs(selectData.id, selectFolder);
        break;
      case CREATE:
        showCreateFolderModal();
        break;
      case MOVETO:
        showMoveTabsModal();
        break;
      case RELODAD:
        window.location.reload();
        break;
      case COMMAND:
        setCommandVisible(true);
        break;

      default:
        break;
    }
  };

  const handleOpenEditFolder = (e: any, folderId: string) => {
    e.stopPropagation();
    setIsOpenEditFolder(folderId);
  };

  const onFocusInptOptnTitle = (queryId: string) => {
    const curtFoldInput = document.querySelector(`#${queryId}`) as any;
    curtFoldInput && curtFoldInput.select();
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

  const handleClickDelFolder = (e: any, folderId: string) => {
    e.stopPropagation();

    if (confirmDelFolder === folderId) {
      // delete folder
      toDelFolder(folderId);
    } else {
      setConfirmDelFolder(folderId);
    }
  };

  const onDropMenuHide = () => {
    setDropMenus([]);
  };

  const onTabsItemClick = (data: TabsData) => {
    const { url } = data;

    chrome.tabs.update({ url });
  };

  const handleOnDelTabs = (e: any, tabsId: string, folderId: string) => {
    e.stopPropagation();

    if (confirmDelTabs === tabsId) {
      toDelTabs(tabsId, folderId);
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

  const toDelTabs = async (id: string, folderId: string) => {
    try {
      const index = folderList.findIndex(f => f.id === folderId);
      const tabsList = folderList[index].list;
      const findIndex = tabsList.findIndex((m: TabsData) => m.id === id);

      const delData = tabsList.splice(findIndex, 1);

      setFolderList([...folderList]);
      setConfirmDelTabs('');
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
    setShowCurrentFolder([...showCurrentFolder, folder.id]);
    message.success({ content: '创建成功' });
  };

  const handleMoveTabsToFolder = (toFoldId: string) => {
    const index = folderList.findIndex(f => f.id === selectFolder);
    const toIndex = folderList.findIndex(f => f.id === toFoldId);
    const findIndex = folderList[index].list.findIndex(
      m => m.id === selectData.id
    );
    const [data] = folderList[index].list.splice(findIndex, 1);
    folderList[toIndex].list.push(data);

    setFolderList(folderList);
    setFolderListSync(folderList);
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

  const onModalFormFinish = ({ value }: { value: string }) => {
    const foldName = value.trim();
    onCreateFolder(foldName);
    handleModalCancel();
  };

  const onSeltModalFormFinish = ({ value }: { value: string }) => {
    handleMoveTabsToFolder(value);
    message.success({ content: '移动成功' });
    handleSeltModalCancel();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };
  const handleSeltModalCancel = () => {
    setSeltModalVisible(false);
  };

  const onCommandOk = async ({ action, data: sg }: OkParams) => {
    switch (action) {
      case MOVETOFOLDER:
        break;
      case MOVETOTABS:
        // 如果文件夹折叠，则打开
        const folderId = await folderToFindTagId(sg);
        const isFolderShow = showCurrentFolder.includes(folderId);

        if (!isFolderShow) {
          setShowCurrentFolder([...showCurrentFolder, folderId]);
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
    <DropdownMenu
      menuList={dropMenus}
      delValue={DELETE}
      onClick={onDropMenuClick}
      onHide={onDropMenuHide}
    >
      <div className="app-container">
        <div className="header" onContextMenu={clearContextMenu}>
          <div className="header-logo"></div>
          <h1>Potato Tag</h1>
          <Switch></Switch>
        </div>

        <section className="content" onContextMenu={onBackContextMenu}>
          {folderList.length > 0 && (
            <Collapse
              className="option-container"
              ghost
              expandIconPosition="right"
              activeKey={
                showCurrentFolder.length
                  ? showCurrentFolder
                  : folderList.map(m => m.id)
              }
              onChange={onChangeCollapse}
              // expandIcon={({ isActive }) => (
              //   <CaretRightOutlined
              //     className="option-title-icon"
              //     rotate={isActive ? 90 : 0}
              //   />
              // )}
            >
              {folderList.map((folder: Folder, i) => (
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
                        onContextMenu={() =>
                          onTabsItemContextMenu(data, folder)
                        }
                      >
                        <div
                          className="tabs-item"
                          {...{ [MOVE_MARK]: data.id }}
                        >
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
          )}
        </section>

        <footer className="main-footer">
          <div className="grid">
            <div className="unit whole center-on-mobiles">
              <p className="text-center text-muted">&copy; potato tag</p>
            </div>
          </div>
        </footer>

        <InputModal
          visible={modalVisible}
          title={modalTitle}
          initialValue={defaltAddFoldValue}
          onFinish={onModalFormFinish}
          onCancel={handleModalCancel}
        />

        <SelectModal
          visible={seltModalVisible}
          initialValue={defaltRemoveFoldValue}
          options={
            folderList
              ? folderList.map(m => ({ label: m.name, value: m.id }))
              : []
          }
          onCancel={handleSeltModalCancel}
          onFinish={onSeltModalFormFinish}
        />

        <CommandPalette
          visible={commandVisible}
          onOk={onCommandOk}
          onCancel={onCommandCancel}
        />
      </div>
    </DropdownMenu>
  );
};

export default Options;
