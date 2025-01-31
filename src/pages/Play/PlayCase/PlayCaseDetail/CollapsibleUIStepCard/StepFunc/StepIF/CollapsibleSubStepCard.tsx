import MyDrawer from '@/components/MyDrawer';
import SubStepDetail from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard/StepFunc/StepIF/SubStepDetail';
import { IUICaseSubStep } from '@/pages/UIPlaywright/uiTypes';
import { ProCard } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC, useState } from 'react';

interface CollapsibleUIStepCardProps {
  subStep: IUICaseSubStep;
}

const CollapsibleSubStepCard: FC<CollapsibleUIStepCardProps> = (props) => {
  const { subStep } = props;
  const [openStepDrawer, setOpenStepDrawer] = useState(false);

  return (
    <>
      <MyDrawer
        name={'Sub Step'}
        width={'auto'}
        open={openStepDrawer}
        setOpen={setOpenStepDrawer}
      >
        <SubStepDetail
          subStep={subStep}
          func={() => {
            setOpenStepDrawer(false);
          }}
        />
      </MyDrawer>
      <ProCard
        bordered
        collapsible={true}
        defaultCollapsed={true}
        title={<Tag color={'green'}>{subStep.name}</Tag>}
        subTitle={subStep.description}
        extra={<a onClick={() => setOpenStepDrawer(true)}>detail</a>}
      ></ProCard>
    </>
  );
};

export default CollapsibleSubStepCard;
