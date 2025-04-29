import {
  pageInterCaseResult,
  removeCaseAPIResult,
  removeCaseAPIResults,
} from '@/api/inter/interCase';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import InterfaceApiCaseResultDrawer from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultDrawer';
import { IInterfaceCaseResult } from '@/pages/Httpx/types';
import { pageData } from '@/utils/somefunc';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Space, Tag } from 'antd';
import { FC, useCallback, useRef, useState } from 'react';

interface SelfProps {
  apiCaseId?: number | string;
  taskResultId?: number | string;
}

const InterfaceApiCaseResultTable: FC<SelfProps> = (props) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const { apiCaseId, taskResultId } = props;
  const [open, setOpen] = useState(false);
  const [currentCaseResultId, setCurrentCaseResultId] = useState<number>();

  const fetchResults = useCallback(
    async (params: any, sort: any) => {
      const searchData = {
        ...params,
        sort: sort,
      };
      searchData.interfaceCaseID = apiCaseId ? apiCaseId : undefined;
      searchData.interface_task_result_Id = taskResultId
        ? taskResultId
        : undefined;
      const { code, data } = await pageInterCaseResult(searchData);
      return pageData(code, data);
    },
    [apiCaseId, taskResultId],
  );
  const columns: ProColumns<IInterfaceCaseResult>[] = [
    {
      title: '结果ID',
      dataIndex: 'uid',
      key: 'uid',
      width: '6%',
      render: (_, record) => <Tag color={'blue'}>{record.uid}</Tag>,
    },
    {
      title: '执行用例',
      dataIndex: 'interfaceCaseName',
      key: 'interfaceCaseName',
      render: (_, record) => (
        <Tag color={'blue'}>{record.interfaceCaseName}</Tag>
      ),
    },

    {
      title: '测试结果',
      dataIndex: 'result',
      key: 'result',
      valueType: 'select',
      valueEnum: { SUCCESS: { text: '成功' }, ERROR: { text: '失败' } },
      render: (_, record) => (
        <Tag color={record.result === 'SUCCESS' ? 'green' : 'error'}>
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
      key: 'status',
      valueEnum: {
        RUNNING: { text: '运行中', status: 'Processing' },
        OVER: { text: '完成', status: 'Success' },
      },
    },

    {
      title: '执行时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      key: 'startTime',
      render: (_, record) => <Tag color={'blue'}>{record.startTime}</Tag>,
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
                  setCurrentCaseResultId(record.id);
                  setOpen(true);
                }}
              >
                详情
              </a>
              <Divider type={'vertical'} />
              <a onClick={async () => removeCaseResult(record.uid)}>删除</a>
            </>
          ) : null}
        </>
      ),
    },
  ];
  const removeCaseResult = async (caseResultUid: string) => {
    const { code, msg } = await removeCaseAPIResult(caseResultUid);
    if (code === 0) {
      message.success(msg);
      actionRef.current?.reload();
    }
  };
  const removeCaseResults = async () => {
    if (apiCaseId) {
      const { code, msg } = await removeCaseAPIResults(apiCaseId);
      if (code === 0) {
        message.success(msg);
        actionRef.current?.reload();
      }
    }
  };

  return (
    <ProCard
      title={taskResultId ? '' : '调试历史'}
      bordered={true}
      style={{ marginTop: taskResultId ? 0 : 200, height: 'auto' }}
      extra={
        taskResultId ? null : (
          <Space>
            <Button type={'primary'} onClick={removeCaseResults}>
              Clear All
            </Button>
          </Space>
        )
      }
    >
      <MyDrawer name={''} width={'80%'} open={open} setOpen={setOpen}>
        <InterfaceApiCaseResultDrawer
          currentCaseResultId={currentCaseResultId}
        />
      </MyDrawer>
      <MyProTable
        rowKey={'uid'}
        actionRef={actionRef}
        request={fetchResults}
        search={false}
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

export default InterfaceApiCaseResultTable;
