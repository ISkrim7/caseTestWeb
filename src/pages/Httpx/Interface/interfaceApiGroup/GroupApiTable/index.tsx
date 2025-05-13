import {
  copyInterfaceGroup,
  pageInterfaceGroup,
  removeInterfaceGroup,
} from '@/api/inter/interGroup';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceGroup } from '@/pages/Httpx/types';
import { ModuleEnum } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { history } from '@@/core/history';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, Popconfirm, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  currentProjectId?: number;
  currentModuleId?: number;
  perKey: string;
}

const Index: FC<SelfProps> = ({
  currentModuleId,
  currentProjectId,
  perKey,
}) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    actionRef.current?.reload();
  }, [currentModuleId, currentProjectId]);

  // 使用useCallback优化请求函数
  const fetchInterfaceGroup = useCallback(
    async (params: any) => {
      try {
        setLoading(true);
        const { code, data } = await pageInterfaceGroup({
          ...params,
          module_id: currentModuleId,
          module_type: ModuleEnum.API,
        });
        return pageData(code, data);
      } catch (error) {
        console.error('获取接口组列表失败:', error);
        return { success: false, data: [] };
      } finally {
        setLoading(false);
      }
    },
    [currentModuleId],
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
                //window.open(`/interface/group/detail/groupId=${record.id}`);
                history.push(`/interface/group/detail/groupId=${record.id}`);
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
      loading={loading}
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
