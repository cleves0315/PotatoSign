import React, { useEffect, useState } from 'react';
import { Modal, Input, Form } from 'antd';

import { Button } from '..';
import './index.scss';

export interface InputModalProps {
  visible: boolean;
  title?: string;
  initialValue?: string;
  okText?: string;
  okType?: string;
  onCancel?: () => void;
  onFinish?: ({ value }: { value: string }) => void;
}

export const InputModal = ({
  visible,
  title = '标题',
  initialValue = '',
  okText = '确定',
  okType = 'primary',
  onCancel,
  onFinish,
}: InputModalProps) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!visible && form) form.resetFields();

    if (visible) {
      setDisabled(!initialValue);
      setTimeout(() => {
        const modalInput: any = document.querySelector('#modalInput');
        modalInput && modalInput.select();
      });
    }
  }, [visible, form, initialValue]);

  const onValuesChange = ({ value }: { value: string }) => {
    setDisabled(!value.trim());
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
            disabled={disabled}
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
          <Input id="modalInput" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
