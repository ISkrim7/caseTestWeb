import { ProCard } from '@ant-design/pro-components';
import { FC } from 'react';

const StructureProCard: FC = (props) => {
  return (
    <ProCard
      style={{ height: 'auto', width: '100%' }}
      bordered={false}
      bodyStyle={{ height: '100%' }}
      direction="column"
      gutter={[24, 24]}
    >
      {props.children}
    </ProCard>
  );
};

export default StructureProCard;
