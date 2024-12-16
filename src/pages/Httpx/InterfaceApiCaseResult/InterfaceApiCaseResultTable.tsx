import {
  pageInterCaseResult,
  removeCaseAPIResult,
  removeCaseAPIResults,
} from '@/api/inter/interCase';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import InterfaceApiCaseResultDrawer from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultDrawer';
import { IInterfaceCaseResult } from '@/pages/Httpx/types';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Tag } from 'antd';
import { FC, useCallback, useRef, useState } from 'react';

interface SelfProps {
  apiCaseId?: number | string;
  taskResultId?: number | string;
}

const InterfaceApiCaseResultTable: FC<SelfProps> = (props) => {
  const { apiCaseId, taskResultId } = props;
  const [open, setOpen] = useState(false);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [currentCaseResultId, setCurrentCaseResultId] = useState<number>();
  const [polling, setPolling] = useState<number>(0);
  // useEffect(() => {
  //   if (apiCaseId) {
  //     setPolling(2000);
  //   } else {
  //     setPolling(0);
  //   }
  //   return () => setPolling(0);
  // }, [apiCaseId]);
  const fetchResults = useCallback(
    async (params: any, sort: any) => {
      const searchData = {
        ...params,
        //只查询公共api
        interfaceCaseID: apiCaseId,
        interface_task_result_Id: taskResultId,
        sort: sort,
      };
      const { code, data } = await pageInterCaseResult(searchData);
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
    [apiCaseId, taskResultId],
  );
  const columns: ProColumns<IInterfaceCaseResult>[] = [
    {
      title: '用例ID',
      dataIndex: 'interfaceCaseUid',
      width: '6%',
      render: (_, record) => (
        <Tag color={'blue'}>{record.interfaceCaseUid}</Tag>
      ),
    },
    {
      title: '执行用例',
      dataIndex: 'interfaceCaseName',
      render: (_, record) => (
        <Tag color={'blue'}>{record.interfaceCaseName}</Tag>
      ),
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
        OVER: { text: '完成', status: 'Success' },
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

  const RemoveAllButton = (
    <>
      <Button type={'primary'} onClick={removeCaseResults}>
        Remove All
      </Button>
    </>
  );

  const GetButton = (
    <Button
      type="primary"
      onClick={() => {
        if (polling) {
          setPolling(0);
          return;
        }
        setPolling(2000);
      }}
    >
      {polling ? <LoadingOutlined /> : <ReloadOutlined />}
      {polling ? '停止轮询' : '开始轮询'}
    </Button>
  );
  const toolBar = () => {
    if (!taskResultId) {
      return [GetButton, RemoveAllButton];
    }
  };
  return (
    <div style={{ marginTop: 20 }}>
      <MyDrawer name={''} open={open} setOpen={setOpen}>
        <InterfaceApiCaseResultDrawer
          currentCaseResultId={currentCaseResultId}
        />
      </MyDrawer>
      <MyProTable
        // @ts-ignore
        polling={polling}
        rowKey={'uid'}
        actionRef={actionRef}
        request={fetchResults}
        search={false}
        toolBarRender={toolBar}
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 6,
          showSizeChanger: true,
        }}
        columns={columns}
        x={1000}
      />
    </div>
  );
};

export default InterfaceApiCaseResultTable;
