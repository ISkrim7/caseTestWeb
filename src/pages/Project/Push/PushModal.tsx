import {
  ModalForm,
  ProCard,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { ProFormSelect } from '@ant-design/pro-form';
import { Button } from 'antd';
import { useState } from 'react';

const PushModal = () => {
  const [currentType, setCurrentType] = useState<number>(1);
  const [currentLabel, setCurrentLabel] = useState<string>('目标邮箱');

  return (
    <ProCard>
      <ModalForm
        trigger={
          <Button
            type="primary"
            onClick={() => {
              // setCanSave(false);
              // form.resetFields();
            }}
          >
            Add Push
          </Button>
        }
      >
        <ProFormText label={'配置名'} name={'push_name'} required={true} />
        <ProFormTextArea
          label={'配置描述'}
          name={'push_desc'}
          fieldProps={{ rows: 1 }}
        />
        <ProFormSelect
          required={true}
          label={'推送类型'}
          initialValue={currentType}
          name={'db_type'}
          options={[
            { label: 'Email', value: 1 },
            { label: 'DingTalk', value: 2 },
            { label: 'WeWork', value: 3 },
          ]}
          onChange={(value: number) => {
            setCurrentType(value);
            if (value === 1) {
              setCurrentLabel('目标邮箱');
            } else {
              setCurrentLabel('推送Token');
            }
          }}
        />
        <ProFormText label={currentLabel} name={'push_value'} required={true} />
      </ModalForm>
    </ProCard>
  );
};

export default PushModal;
