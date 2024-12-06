import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceCaseResult } from '@/pages/Interface/types';
import { ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC } from 'react';

interface SelfProps {
  apiCaseId?: number;
}

const InterfaceApiCaseResultTable: FC<SelfProps> = (props) => {
  const { apiCaseId } = props;

  const columns: ProColumns<IInterfaceCaseResult>[] = [
    {
      title: '用例ID',
      dataIndex: 'interfaceCaseUid',
      hidden: true,
    },
    {
      title: '执行用例',
      dataIndex: 'interfaceCaseName',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: { SUCCESS: { text: '成功' }, ERROR: { text: '失败' } },
    },
    {
      title: '执行人',
      dataIndex: 'starterName',
      key: 'starterId',
      render: (_, record) => <Tag color={'blue'}>{record.starterName}</Tag>,
    },
    {
      title: '执行时间',
      dataIndex: 'create_time',
      render: (_, record) => <Tag color={'blue'}>{record.create_time}</Tag>,
    },
  ];

  return (
    <MyProTable rowKey={'uid'} search={false} columns={columns} x={1000} />
  );
};

export default InterfaceApiCaseResultTable;
