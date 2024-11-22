import NoBody from '@/pages/Interface/Postman/component/BodyTable/NoBody';
import JsonBody from '@/pages/UIPlaywright/UICase/EditCase/StepFunc/API/Body/JsonBody';
import { FormInstance, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  apiForm: FormInstance<any>;
  read: boolean;
}

const Index: FC<SelfProps> = ({ apiForm, read }) => {
  const [bodyType, setBodyType] = useState(0);
  useEffect(() => {
    if (apiForm.getFieldValue('bodyType')) {
      setBodyType(apiForm.getFieldValue('bodyType'));
    }
  }, []);
  const BodyMap = () => {
    switch (bodyType) {
      case 0:
        return <NoBody />;
      case 1:
        return <JsonBody apiForm={apiForm} read={read} />;
    }
  };
  const onGroupChange = (e: RadioChangeEvent) => {
    setBodyType(e.target.value);
    apiForm.setFieldValue('bodyType', e.target.value);
  };

  return (
    <>
      <Radio.Group
        defaultValue={bodyType}
        value={bodyType}
        onChange={onGroupChange}
      >
        <Radio value={0}>none</Radio>
        <Radio value={1}>json</Radio>
      </Radio.Group>
      {BodyMap()}
    </>
  );
};

export default Index;
