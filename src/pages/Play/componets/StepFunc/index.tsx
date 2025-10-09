import MyTabs from '@/components/MyTabs';
import StepFuncAPI from '@/pages/Play/componets/StepFunc/StepFuncAPI';
import StepFuncIF from '@/pages/Play/componets/StepFunc/StepFuncIF';
import StepFuncSQL from '@/pages/Play/componets/StepFunc/StepFuncSQL';
import { IUICaseSteps } from '@/pages/Play/componets/uiTypes';
import { ProCard } from '@ant-design/pro-components';
import { FC } from 'react';

interface Self {
  currentProjectId: number;
  subStepInfo: IUICaseSteps;
  envs?: { label: string; value: number | null }[];
  callback: () => void;
}

/**
 *
 */
const Index: FC<Self> = (props) => {
  const items = [
    {
      key: '1',
      label: '执行API',
      children: <StepFuncAPI {...props} />,
    },
    {
      key: '2',
      label: '执行SQL',
      children: <StepFuncSQL {...props} />,
    },
    {
      key: '3',
      label: 'IF条件',
      children: <StepFuncIF {...props} />,
    },
  ];
  return (
    <ProCard>
      <MyTabs defaultActiveKey={'1'} items={items} tabPosition={'left'} />
    </ProCard>
  );
};

export default Index;
