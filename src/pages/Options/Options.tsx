import React, { useEffect, useState } from 'react';
import { Sign, TabsData } from '../../types/sign';
import DropdownMenu from '../components/DropdownMenu';
import {
  setFIdAsync,
  getFIdAsync,
  getSignAndMapSync,
  setSignSync,
  getStorageAsync,
} from '../../utils/utils';
import './index.scss';

interface Props {}

interface Menu {
  text: string;
  value: string;
}

const Options: React.FC<Props> = () => {
  const [sign, setSign] = useState<any>();
  const [signMap, setSignMap] = useState<any>({});
  const [folderId, setFolderId] = useState('001');
  const [editFolderId, setEditFolderId] = useState('');
  const [isAddFolder, setIsAddFolder] = useState(false);
  const [dropMenus, setDropMenus] = useState<Menu[]>([]);
  const [selectData, setSelectData] = useState<TabsData>();

  const RENAME = 'rename';
  const DELETE = 'delete';
  const signDropMenus = [
    { text: '重命名', value: RENAME },
    // { text: '移动', value: 'moveto' },
    { text: '删除', value: DELETE },
  ];
  const folderDropMenus = [
    { text: '重命名', value: RENAME },
    { text: '删除', value: DELETE },
  ];

  useEffect(() => {
    getSign();
  }, []);

  const getSign = async () => {
    const { sign, signMap } = await getStorageAsync(['sign', 'signMap']);
    console.log('sign: ', sign);
    console.log('signMap: ', signMap);
    setSign(sign);
    setSignMap(signMap);
    setFIdAsync('001');
  };

  const showContextMenu = (data: TabsData) => {
    setDropMenus(signDropMenus);
    setSelectData(data);
  };

  const onDropMenuClick = (val: string) => {
    if (selectData) {
      switch (val) {
        case RENAME:
          toEditSigTitle(selectData.id);
          break;
        case DELETE:
          toDelSign(selectData.id);
          break;

        default:
          break;
      }
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
    console.log('handleOnDelSign: ', id);
    toDelSign(id);
  };

  const onSignTitleClick = (e: any) => {
    if (e) {
      const { dataset } = e && e.target;
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

  const handleToAddFolder = () => {
    setIsAddFolder(true);
  };

  const index = signMap[folderId] || 0;
  const list = sign && sign[index] ? sign[index].list : [];

  return (
    <DropdownMenu
      menuList={dropMenus}
      delValue={DELETE}
      onClick={onDropMenuClick}
      onHide={onDropMenuHide}
    >
      <div className="app-container">
        <div className="grid">
          <div className="unit whole center-on-mobiles">
            <div className="heading">
              <h1>土豆签</h1>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="option-container">
            <div className="unit whole center-on-mobiles">
              <div className="option">
                <div className="radio-group"></div>
              </div>

              <div id="options" className="option-wrap">
                {list.map((data: TabsData) => (
                  <div
                    key={data.id}
                    className="sign-item-link"
                    title={data.description}
                    onClick={() => onSignItemClick(data)}
                    onContextMenu={() => showContextMenu(data)}
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
          </div>

          {/* <div className="menu-container">
            <div className="menu-area">
              <div id="menu-list" className="menu-list">
                {sign &&
                  sign.map((data: Sign) => (
                    <div
                      key={data.id}
                      className={`menu-item ${
                        data.id === folderId ? 'menu-active-item' : ''
                      }`}
                      data-dropdown-type="folder"
                      data-id={data.id}
                      onClick={handleToChoicefolder}
                    >
                      {data.id === '001' ? '默认收藏夹' : data.name}
                    </div>
                  ))}
                {isAddFolder && (
                  <div className="menu-item menu-active-item">
                    <input id="addItem" type="text" autoFocus />
                  </div>
                )}
                <div
                  className="menu-item"
                  data-type="add"
                  onClick={handleToAddFolder}
                >
                  <svg
                    // t="1636131075814"
                    className="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2410"
                    width="64"
                    height="64"
                  >
                    <path
                      d="M874.666667 469.333333H554.666667V149.333333c0-23.466667-19.2-42.666667-42.666667-42.666666s-42.666667 19.2-42.666667 42.666666v320H149.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667s19.2 42.666667 42.666666 42.666667h320v320c0 23.466667 19.2 42.666667 42.666667 42.666666s42.666667-19.2 42.666667-42.666666V554.666667h320c23.466667 0 42.666667-19.2 42.666666-42.666667s-19.2-42.666667-42.666666-42.666667z"
                      p-id="2411"
                      fill="#ffffff"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div> */}
        </section>

        <footer className="main-footer">
          <div className="grid">
            <div className="unit whole center-on-mobiles">
              <p className="text-center text-muted">&copy; Potato Sign</p>
            </div>
          </div>
        </footer>
      </div>
    </DropdownMenu>
  );
};

export default Options;
