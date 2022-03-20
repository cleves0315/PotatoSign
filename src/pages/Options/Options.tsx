import { v4 as uuidv4 } from 'uuid';
import { useHotkeys } from 'react-hotkeys-hook';
import { Collapse, Divider, Input, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  EditOutlined,
  CaretRightOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { Sign, TabsData } from '../../types/sign';
import DropdownMenu from '../../components/DropdownMenu';
import InputModal from '../../components/InputModal';
import SelectModal from '../../components/SelectModal';
import CommandPalette from '../../components/CommandPalette';
import { initSign, setSignSync, getStorageAsync } from '../../utils/utils';

import './index.scss';

const { Panel } = Collapse;

interface Props {}

interface Menu {
  text: string;
  value: string;
}

const Options: React.FC<Props> = () => {
  let isSignDropMenus = false;
  const CREATE = 'create';
  const RELODAD = 'reload';
  const RENAME = 'rename';
  const MOVETO = 'moveto';
  const DELETE = 'delete';
  const COMMAND = 'command';
  const defaltAddFoldValue = '新建文件夹';
  const defaltRemoveFoldValue = '001';
  const signDropMenus = [
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

  const [sign, setSign] = useState<Sign[]>([]);
  const [editSignId, setEditSignId] = useState('');
  const [dropMenus, setDropMenus] = useState<Menu[]>([]);
  const [selectData, setSelectData] = useState<TabsData | any>({});
  const [selectFolder, setSelectFolder] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [seltModalVisible, setSeltModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [isOpenEditFolder, setIsOpenEditFolder] = useState('');
  const [confirmDelSign, setConfirmDelSign] = useState('');
  const [confirmDelFolder, setConfirmDelFolder] = useState('');
  const [commandVisible, setCommandVisible] = useState(false);

  useHotkeys('ctrl+k,command+k', () => {
    setCommandVisible(true);
  });

  useEffect(() => {
    getSign();
    // chrome.storage.local.clear();
  }, []);

  const getSign = async () => {
    const { sign } = await getStorageAsync(['sign']);
    console.log('sign: ', sign);

    if (!sign) {
      initSign();
    } else {
      setSign(sign);
    }
  };

  const onSignItemContextMenu = (data: TabsData, sign: Sign) => {
    console.log('onSignItemContextMenu: ', data, sign);
    isSignDropMenus = true;
    setDropMenus(signDropMenus);
    setSelectData(data);
    setSelectFolder(sign.id);
  };

  const onBackContextMenu = () => {
    if (!isSignDropMenus) {
      setDropMenus(backDropMenus);
    } else {
      isSignDropMenus = false;
    }
  };

  const clearContextMenu = () => {
    setDropMenus([]);
  };

  const onDropMenuClick = (val: string) => {
    switch (val) {
      case RENAME:
        if (selectData) setEditSignId(selectData.id);
        break;
      case DELETE:
        if (selectData) toDelSign(selectData.id, selectFolder);
        break;
      case CREATE:
        showCreateFolderModal();
        break;
      case MOVETO:
        showMoveSignModal();
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
      for (let i = 0; i < sign.length; i++) {
        const folder = sign[i];
        if (folder.id === isOpenEditFolder) {
          folder.name = value;
          break;
        }
      }
      setSign(sign);
      setSignSync(sign);
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

  const onSignItemClick = (data: TabsData) => {
    const { url } = data;
    window.open(url);
  };

  const handleOnDelSign = (e: any, signId: string, folderId: string) => {
    e.stopPropagation();

    if (confirmDelSign === signId) {
      toDelSign(signId, folderId);
    } else {
      setConfirmDelSign(signId);
    }
  };

  const onSignTitleClick = (e: any, signId: string, folderId: string) => {
    e.stopPropagation();
    setSelectFolder(folderId);
    setEditSignId(signId);
  };

  const toDelFolder = (folderId: string) => {
    const index = sign.findIndex(s => s.id === folderId);
    sign.splice(index, 1);

    setSign([...sign]);
    setConfirmDelFolder('');
    setSignSync(sign);
  };

  const toDelSign = async (id: string, folderId: string) => {
    try {
      const index = sign.findIndex(s => s.id === folderId);
      const signList = sign[index].list;
      const findIndex = signList.findIndex((m: TabsData) => m.id === id);

      signList.splice(findIndex, 1);

      setSign([...sign]);
      setConfirmDelSign('');
      await setSignSync(sign);
    } catch (error) {
      console.error('handleOnDelSign: \n', error);
    }
  };

  const showCreateFolderModal = () => {
    // 生成弹窗
    setModalVisible(true);
    setModalTitle('新建收藏夹');
  };

  const showMoveSignModal = () => {
    // 生成弹窗
    setSeltModalVisible(true);
  };

  const onCreateFolder = (name: string) => {
    const folder: Sign = {
      id: uuidv4(),
      list: [],
      name,
    };

    sign.push(folder);
    setSign(sign);
    setSignSync(sign);
  };

  const onMoveSignToFolder = (toFoldId: string) => {
    const index = sign.findIndex(s => s.id === selectFolder);
    const toIndex = sign.findIndex(s => s.id === toFoldId);
    const findIndex = sign[index].list.findIndex(m => m.id === selectData.id);
    const [data] = sign[index].list.splice(findIndex, 1);
    sign[toIndex].list.push(data);

    setSign(sign);
    setSignSync(sign);
  };

  const handleToCancelEdit = async (e: any) => {
    const { value } = e.target;
    const index = sign.findIndex(s => s.id === selectFolder);
    const { list } = sign[index];

    list.forEach((m: TabsData) => {
      if (m.id === editSignId) {
        m.title = value;
      }
    });

    setEditSignId('');
    setSignSync(sign);
  };

  const onModalFormFinish = ({ value }: { value: string }) => {
    const foldName = value.trim();
    onCreateFolder(foldName);
    handleModalCancel();
  };

  const onSeltModalFormFinish = ({ value }: { value: string }) => {
    onMoveSignToFolder(value);
    handleSeltModalCancel();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };
  const handleSeltModalCancel = () => {
    setSeltModalVisible(false);
  };

  const onCancelCommand = () => {
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
          <h1>Potato tag</h1>
        </div>
        {/* <div className="grid">
          <div className="unit whole center-on-mobiles">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <img
                width="35"
                height="35"
                src="https://www.baidu.com/favicon.ico"
                alt=""
              />
              <Input
                onPressEnter={(e: any) => {
                  window.open(`http://www.baidu.com/s?wd=${e.target.value}`);
                }}
              />
            </div>
          </div>
        </div> */}

        <section className="content" onContextMenu={onBackContextMenu}>
          {sign.length > 0 && (
            <Collapse
              className="option-container"
              ghost
              expandIconPosition="right"
              defaultActiveKey={sign.map(m => m.id)}
              // expandIcon={({ isActive }) => (
              //   <CaretRightOutlined
              //     className="option-title-icon"
              //     rotate={isActive ? 90 : 0}
              //   />
              // )}
            >
              {sign.map((s: Sign, i) => (
                <Panel
                  showArrow={false}
                  header={
                    <div
                      className="option-title-container unit whole center-on-mobiles"
                      data-folderid={s.id}
                    >
                      {isOpenEditFolder !== s.id ? (
                        <>
                          <div className="option-title">{s.name}</div>
                          <div
                            className="del-wrap"
                            data-confirm={confirmDelFolder === s.id}
                            onClick={e => handleClickDelFolder(e, s.id)}
                          >
                            <DeleteOutlined className="del-btn" />
                            {/* <Popover
                              placement="bottom"
                              title={'text'}
                              content={
                                <div>
                                  <p>重命名</p>
                                  <p>删除</p>
                                </div>
                              }
                              trigger="click"
                            >
                              <div
                                style={{
                                  color: '#fff',
                                  fontSize: '16px',
                                  transform: 'translateY(-6px)',
                                }}
                              >
                                ...
                              </div>
                            </Popover> */}
                          </div>
                        </>
                      ) : (
                        <Input
                          id={`titleInput${s.id}`}
                          autoFocus
                          className="option-title-input"
                          defaultValue={s.name}
                          onFocus={() =>
                            onFocusInptOptnTitle(`titleInput${s.id}`)
                          }
                          onPressEnter={onCancelEditFoldName}
                          onBlur={onCancelEditFoldName}
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </div>
                  }
                  key={s.id}
                  extra={
                    <div>
                      <EditOutlined
                        className="option-title-icon edit-icon"
                        onClick={e => handleOpenEditFolder(e, s.id)}
                      />
                    </div>
                  }
                >
                  <div className="option-wrap">
                    {s.list.map((data: TabsData) => (
                      <div
                        key={data.id}
                        className="sign-item-link"
                        title={data.title}
                        onClick={() => onSignItemClick(data)}
                        onContextMenu={() => onSignItemContextMenu(data, s)}
                      >
                        <div
                          className="sign-item"
                          data-id={data.id}
                          data-url={data.url}
                          data-dropdown-type="sign"
                        >
                          <div
                            className="del-wrap"
                            data-confirm={confirmDelSign === data.id}
                            onClick={(e: any) =>
                              handleOnDelSign(e, data.id, s.id)
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
                          {editSignId === data.id ? (
                            <div className="title" data-type="input">
                              <Input
                                id={`titleInput${data.id}`}
                                data-id={data.id}
                                defaultValue={data.title}
                                autoFocus
                                onClick={e => e.stopPropagation()}
                                onBlur={handleToCancelEdit}
                                onPressEnter={handleToCancelEdit}
                                onFocus={() =>
                                  onFocusInptOptnTitle(`titleInput${data.id}`)
                                }
                                // onChange={onChangeSignTitle}
                              />
                            </div>
                          ) : (
                            <div
                              className="title"
                              data-type="text"
                              onClick={(e: any) =>
                                onSignTitleClick(e, data.id, s.id)
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
          options={sign ? sign.map(m => ({ label: m.name, value: m.id })) : []}
          onCancel={handleSeltModalCancel}
          onFinish={onSeltModalFormFinish}
        />
        <CommandPalette visible={commandVisible} onCancel={onCancelCommand} />
      </div>
    </DropdownMenu>
  );
};

export default Options;
