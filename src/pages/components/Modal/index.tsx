import React, { useState } from 'react';
import './index.scss';

interface Props {
  visible: boolean;
  title?: string;
  width?: string | number;
  inputValue?: string;
  submitText?: string;
  maxLength?: number;
  maskClosable?: boolean;
  onOk?: (val: string) => void;
  onCancel?: () => void;
}

const DropdownMenu: React.FC<Props> = ({
  visible,
  title,
  width,
  inputValue,
  submitText,
  maxLength,
  maskClosable = true,
  onCancel,
  onOk,
}: Props) => {
  const ModalClass = 'modal';
  const [inputVal, setInputValue] = useState('');

  const onInputChange = (e: any) => {
    const { value } = e.target;
    setInputValue(value);
  };

  const handleOnOk = () => {
    const value = inputVal.trim() || inputValue?.trim() || '';
    onOk && onOk(value);
  };

  const handleOnClickBack = () => {
    maskClosable && handleOnCancel();
  };

  const handleOnCancel = () => {
    console.log('handleOnCancel');
    onCancel && onCancel();
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
          tabIndex={-1}
          role="dialog"
          style={!visible ? { display: 'none' } : {}}
          onClick={handleOnClickBack}
        >
          <div
            className={`${ModalClass}-wrapper`}
            style={modalStyle}
            onClick={e => e.stopPropagation()}
          >
            <div
              tabIndex={0}
              style={{
                width: '0px',
                height: '0px',
                overflow: 'hidden',
                outline: 'none',
              }}
            ></div>
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
                    onClick={handleOnOk}
                  >
                    {submitText || '确定'}
                  </button>
                </div>
              </div>
            </div>
            <div
              tabIndex={0}
              style={{
                width: '0px',
                height: '0px',
                overflow: 'hidden',
                outline: 'none',
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
