import React, { ReactElement, useState } from 'react';
import './index.scss';

interface Props {}

const DropdownMenu: React.FC<Props> = ({}: Props) => {
  const ModalClass = 'modal';
  const [left, setLeft] = useState(0);

  return (
    <div>
      <div className={`${ModalClass}-root`}>
        <div className={`${ModalClass}-mask`}></div>
        <div className={`${ModalClass}-wrap`}>
          <div className={`${ModalClass}-wrapper`}>
            <div className={`${ModalClass}-content`}>
              <div className={`${ModalClass}-header`}>
                <div className={`${ModalClass}-title`}>标题</div>
              </div>
              <div className={`${ModalClass}-body`}>
                <input className="input-borderless" type="text" value={123} />
              </div>
              <div className={`${ModalClass}-footer`}>
                <div className="footer">
                  <button className="button">确定</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
