import { queryStepByGroupID } from '@/api/ui';
import { IUICaseSteps } from '@/pages/UIPlaywright/uiTypes';
import { ProTable } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  methodEnum: any;
  groupId: number;
}

const Index: FC<SelfProps> = ({ groupId, methodEnum }) => {
  const [dataSource, setDataSource] = useState([]);
  const columns: ProColumns<IUICaseSteps>[] = [
    {
      title: '名称',
      valueType: 'text',
      dataIndex: 'name',
    },
    {
      title: '描述',
      key: 'desc',
      dataIndex: 'desc',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '方法',
      dataIndex: 'method',
      valueEnum: { ...methodEnum },
      valueType: 'select',
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
  ];

  useEffect(() => {
    if (groupId) {
      queryStepByGroupID({ groupId: groupId }).then(({ code, data }) => {
        if (code === 0) {
          setDataSource(data);
        }
      });
    }
  }, [groupId]);
  return (
    <ProTable
      columns={columns}
      options={false}
      dataSource={dataSource}
      rowKey={'id'}
      search={false}
    />
  );
};

export default Index;
