import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import { Modal, Input, Form } from 'antd';

import Button from '../Button';
import './index.scss';

interface Props {
  visible: boolean;
  title?: string;
  initialValue?: string;
  okText?: string;
  okType?: string;
  onCancel?: () => void;
  onFinish?: ({ value }: { value: string }) => void;
}

const InputModal: React.FC<Props> = ({
  visible,
  title = '标题',
  initialValue = '',
  okText = '确定',
  okType = 'primary',
  onCancel,
  onFinish,
}: Props) => {
  const [form] = Form.useForm();
  const [inptValue, setInptValue] = useState('');

  useEffect(() => {
    if (!visible && form) form.resetFields();

    if (visible) {
      setTimeout(() => {
        const modalInput: any = document.querySelector('#modalInput');
        modalInput && modalInput.select();
      });
    }
  }, [visible, form]);

  const onValuesChange = ({ value }: { value: string }) => {
    setInptValue(value.trim());
  };

  return (
    <Modal
      visible={visible}
      forceRender
      destroyOnClose={true}
      width={340}
      title={title}
      onCancel={onCancel}
      footer={[
        <div className="modal-footer" key="modal-footer">
          <Button
            key="submit"
            type={okType}
            size="small"
            disabled={!inptValue}
            onClick={() => form.submit()}
          >
            {okText}
          </Button>
        </div>,
      ]}
    >
      <Form
        form={form}
        initialValues={{
          value: initialValue,
        }}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
      >
        <Form.Item name="value" noStyle>
          <Input
            id="modalInput"
            // autoFocus onFocus={onFocus}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InputModal;
