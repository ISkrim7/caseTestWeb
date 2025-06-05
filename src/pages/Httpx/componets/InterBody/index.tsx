import APIFormData from '@/pages/Httpx/componets/InterBody/APIFormData';
import JsonBody from '@/pages/Httpx/componets/InterBody/JsonBody';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { ProCard, ProFormSelect } from '@ant-design/pro-components';
import { FormInstance, Radio, Space } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const Index: FC<SelfProps> = (props) => {
  const [bodyType, setBodyType] = useState(0);
  useEffect(() => {
    const t = props.form.getFieldValue('body_type');
    if (t) {
      setBodyType(t);
    }
  }, []);
  const BodyMap = () => {
    switch (bodyType) {
      case 0:
        return (
          <ProCard
            style={{ height: '10vh', lineHeight: '10vh', textAlign: 'center' }}
          >
            This request does not have a body
          </ProCard>
        );
      case 1:
        return <JsonBody {...props} />;
      case 2:
        return <APIFormData type={'form_data'} {...props} />;
      case 3:
        return <APIFormData type={'urlencoded'} {...props} />;
    }
  };

  const onGroupChange = async (e: RadioChangeEvent) => {
    setBodyType(e.target.value);
    props.form.setFieldValue('body_type', e.target.value);
    //await FormEditableOnValueChange(props.form, 'body_type', false);
  };
  return (
    <>
      <Radio.Group
        defaultValue={bodyType}
        value={bodyType}
        onChange={onGroupChange}
      >
        <Radio value={0}>none</Radio>
        <Radio value={2}>form-data</Radio>
        <Radio value={3}>urlencoded</Radio>
        <Space>
          <Radio value={1}>raw</Radio>
          <ProFormSelect
            hidden={bodyType !== 1}
            noStyle
            onChange={async (value) => {
              props.form.setFieldValue('raw_type', value);
              await FormEditableOnValueChange(props.form, 'raw_type', false);
            }}
            options={[
              {
                label: 'JSON',
                value: 'json',
              },
              {
                label: 'Text',
                value: 'text',
              },
            ]}
            name={'raw_type'}
          />
        </Space>
      </Radio.Group>
      {BodyMap()}
    </>
  );
};

export default Index;
