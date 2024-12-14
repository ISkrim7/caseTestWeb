import { pageApiTask } from '@/api/inter/interTask';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPITask } from '@/pages/Interface/types';
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

  const fetchPageTasks = useCallback(
    async (params: any, sort: any) => {
      const searchData = {
        ...params,
        part_id: currentPartId,
        //只查询公共api
        is_common: 1,
        sort: sort,
      };
      const { code, data } = await pageApiTask(searchData);
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

  const taskColumns: ProColumns<IInterfaceAPITask>[] = [
    {
      title: '任务编号',
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
      width: '10%',
      valueEnum: CONFIG.API_STATUS_ENUM,
      // render: (_, record) => {
      //  return
      // },
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
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: '15%',
      render: (text, record, _) => {
        return (
          <>
            <a
              onClick={() => {
                history.push(`/interface/task/detail/taskId=${record.id}`);
              }}
            >
              详情
            </a>
            {/*<Divider type={'vertical'} />*/}
            {/*<a*/}
            {/*  onClick={async () => {*/}
            {/*    await asyncTryInterApi({ interfaceId: record.id }).then(*/}
            {/*      ({ code, msg }) => {*/}
            {/*        if (code === 0) {*/}
            {/*          message.success(msg);*/}
            {/*        }*/}
            {/*      },*/}
            {/*    );*/}
            {/*  }}*/}
            {/*>*/}
            {/*  执行*/}
            {/*</a>*/}
            <Popconfirm
              title={'确认删除？'}
              okText={'确认'}
              cancelText={'点错了'}
              onConfirm={async () => {}}
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
      columns={taskColumns}
      rowKey={'id'}
      x={1000}
      actionRef={actionRef}
      request={fetchPageTasks}
      toolBarRender={() => [
        <Button
          type={'primary'}
          onClick={() => {
            history.push('/interface/task/detail');
          }}
        >
          添加
        </Button>,
      ]}
    />
  );
};
export default Index;
