import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components';
import { Folder, TabsData } from '@/types/common';
import { initData, setFolderListSync, getFolderListSync } from '@/utils/utils';
import './index.scss';

interface MapData {
  [name: string]: string;
}
interface InputDom {
  select: () => void;
}

interface Props {}

const Popup: React.FC<Props> = () => {
  const successMsg = '书签已成功保存 (•̀∀•́)';
  const errorMsg = '抱歉，保存时出错了 ╥﹏╥';
  const failMsg = '抱歉，无法提取该页面的url';
  const [currentTabs, setCurrentTabs] = useState<TabsData>();
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [fsIdMapName, setMapFsIdToName] = useState<MapData>({});
  const [choiceFolder, setChoiceFolder] = useState('');
  const [showFolderList, setShowFolderList] = useState(false);

  useEffect(() => {
    fetchFolderList();
  }, []);

  useEffect(() => {
    if (currentTabs && folderList.length) {
      folderToFindChoiceFolder(folderList);
    }
  }, [currentTabs, folderList]);

  useEffect(() => {
    if (choiceFolder) {
      saveTabs(choiceFolder);
    }
  }, [choiceFolder]);

  const handleQueryTabs = async () => {
    const [activeTab]: TabsData[] = (await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })) as any[];

    let findTab = null;
    for (let i = 0; i < folderList.length; i++) {
      const folder = folderList[i];
      findTab = folder.list.find(m => m.url === activeTab.url);

      if (findTab) break;
    }

    if (findTab) {
      setCurrentTabs(findTab);
    } else {
      setCurrentTabs(activeTab);
    }

    const input = document.querySelector('.input') as InputDom & Element;
    input?.select();
  };

  const fetchFolderList = async () => {
    const data = await getFolderListSync();

    if (data.length) {
      handleQueryTabs();
      setFolderList(data);
      handleMapFsIdToName(data);
    } else {
      await initData();
      fetchFolderList();
    }
  };

  const onInputBlur = (e: any) => {
    const value = e.target.value.trim();

    if (value && currentTabs) {
      currentTabs.title = value;
      setCurrentTabs(currentTabs);
      saveTabs(choiceFolder);
    }
  };

  const onKeyDown = (e: any) => {
    const { keyCode } = e;

    if (keyCode === 13) {
      onInputBlur(e);
      window.close();
    }
  };

  const folderToFindChoiceFolder = (folders: Folder[]) => {
    if (currentTabs) {
      let find;
      for (let i = 0; i < folders.length; i++) {
        const list = folders[i].list;
        find = list.find(s => s.url === currentTabs.url);
        if (find) {
          setChoiceFolder(folders[i].id);
          return;
        }
      }

      if (!find) setChoiceFolder(folders[0].id); // 默认展示第一个文件
    } else {
      setChoiceFolder(folders[0].id); // 默认展示第一个文件
    }
  };

  const handleMapFsIdToName = (folders: Folder[]) => {
    const obj: MapData = {};
    folders.forEach(s => {
      obj[s.id] = s.name;
    });

    setMapFsIdToName(obj);
  };

  const saveTabs = (id?: string) => {
    if (currentTabs) {
      if (folderList.length > 0) {
        const findFolder = folderList.find(s => s.id === id) || folderList[0];
        const findIndex = findFolder.list.findIndex(m => m.url === currentTabs.url);

        if (findIndex === -1) {
          currentTabs.id = uuidv4();
          findFolder.list.push(currentTabs);
        } else {
          findFolder.list.splice(findIndex, 1, currentTabs);
        }
        setFolderListSync(folderList);
      }
    }
  };

  const removeTabs = (folderId: string) => {
    const findFolder = folderList.find(m => m.id === folderId) || folderList[0];
    const findIndex = findFolder.list.findIndex(m => m.url === currentTabs?.url);

    if (findIndex > -1) {
      findFolder.list.splice(findIndex, 1);
      setFolderListSync(folderList);
    }
  };

  const onDelete = () => {
    removeTabs(choiceFolder);
    window.close();
  };

  const onChoiceFolder = (e: any) => {
    const { id } = e.target.dataset;

    removeTabs(choiceFolder);
    setChoiceFolder(id);
    setShowFolderList(false);
  };

  return (
    <div className="popup-container">
      <div className="header">
        <div className="left">
          <div className="logo-wrap">
            {/* <img src="./icon-64.png" alt="logo" /> */}
            <div className={`logo-icon ${currentTabs ? 'success' : 'error'}`}></div>
          </div>
          {currentTabs ? '已加入书签' : '加入书签失败'}
        </div>
        <a className="setting-icon" href="/options.html" target="_blank">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M510.37806 337.803609c-98.010221 0-177.748287 78.842673-177.748287 175.75284 0 96.91426 79.738066 175.763073 177.748287 175.763073 9.537214 0 19.620873-0.978281 31.797194-3.088338 18.196431-3.281743 30.290887-20.538779 26.963095-38.471197-2.924609-15.732309-16.693194-27.152407-32.747845-27.152407-2.071172 0-4.15974 0.196475-6.123464 0.563842-7.937786 1.402953-14.233166 2.056845-19.807115 2.056845-61.159942 0-110.915136-49.201585-110.915136-109.671819 0-60.467163 49.679469-109.661585 110.747313-109.661585 61.116963 0 110.832248 49.194422 110.832248 109.661585 0 5.892197-0.656963 12.0832-2.088568 19.531845-3.327792 17.928325 8.769734 35.189454 26.959002 38.464033 2.006703 0.360204 4.045129 0.546446 6.070252 0.546446 16.204054 0 30.019711-11.43033 32.832779-27.116591 2.13871-11.45182 3.13848-21.435195 3.13848-31.41857 0.042979-46.873564-18.435884-90.990341-52.033074-124.223233C602.407056 356.106464 557.790906 337.803609 510.37806 337.803609z"
              p-id="23590"
            ></path>
            <path
              d="M938.476161 432.79917c-2.185782-11.426237-11.037381-20.499893-22.563902-23.12058-41.909505-9.508561-76.781734-34.929534-98.185206-71.550593-21.334911-36.560684-26.191522-79.099523-13.68979-119.709429 3.52836-11.123338 0.007163-23.235191-8.951883-30.840402-41.860387-35.721573-89.536222-62.938448-141.695163-80.885192-3.152806-1.088798-6.437619-1.639337-9.776667-1.639337-8.256034 0-16.182564 3.431146-21.724791 9.376555-29.236881 31.04404-68.840878 48.140417-111.5107 48.140417-42.673915 0-82.305541-17.125029-111.607914-48.230468-7.877411-8.333806-20.510126-11.512195-31.580253-7.726985-52.483328 18.171871-100.131535 45.416376-141.640927 80.988546-8.815783 7.591909-12.322653 19.620873-8.934486 30.67258 12.586666 40.645722 7.759731 83.180468-13.597693 119.78106-21.306258 36.5965-56.149834 62.006216-98.17395 71.561849-11.540847 2.709715-20.396539 11.812023-22.559808 23.166629-5.228071 27.169803-7.877411 54.346769-7.877411 80.770582 0 26.426883 2.64934 53.603849 7.873318 80.763418 2.174526 11.411911 11.023054 20.488637 22.552645 23.12058 41.913599 9.512654 76.785827 34.922371 98.19237 71.547523 21.349237 36.59343 26.177196 79.128175 13.583366 119.795387-3.363607 10.969842 0.121773 23.013133 8.973372 30.758538 41.84913 35.707246 89.494267 62.920028 141.662417 80.902588 11.466146 3.885494 23.738657 0.549515 31.454386-7.680936 29.29828-31.091112 68.925812-48.216141 111.593588-48.216141s82.302471 17.125029 111.560842 48.183396c5.556553 5.955642 13.494339 9.380648 21.782096 9.380648 3.27765 0 6.537903-0.520863 9.829879-1.599428 52.126194-17.968234 99.774401-45.184085 141.652184-80.912821 8.791224-7.577582 12.308327-19.628036 8.94165-30.758538-12.597923-40.678468-7.745405-83.20605 13.672394-119.773897 21.324678-36.625152 56.192813-62.030775 98.19237-71.547523 11.390421-2.592035 20.23588-11.633968 22.549575-23.106254 5.223978-27.184129 7.870248-54.358025 7.870248-80.770582C946.342316 487.171522 943.697069 459.965903 938.476161 432.79917zM728.572524 789.878798c-26.02677 20.157085-54.736649 36.553521-85.487 48.818869-36.682457-32.144094-83.60207-49.779753-132.792399-49.779753-48.926316 0-95.838765 17.635659-132.767839 49.786916-30.744211-12.262278-59.45716-28.655643-85.491093-48.812729 9.894348-47.441499 1.889023-96.449679-22.763446-138.627291-24.448832-41.966811-63.427588-73.339332-110.186542-88.840374-2.381234-16.343223-3.584642-32.758078-3.584642-48.869011 0-16.043395 1.203408-32.451086 3.584642-48.851615 46.612621-15.389502 85.584214-46.758953 110.186542-88.850607 24.523533-42.024116 32.525788-91.033319 22.74912-138.620128 26.0237-20.149922 54.735625-36.543288 85.494163-48.815799 36.821627 32.201399 83.73817 49.861618 132.778072 49.861618 49.194422 0 96.109941-17.635659 132.792399-49.779753 30.751375 12.269441 59.45716 28.662807 85.48086 48.812729-9.809413 47.63388-1.835811 96.634898 22.667256 138.620128 24.445762 41.966811 63.416332 73.343425 110.182448 88.850607 2.381234 16.386202 3.584642 32.801057 3.584642 48.940642 0.143263 15.443737-1.031493 31.797194-3.499707 48.701189-46.763047 15.504112-85.73771 46.873564-110.186542 88.836281C726.84416 693.189665 718.845998 742.190683 728.572524 789.878798z"
              p-id="23591"
            ></path>
          </svg>
        </a>
      </div>

      <div className="main">
        {currentTabs ? (
          <div className="content-wrap">
            <div className="content">
              <input className="input" defaultValue={currentTabs.title} onBlur={onInputBlur} onKeyDown={onKeyDown} />
              <div
                className="folder-list-wrap"
                style={{
                  height: showFolderList ? `${folderList?.length * 35}px` : '',
                }}
              >
                <div
                  className="folder-list-item"
                  onClick={() => {
                    setShowFolderList(!showFolderList);
                  }}
                >
                  <div className="folder-name">{fsIdMapName[choiceFolder] || ''}</div>
                  <svg
                    className="down-icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="24544"
                  >
                    <path d="M232 392L512 672l280-280z" fill="#252525" p-id="24545"></path>
                  </svg>
                </div>

                <div className="folder-select-list-wrap" hidden={!showFolderList} onClick={onChoiceFolder}>
                  {folderList?.map((m, i) => (
                    <div className="folder-select-list-item" key={`${m.id}`} data-id={m.id}>
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="btns-wrap">
              <Button className="finish-btn" type="primary" onClick={() => window.close()}>
                完成
              </Button>
              <Button className="remove-btn" onClick={onDelete}>
                移除
              </Button>
            </div>
          </div>
        ) : (
          <div className="tips">╥﹏╥ 抱歉，无法提取该页面的url</div>
        )}
      </div>
    </div>
  );
};

export default Popup;
