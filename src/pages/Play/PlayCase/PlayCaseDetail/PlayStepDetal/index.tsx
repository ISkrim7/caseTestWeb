import { IUICaseSteps } from '@/pages/UIPlaywright/uiTypes';
import { Form } from 'antd';
import { FC, useEffect } from 'react';

interface ISelfProps {
  stepId: number | string;
}

const Index: FC<ISelfProps> = ({ stepId }) => {
  const [stepForm] = Form.useForm<IUICaseSteps>();

  useEffect(() => {
    if (stepId) {
    }
  }, [stepId]);
  return <div></div>;
};

export default Index;
