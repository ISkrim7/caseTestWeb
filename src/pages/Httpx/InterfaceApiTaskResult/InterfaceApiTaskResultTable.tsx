import { IObjGet } from '@/api';
import { queryProject } from '@/api/base';
import { removeAllTaskResults } from '@/api/inter/interCase';
import {
  pageInterTaskResult,
  removeInterTaskResultDetail,
} from '@/api/inter/interTask';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import InterfaceApiTaskResultDetail from '@/pages/Httpx/InterfaceApiTaskResult/InterfaceApiTaskResultDetail';
import { IInterfaceTaskResult } from '@/pages/Httpx/types';
import { fetchCaseParts } from '@/pages/UIPlaywright/someFetch';
import { CasePartEnum } from '@/pages/UIPlaywright/uiTypes';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  apiCaseTaskId?: number | string;
}

const InterfaceApiTaskResultTable: FC<SelfProps> = ({ apiCaseTaskId }) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [currentResultId, setCurrentResultId] = useState<number>();
  const [isFormTaskDetail, setIsFromTaskDetail] = useState(false);
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [partEnumMap, setPartEnumMap] = useState<CasePartEnum[]>([]);
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [selectPartId, setSelectPartId] = useState<number>();
  useEffect(() => {
    if (apiCaseTaskId) {
      setIsFromTaskDetail(true);
    } else {
      queryProject().then(({ code, data }) => {
        if (code === 0) {
          const mapData = data.reduce((acc: any, obj) => {
            acc[obj.id] = { text: obj.title };
            return acc;
          }, {});
          setProjectEnumMap(mapData);
        }
      });
    }
  }, [apiCaseTaskId]);
  useEffect(() => {
    if (selectProjectId) {
      fetchCaseParts(selectProjectId, setPartEnumMap).then();
    }
  }, [selectProjectId]);
  const fetchResults = useCallback(
    async (params: any, sort: any) => {
      const searchData = {
        ...params,
        //只查询公共api
        taskId: apiCaseTaskId,
        sort: { ...sort },
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
      title: '所属项目',
      dataIndex: 'interfaceProjectId',
      hideInTable: true,
      valueType: 'select',
      valueEnum: projectEnumMap,
      initialValue: selectProjectId,
      fieldProps: {
        onSelect: (value: number) => {
          setSelectProjectId(value);
          setSelectPartId(undefined);
        },
      },
    },
    {
      title: '所属模块',
      dataIndex: 'interfacePartId',
      hideInTable: true,
      valueType: 'treeSelect',
      initialValue: selectPartId,
      fieldProps: {
        value: selectPartId,
        onSelect: (value: number) => {
          setSelectPartId(value);
        },
        treeData: partEnumMap,
        fieldNames: {
          label: 'title',
        },
      },
    },
    {
      title: '任务结果ID',
      dataIndex: 'uid',
      width: '6%',
      render: (_, record) => <Tag color={'blue'}>{record.uid}</Tag>,
    },
    {
      title: '任务名',
      dataIndex: 'taskName',
      render: (_, record) => <Tag color={'blue'}>{record.taskName}</Tag>,
    },

    {
      title: '测试结果',
      dataIndex: 'result',
      valueType: 'select',
      sorter: true,
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
      hideInSearch: true,
      hideInTable: !isFormTaskDetail,
      dataIndex: 'progress',
      valueType: (item) => ({
        type: 'progress',
        status: item.status !== 'OVER' ? 'active' : 'success',
      }),
    },

    {
      title: '执行时间',
      dataIndex: 'runDay',
      key: 'runDay',
      valueType: 'dateRange',
      sorter: true,
      render: (_, record) => <Tag color={'blue'}>{record.runDay}</Tag>,
    },
    {
      title: '用时',
      dataIndex: 'totalUseTime',
      key: 'totalUseTime',
      hideInSearch: true,
      render: (_, record) => <Tag color={'blue'}>{record.totalUseTime}</Tag>,
    },
    {
      title: '执行人',
      dataIndex: 'starterName',
      key: 'starterName',
      render: (_, record) => <Tag color={'blue'}>{record.starterName}</Tag>,
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
              <a onClick={async () => await removeTaskResult(record.id)}>
                删除
              </a>
            </>
          ) : null}
        </>
      ),
    },
  ];
  const removeTaskResult = async (resultId: number) => {
    const { code, msg } = await removeInterTaskResultDetail(resultId);
    if (code === 0) {
      message.success(msg);
      actionRef.current?.reload();
    }
  };
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
      {isFormTaskDetail ? (
        <Button type={'primary'} onClick={removeTaskResults}>
          Remove All
        </Button>
      ) : null}
    </>
  );

  return (
    <>
      <MyDrawer
        setOpen={setOpenDetail}
        open={openDetail}
        name={''}
        width={'80%'}
      >
        <InterfaceApiTaskResultDetail taskResultId={currentResultId} />
      </MyDrawer>
      <MyProTable
        // @ts-ignore
        // polling={polling}
        rowKey={'uid'}
        actionRef={actionRef}
        request={fetchResults}
        search={!isFormTaskDetail}
        toolBarRender={() => [RemoveAllButton]}
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 6,
          showSizeChanger: true,
        }}
        columns={columns}
        x={1000}
      />
    </>
  );
};

export default InterfaceApiTaskResultTable;
