import MyProTable from '@/components/Table/MyProTable';
import { FC } from 'react';

interface Props {
  perKey: string;
}

const CaseDataSource: FC<Props> = ({ perKey }) => {
  return <MyProTable columns={[]} rowKey={''} persistenceKey={perKey} />;
};

export default CaseDataSource;
