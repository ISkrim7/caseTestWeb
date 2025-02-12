import FormData from '@/pages/Httpx/componets/InterBody/FormData';
import JsonBody from '@/pages/Httpx/componets/InterBody/JsonBody';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { ProCard } from '@ant-design/pro-components';
import { FormInstance, Radio } from 'antd';
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
        return <FormData {...props} />;
    }
  };

  const onGroupChange = (e: RadioChangeEvent) => {
    setBodyType(e.target.value);
    props.form.setFieldValue('body_type', e.target.value);
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
        {/*<Radio value={3}>urlencoded</Radio>*/}
        <Radio value={1}>json</Radio>
      </Radio.Group>
      {BodyMap()}
    </>
  );
};

export default Index;
