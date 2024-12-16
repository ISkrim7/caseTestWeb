import { removeAllTaskResults } from '@/api/inter/interCase';
import { pageInterTaskResult } from '@/api/inter/interTask';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import InterfaceApiTaskResultDetail from '@/pages/Httpx/InterfaceApiTaskResult/InterfaceApiTaskResultDetail';
import { IInterfaceTaskResult } from '@/pages/Httpx/types';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Tag } from 'antd';
import { FC, useCallback, useRef, useState } from 'react';

interface SelfProps {
  apiCaseTaskId?: number | string;
}

const InterfaceApiTaskResultTable: FC<SelfProps> = ({ apiCaseTaskId }) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [currentResultId, setCurrentResultId] = useState<number>();
  const fetchResults = useCallback(
    async (params: any, sort: any) => {
      const searchData = {
        ...params,
        //只查询公共api
        taskId: apiCaseTaskId,
        sort: sort,
      };
      const { code, data } = await pageInterTaskResult(searchData);
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
    [apiCaseTaskId],
  );

  const columns: ProColumns<IInterfaceTaskResult>[] = [
    {
      title: '任务ID',
      dataIndex: 'taskUid',
      width: '6%',
      render: (_, record) => <Tag color={'blue'}>{record.taskUid}</Tag>,
    },
    {
      title: '执行用例',
      dataIndex: 'taskName',
      render: (_, record) => <Tag color={'blue'}>{record.taskName}</Tag>,
    },

    {
      title: '测试结果',
      dataIndex: 'result',
      valueType: 'select',
      valueEnum: { SUCCESS: { text: '成功' }, ERROR: { text: '失败' } },
      render: (_, record) => (
        <Tag color={record.result === 'SUCCESS' ? 'green' : 'warning'}>
          {record.result}
        </Tag>
      ),
    },
    {
      title: '进度',
      key: 'progress',
      dataIndex: 'progress',
      valueType: (item) => ({
        type: 'progress',
        status: item.status !== 'OVER' ? 'active' : 'success',
      }),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        RUNNING: { text: '运行中', status: 'Processing' },
        WAIT: { text: '完成', status: 'Success' },
      },
    },
    {
      title: '执行人',
      dataIndex: 'starterName',
      key: 'starterId',
      render: (_, record) => <Tag color={'blue'}>{record.starterName}</Tag>,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          {record.status === 'OVER' ? (
            <>
              <a
                onClick={() => {
                  setCurrentResultId(record.id);
                  setOpenDetail(true);
                }}
              >
                详情
              </a>
              <Divider type={'vertical'} />
              <a>删除</a>
            </>
          ) : null}
        </>
      ),
    },
  ];

  const removeTaskResults = async () => {
    if (apiCaseTaskId) {
      const { code, msg } = await removeAllTaskResults(apiCaseTaskId);
      if (code === 0) {
        message.success(msg);
        actionRef.current?.reload();
      }
    }
  };
  const RemoveAllButton = (
    <>
      <Button type={'primary'} onClick={removeTaskResults}>
        Remove All
      </Button>
    </>
  );

  return (
    <ProCard>
      <MyDrawer setOpen={setOpenDetail} open={openDetail} name={''}>
        <InterfaceApiTaskResultDetail taskResultId={currentResultId} />
      </MyDrawer>
      <MyProTable
        headerTitle={'运行历史'}
        // @ts-ignore
        // polling={polling}
        rowKey={'uid'}
        actionRef={actionRef}
        request={fetchResults}
        search={false}
        toolBarRender={() => [RemoveAllButton]}
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 6,
          showSizeChanger: true,
        }}
        columns={columns}
        x={1000}
      />
    </ProCard>
  );
};

export default InterfaceApiTaskResultTable;
