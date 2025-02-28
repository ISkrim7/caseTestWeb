import {
  copyInterfaceGroup,
  pageInterfaceGroup,
  removeInterfaceGroup,
} from '@/api/inter/interGroup';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceGroup } from '@/pages/Httpx/types';
import { pageData } from '@/utils/somefunc';
import { history } from '@@/core/history';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, Popconfirm, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef } from 'react';

interface SelfProps {
  currentProjectId?: number;
  currentPartId?: number;
  perKey: string;
}

const Index: FC<SelfProps> = ({ currentPartId, currentProjectId, perKey }) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  useEffect(() => {
    actionRef.current?.reload();
  }, [currentPartId, currentProjectId]);
  const fetchInterfaceGroup = useCallback(
    async (params: any) => {
      const { code, data } = await pageInterfaceGroup({
        ...params,
        part_id: currentPartId,
      });
      return pageData(code, data);
    },
    [currentPartId],
  );

  const columns: ProColumns<IInterfaceGroup>[] = [
    {
      title: 'ID',
      dataIndex: 'uid',
      key: 'uid',
      width: '15%',
      copyable: true,
      fixed: 'left',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.uid}</Tag>;
      },
    },
    {
      title: '组名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '接口数',
      dataIndex: 'api_num',
      key: 'api_num',
      render: (_, record) => {
        return <Tag color={'blue-inverse'}>{record.api_num}</Tag>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      render: (_, record) => {
        return <Tag color={'orange'}>{record.creatorName}</Tag>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: '20%',
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                window.open(`/interface/group/detail/groupId=${record.id}`);
              }}
            >
              详情
            </a>
            <Divider type={'vertical'} />
            <a
              onClick={async () => {
                const { code } = await copyInterfaceGroup(record.id);
                if (code === 0) {
                  actionRef.current?.reload();
                }
              }}
            >
              复制
            </a>
            <Popconfirm
              title={'确认删除？'}
              okText={'确认'}
              cancelText={'点错了'}
              onConfirm={async () => {
                const { code } = await removeInterfaceGroup(record.id);
                if (code === 0) {
                  actionRef.current?.reload();
                }
              }}
            >
              <Divider type={'vertical'} />
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  return (
    <MyProTable
      persistenceKey={perKey}
      columns={columns}
      rowKey={'id'}
      x={800}
      actionRef={actionRef}
      request={fetchInterfaceGroup}
      toolBarRender={() => [
        <Button
          type={'primary'}
          onClick={() => {
            history.push('/interface/group/detail');
          }}
        >
          添加
        </Button>,
      ]}
    />
  );
};

export default Index;
