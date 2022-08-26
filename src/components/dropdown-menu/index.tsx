import React, { ReactElement, useEffect, useState } from 'react';
import './index.scss';

interface Menu {
  text: string;
  value: string;
}

interface Props {
  children: ReactElement<any, any>;
  menuList: Menu[];
  delValue: string;
  onClick: (value: string) => void;
  onHide?: () => void;
}

export const DropdownMenu: React.FC<Props> = ({
  children,
  menuList,
  delValue,
  onClick,
  onHide,
}: Props) => {
  const [isShow, setIsShow] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const hide = () => {
    setIsShow(false);
    onHide && onHide();
  };

  const onContextMenu = (e: any) => {
    e.preventDefault();
    const { pageX, pageY } = e;
    show(pageX, pageY);
  };

  const show = (x: number, y: number) => {
    setIsShow(true);

    let left,
      top = 0;
    const menu = document.querySelector('#dropdownMenu') as HTMLDivElement;
    const { innerWidth, innerHeight } = window;
    const { offsetWidth, offsetHeight } = menu;

    left = x + offsetWidth > innerWidth ? x - offsetWidth : x;
    top = y + offsetHeight > innerHeight ? y - offsetHeight : y;

    setTop(top);
    setLeft(left);
  };

  const onMenuClick = (e: any) => {
    const { value } = e.target.dataset;
    onClick(value);
  };

  return (
    <div
      className="dropdown-menu-container"
      onClick={hide}
      onContextMenu={onContextMenu}
    >
      {children}
      <div style={{ position: 'absolute', top: '0', left: '0', width: '100%' }}>
        <div>
          <div
            id="dropdownMenu"
            className="dropdown-menu"
            style={{
              top,
              left,
              display: isShow && menuList.length ? 'block' : 'none',
            }}
          >
            <ul className="dropdown-menu-root" onClick={onMenuClick}>
              {menuList &&
                menuList.map(m => (
                  <div key={m.value}>
                    {m.value !== delValue ? (
                      <li className="dropdown-menu-item" data-value={m.value}>
                        {m.text}
                      </li>
                    ) : (
                      <>
                        <li className="dropdown-menu-divider"></li>
                        <li
                          className="dropdown-menu-item dropdown-menu-danger"
                          data-value={m.value}
                        >
                          {m.text}
                        </li>
                      </>
                    )}
                  </div>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
