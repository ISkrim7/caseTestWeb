import {
  copyApiCase,
  pageInterApiCase,
  removeApiCase,
} from '@/api/inter/interCase';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPICase } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
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
  const fetchInterfaceCase = useCallback(
    async (params: any, sort: any) => {
      const searchData = {
        ...params,
        part_id: currentPartId,
        sort: sort,
      };
      const { code, data } = await pageInterApiCase(searchData);
      if (code === 0) {
        return {
          data: data.items,
          total: data.pageInfo.total,
          success: true,
          pageSize: data.pageInfo.page,
          current: data.pageInfo.limit,
        };
      }
      return {
        data: [],
        success: false,
        total: 0,
      };
    },
    [currentPartId],
  );
  const columns: ProColumns<IInterfaceAPICase>[] = [
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      width: '10%',
      copyable: true,
    },
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: '15%',
    },
    {
      title: 'API数量',
      dataIndex: 'apiNum',
      valueType: 'text',
      width: '10%',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.apiNum}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      width: '10%',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.API_STATUS_ENUM,
      render: (_, record) => {
        return CONFIG.API_STATUS_ENUM[record.status].tag;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: '10%',
      render: (_, record) => {
        return <Tag>{record.creatorName}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: '18%',
      render: (text, record, _) => {
        return (
          <>
            <a
              onClick={() => {
                history.push(
                  `/interface/caseApi/detail/caseApiId=${record.id}`,
                );
              }}
            >
              详情
            </a>
            <Divider type={'vertical'} />
            <a>执行</a>
            <Divider type={'vertical'} />
            <a
              onClick={async () => {
                const { code } = await copyApiCase(record.id);
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
                await removeApiCase(record.id).then(async ({ code }) => {
                  if (code === 0) {
                    actionRef.current?.reload();
                  }
                });
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
      key={'id'}
      rowKey={perKey}
      actionRef={actionRef}
      x={1000}
      columns={columns}
      request={fetchInterfaceCase}
      toolBarRender={() => [
        <Button
          type={'primary'}
          onClick={() => {
            history.push('/interface/caseApi/detail');
          }}
        >
          添加
        </Button>,
      ]}
    />
  );
};

export default Index;
