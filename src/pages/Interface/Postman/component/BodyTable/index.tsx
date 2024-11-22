import FormBody from '@/pages/Interface/Postman/component/BodyTable/FormBody';
import JSONBody from '@/pages/Interface/Postman/component/BodyTable/JSONBody';
import NoBody from '@/pages/Interface/Postman/component/BodyTable/NoBody';
import { ISteps } from '@/pages/Interface/types';
import { FormInstance, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
  step: number;
}

const Index: FC<SelfProps> = (props) => {
  const { stepForm, stepInfo } = props;
  const [bodyType, setBodyType] = useState(0);

  useEffect(() => {
    if (stepInfo) {
      const t = stepInfo.bodyType;
      if (setBodyType) {
        setBodyType(t);
      }
    }
  }, [stepInfo]);

  const onGroupChange = (e: RadioChangeEvent) => {
    setBodyType(e.target.value);
    stepForm.setFieldValue('bodyType', e.target.value);
  };

  const BodyMap = () => {
    switch (bodyType) {
      case 0:
        return <NoBody />;
      case 1:
        return <JSONBody {...props} />;
      case 2:
        return <FormBody {...props} />;
    }
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
        <Radio value={1}>json</Radio>
      </Radio.Group>
      {BodyMap()}
    </>
  );
};

export default Index;
