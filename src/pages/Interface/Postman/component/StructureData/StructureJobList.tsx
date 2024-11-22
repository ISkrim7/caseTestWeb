import TitleName from '@/components/TitleName';
import StructureCookie from '@/pages/Interface/Postman/component/StructureData/StructureCookie';
import InsertHouse from '@/pages/Interface/Postman/component/StructureData/StructureHouse/InsertHouse';
import InsertKey from '@/pages/Interface/Postman/component/StructureData/StructureHouse/InsertKey';
import InsertProxy from '@/pages/Interface/Postman/component/StructureData/StructureHouse/InsertProxy';
import InsertShoot from '@/pages/Interface/Postman/component/StructureData/StructureHouse/InsertShoot';
import { ISteps } from '@/pages/Interface/types';
import { ProCard } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { FC } from 'react';

interface ISelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
  currentProjectId: string;
}

const StructureJobList: FC<ISelfProps> = (props) => {
  return (
    <ProCard bodyStyle={{ padding: 0, height: 'auto' }} split={'horizontal'}>
      <StructureCookie {...props} />
      <ProCard
        title={TitleName('房')}
        defaultCollapsed
        split={'horizontal'}
        collapsible
      >
        <InsertHouse {...props} />

        <InsertShoot {...props} />
        <InsertProxy {...props} />
        <InsertKey {...props} />
      </ProCard>
      <ProCard
        title={TitleName('签约')}
        defaultCollapsed
        split={'horizontal'}
        collapsible
      >
        <ProCard
          title={'录入一个买卖合同'}
          collapsible
          defaultCollapsed
        ></ProCard>
        <ProCard
          title={'录入一个草签租赁合同'}
          collapsible
          defaultCollapsed
        ></ProCard>
        <ProCard
          title={'正式合同完成收款'}
          collapsible
          defaultCollapsed
        ></ProCard>
      </ProCard>
    </ProCard>
  );
};

export default StructureJobList;
