import CaseTotal from '@/pages/UIPlaywright/UIStatisitc/StatisitcInfo/caseTotal';
import DayNew from '@/pages/UIPlaywright/UIStatisitc/StatisitcInfo/dayNew';
import Status from '@/pages/UIPlaywright/UIStatisitc/StatisitcInfo/status';
import { Divider } from 'antd';
import { FC } from 'react';

interface SelfProps {
  projectId: number;
}

const Index: FC<SelfProps> = (props) => {
  return (
    <>
      <CaseTotal {...props} />
      <Divider />
      <DayNew {...props} />
      <Divider />
      <Status {...props} />
    </>
  );
};

export default Index;
