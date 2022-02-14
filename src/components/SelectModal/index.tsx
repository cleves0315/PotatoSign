import React, { useEffect, useState } from 'react';
import { Modal, Form, Select } from 'antd';

import Button from '../Button';
import './index.scss';

interface Options {
  label: string;
  value: string;
}

interface Props {
  visible: boolean;
  title?: string;
  options?: Options[];
  initialValue?: string;
  okText?: string;
  okType?: string;
  onCancel?: () => void;
  onFinish?: ({ value }: { value: string }) => void;
}

const InputModal: React.FC<Props> = ({
  visible,
  title = '标题',
  options,
  initialValue = '',
  okText = '确定',
  okType = 'primary',
  onCancel,
  onFinish,
}: Props) => {
  const [form] = Form.useForm();
  const [inptValue, setInptValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!visible && form) form.resetFields();

    if (visible) {
      setTimeout(() => {
        setIsOpen(true);
      }, 180);
    }
  }, [visible, form]);

  const onValuesChange = ({ value }: { value: string }) => {
    setInptValue(value);
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
            // disabled={!inptValue}
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
          <Select
            className="select"
            // open={isOpen}
            size="large"
            options={options}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InputModal;
