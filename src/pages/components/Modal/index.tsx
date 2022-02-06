import React, { useState } from 'react';
import './index.scss';

interface Props {
  visible: boolean;
  title?: string;
  width?: string | number;
  inputValue?: string;
  submitText?: string;
  maxLength?: number;
  onSumbit?: (val: string) => void;
}

const DropdownMenu: React.FC<Props> = ({
  visible,
  title,
  width,
  inputValue,
  submitText,
  maxLength,
  onSumbit,
}: Props) => {
  const ModalClass = 'modal';
  const [inputVal, setInputValue] = useState('');

  const onInputChange = (e: any) => {
    const { value } = e.target;
    setInputValue(value);
  };

  const handleOnSubmit = () => {
    const value = inputVal.trim() || inputValue?.trim() || '';
    onSumbit && onSumbit(value);
  };

  const isBtnDisabled = (): boolean => {
    return !(inputValue?.trim() || inputVal.trim());
  };

  const modalStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
  };

  return (
    <div>
      <div className={`${ModalClass}-root`}>
        {visible && <div className={`${ModalClass}-mask`}></div>}
        <div
          className={`${ModalClass}-wrap`}
          style={!visible ? { display: 'none' } : {}}
        >
          <div className={`${ModalClass}-wrapper`} style={modalStyle}>
            <div className={`${ModalClass}-content`}>
              <div className={`${ModalClass}-header`}>
                <div className={`${ModalClass}-title`}>{title || '标题'}</div>
              </div>
              <div className={`${ModalClass}-body`}>
                <input
                  className="input-borderless"
                  type="text"
                  value={inputValue || inputVal}
                  maxLength={maxLength || 100}
                  onChange={onInputChange}
                />
              </div>
              <div className={`${ModalClass}-footer`}>
                <div className="footer">
                  <button
                    className={`button ${
                      isBtnDisabled() ? 'button-disabled' : ''
                    }`}
                    disabled={isBtnDisabled()}
                    onClick={handleOnSubmit}
                  >
                    {submitText || '确定'}
                  </button>
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
