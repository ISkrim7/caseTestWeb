import { IModuleEnum, IObjGet } from '@/api';
import { removeAllTaskResults } from '@/api/inter/interCase';
import {
  pageInterTaskResult,
  removeInterTaskResultDetail,
} from '@/api/inter/interTask';
import { queryProjectEnum } from '@/components/CommonFunc';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceTaskResult } from '@/pages/Httpx/types';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum, pageData } from '@/utils/somefunc';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { history } from 'umi';

interface SelfProps {
  apiCaseTaskId?: number | string;
}

const InterfaceApiTaskResultTable: FC<SelfProps> = ({ apiCaseTaskId }) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [isFormTaskDetail, setIsFromTaskDetail] = useState(false);
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [selectModuleId, setSelectModuleId] = useState<number>();
  useEffect(() => {
    if (apiCaseTaskId) {
      setIsFromTaskDetail(true);
    } else {
      queryProjectEnum(setProjectEnumMap).then();
    }
  }, [apiCaseTaskId]);
  useEffect(() => {
    if (selectProjectId) {
      fetchModulesEnum(
        selectProjectId,
        ModuleEnum.API_TASK,
        setModuleEnum,
      ).then();
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
      return pageData(code, data);
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
          setSelectModuleId(undefined);
        },
      },
    },
    {
      title: '所属模块',
      dataIndex: 'interfaceModuleId',
      hideInTable: true,
      valueType: 'treeSelect',
      initialValue: selectModuleId,
      fieldProps: {
        value: selectModuleId,
        onSelect: (value: number) => {
          setSelectModuleId(value);
        },
        treeData: moduleEnum,
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
      //dataIndex: 'runDay',
      //key: 'runDay',
      //valueType: 'dateRange',
      dataIndex: 'start_time',
      valueType: 'dateTime',
      key: 'start_time',
      sorter: true,
      //render: (_, record) => <Tag color={'blue'}>{record.runDay}</Tag>,
      render: (_, record) => <Tag color={'blue'}>{record.start_time}</Tag>,
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
                  history.push(
                    `/interface/task/report/detail/resultId=${record.id}`,
                    '_blank',
                  );
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
