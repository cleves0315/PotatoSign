import React, { useEffect, useState } from 'react';
import { Modal, Input, Form } from 'antd';
import 'antd/dist/antd.min.css';

import Button from '../components/Button';
import { Sign, TabsData } from '../../types/sign';
import DropdownMenu from '../components/DropdownMenu';
import {
  initSign,
  getSignAndMapSync,
  setSignSync,
  setSignMapSync,
  getStorageAsync,
} from '../../utils/utils';

import './index.scss';
import { nanoid } from 'nanoid';

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
    { text: '刷新页面', value: RELODAD },
  ];

  const [sign, setSign] = useState<any>([]);
  const [signMap, setSignMap] = useState<any>({});
  const [folderId, setFolderId] = useState('001'); // 目前应用在删除标签/修改标签/和render渲染
  const [editFolderId, setEditFolderId] = useState('');
  const [dropMenus, setDropMenus] = useState<Menu[]>([]);
  const [selectData, setSelectData] = useState<TabsData>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    getSign();
  }, []);

  const getSign = async () => {
    const { sign, signMap } = await getStorageAsync(['sign', 'signMap']);
    console.log('sign: ', sign);
    console.log('signMap: ', signMap);

    if (!sign) {
      initSign();
    } else {
      setSign(sign);
      setSignMap(signMap);
    }
  };

  const onSignItemContextMenu = (data: TabsData) => {
    isSignDropMenus = true;
    setDropMenus(signDropMenus);
    setSelectData(data);
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
        if (selectData) toEditSigTitle(selectData.id);
        break;
      case DELETE:
        if (selectData) toDelSign(selectData.id);
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

      default:
        break;
    }
  };

  const onDropMenuHide = () => {
    setDropMenus([]);
  };

  const onSignItemClick = (data: TabsData) => {
    const { url } = data;
    window.open(url);
  };

  const handleOnDelSign = (e: any) => {
    e.stopPropagation();
    const id = e.target.getAttribute('data-id');
    toDelSign(id);
  };

  const onSignTitleClick = (e: any) => {
    if (e) {
      const { dataset } = e.target;
      const { id } = dataset;

      e.stopPropagation();
      toEditSigTitle(id);
    }
  };

  /**
   * 删除当前folder的对应id的标签 并重新渲染
   * @method
   */
  const toDelSign = async (id: string) => {
    const { sign, signMap } = (await getSignAndMapSync()) as any;

    try {
      const index = signMap[folderId];
      const signList = sign[index].list;
      const findIndex = signList.findIndex((m: TabsData) => m.id === id);

      signList.splice(findIndex, 1);

      setSign(sign);
      await setSignSync(sign);
    } catch (error) {
      console.error('handleOnDelSign: \n', error);
    }
  };

  const showCreateFolderModal = () => {
    console.log('showCreateFolderModal');
    // 生成弹窗

    setModalVisible(true);
    setModalTitle('新建收藏夹');
    // onCreateFolder('test-2');
  };

  const showMoveSignModal = () => {
    // 生成弹窗
  };

  const onCreateFolder = (name: string) => {
    const folder: Sign = {
      id: nanoid(),
      list: [],
      name,
    };

    sign.push(folder);
    signMap[folder.id] = sign.length - 1;
    setSign(sign);
    setSignMap(signMap);
    setSignSync(sign);
    setSignMapSync(signMap);
  };

  /**
   * 开启编辑·标签标题
   * @param id
   */
  function toEditSigTitle(id: string) {
    setEditFolderId(id);
  }

  const onChangeSignTitle = async (e: any) => {
    const { value } = e.target;
    console.log('onChangeSignTitle: ', value);
    const index = signMap[folderId];
    const { list } = sign[index];

    list.forEach((m: TabsData) => {
      if (m.id === editFolderId) {
        m.title = value;
      }
    });

    setSign([...sign]);
  };

  const handleToCancelEdit = () => {
    setEditFolderId('');
    setSignSync(sign);
  };

  const handleToChoicefolder = (e: any) => {
    const { id } = e.target.dataset;

    setFolderId(id);
  };

  const handleModalSubmit = (val: string) => {
    console.log('handleModalSubmit: ', val);
  };

  const handleModalCancel = () => {
    console.log('handleModalCancel');
    setModalVisible(false);
  };

  return (
    <DropdownMenu
      menuList={dropMenus}
      delValue={DELETE}
      onClick={onDropMenuClick}
      onHide={onDropMenuHide}
    >
      <div className="app-container">
        <div className="grid" onContextMenu={clearContextMenu}>
          <div className="unit whole center-on-mobiles">
            <div className="heading">
              <h1>Potato Sign</h1>
            </div>
          </div>
        </div>

        <section className="content" onContextMenu={onBackContextMenu}>
          <div className="option-container">
            {sign.map((s: Sign) => (
              <div className="unit whole center-on-mobiles" key={s.id}>
                <div className="option">
                  <div className="option-title">{s.name}</div>
                </div>

                <div className="option-wrap">
                  {s.list.map((data: TabsData) => (
                    <div
                      key={data.id}
                      className="sign-item-link"
                      // title={data.description}
                      title={data.title}
                      onClick={() => onSignItemClick(data)}
                      onContextMenu={() => onSignItemContextMenu(data)}
                    >
                      <div
                        className="sign-item"
                        data-id={data.id}
                        data-url={data.url}
                        data-dropdown-type="sign"
                      >
                        <div
                          className="del-wrap"
                          data-id={data.id}
                          onClick={handleOnDelSign}
                        >
                          <div className="del-btn" data-id={data.id}></div>
                        </div>
                        <div className="icon">
                          <img src={data.favIconUrl} alt="icon" />
                        </div>
                        {/* 编辑·标题 */}
                        {editFolderId === data.id ? (
                          <div className="title" data-type="input">
                            <input
                              data-id={data.id}
                              value={data.title}
                              autoFocus
                              onClick={e => e.stopPropagation()}
                              onBlur={handleToCancelEdit}
                              onChange={onChangeSignTitle}
                            />
                          </div>
                        ) : (
                          <div
                            className="title"
                            data-type="text"
                            onClick={onSignTitleClick}
                          >
                            <p data-id={data.id} title={data.title}>
                              {data.title}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="main-footer">
          <div className="grid">
            <div className="unit whole center-on-mobiles">
              <p className="text-center text-muted">&copy; Potato Sign</p>
            </div>
          </div>
        </footer>

        <Modal
          visible={modalVisible}
          width={340}
          title={modalTitle}
          onOk={() => {}}
          onCancel={handleModalCancel}
          footer={[
            <div className="modal-footer" key="modal-footer">
              <Button key="submit" type="primary" size="small">
                确定
              </Button>
            </div>,
          ]}
        >
          <Form>
            <Input />
          </Form>
        </Modal>
      </div>
    </DropdownMenu>
  );
};

export default Options;
