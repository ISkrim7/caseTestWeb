import { getMockInterfaces, linkMockToInterface } from '@/api/mock';
import { ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, message, Space } from 'antd';
import React from 'react';
import { history } from 'umi';

interface InterfaceItem {
  id: string;
  name: string;
  method: string;
  path: string;
  mockCount: number;
  enabledCount: number;
}

interface MockLinkInterfaceProps {
  interfaceId?: string;
  interfaceName?: string;
}

const MockLinkInterface: React.FC<MockLinkInterfaceProps> = ({
  interfaceId,
  interfaceName,
}) => {
  const { data: interfaces, run: refresh } = useRequest(() =>
    getMockInterfaces().then((res) => {
      const processedData = res.data.map((item: any) => ({
        ...item,
        mockCount: Number(item.mockCount) || 0,
      }));
      return interfaceId
        ? {
            ...res,
            data: processedData.filter(
              (item: InterfaceItem) => item.id === interfaceId,
            ),
          }
        : { ...res, data: processedData };
    }),
  );

  const columns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: 'Mock规则数',
      dataIndex: 'mockCount',
      key: 'mockCount',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: InterfaceItem) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              history.push(`/mock/create?interfaceId=${record.id}`)
            }
          >
            创建Mock
          </Button>
          <Button
            type="link"
            onClick={async () => {
              await linkMockToInterface({
                interface_id: record.id,
                path: record.path,
                method: record.method,
              });
              message.success('关联成功');
              refresh();
            }}
          >
            快速关联
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ProTable
      columns={columns}
      dataSource={interfaces?.data || []}
      rowKey="id"
      pagination={{
        showSizeChanger: true,
      }}
      toolBarRender={(action) => [
        <Button
          key="create"
          type="primary"
          onClick={() => history.push('/mock/create')}
        >
          新建Mock规则
        </Button>,
      ]}
    />
  );
};

export default MockLinkInterface;
