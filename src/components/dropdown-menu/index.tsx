import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';
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

  const handleHide = () => {
    setIsShow(false);
    onHide?.();
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
      onClick={handleHide}
      onContextMenu={onContextMenu}
    >
      {children}
      <div className="dropdown-menu-wrap">
        <div
          id="dropdownMenu"
          className={classNames('dropdown-menu', {
            hide: !isShow || !menuList.length,
          })}
          style={{ top, left }}
        >
          <ul className="dropdown-menu-root" onClick={onMenuClick}>
            {menuList.map(menu => (
              <div key={menu.value}>
                {menu.value !== delValue ? (
                  <li className="dropdown-menu-item" data-value={menu.value}>
                    {menu.text}
                  </li>
                ) : (
                  <>
                    <li className="dropdown-menu-divider"></li>
                    <li
                      className="dropdown-menu-item dropdown-menu-danger"
                      data-value={menu.value}
                    >
                      {menu.text}
                    </li>
                  </>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
