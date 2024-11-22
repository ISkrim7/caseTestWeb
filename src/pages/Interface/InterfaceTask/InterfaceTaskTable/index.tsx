import {
  delTask,
  handelRunTask,
  pageInterfaceTask,
  setInterTaskSwitch,
} from '@/api/interface';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceTask } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import { history } from '@@/core/history';
import { useModel } from '@@/exports';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  Button,
  Divider,
  message,
  Popconfirm,
  Switch,
  Tag,
  Tooltip,
} from 'antd';
import parser from 'cron-parser';
import moment from 'moment/moment';
import { FC, useCallback, useEffect, useRef } from 'react';

interface SelfIndex {
  projectId: number;
  casePartId: number;
}

const Index: FC<SelfIndex> = ({ projectId, casePartId }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  const CronHandle = (value: string) => {
    const date = parser.parseExpression(value);
    // @ts-ignore
    return `下次运行时间: ${moment(new Date(date.next())).format(
      'YYYY-MM-DD HH:mm:ss',
    )}`;
  };
  const runTask = async (uid: string) => {
    const { code, msg } = await handelRunTask({ uid: uid });
    if (code === 0) {
      message.success(msg);
    }
  };

  const setTaskSwitch = async (uid: string, flag: boolean) => {
    const { code, msg } = await setInterTaskSwitch({ uid: uid, switch: flag });
    if (code === 0) {
      message.success(msg);
      actionRef.current?.reload();
    }
  };

  const fetchDelTask = async (uid: string) => {
    const res = await delTask({ uid: uid });
    if (res.code === 0) {
      message.success(res.msg);
      actionRef.current?.reload();
    }
  };
  const columns: ProColumns<IInterfaceTask>[] = [
    {
      title: '任务编号',
      dataIndex: 'uid',
      key: 'uid',
      copyable: true,
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      copyable: true,
    },
    {
      title: '是否启动',
      dataIndex: 'text',
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            onClick={async (checked, event) => {
              await setTaskSwitch(record.uid, checked);
            }}
            value={record.switch}
          />
        );
      },
    },
    {
      title: 'cron',
      dataIndex: 'cron',
      render: (_, record) => {
        return (
          <Tooltip title={CronHandle(record.cron)}>
            <Tag color={'blue'}>{record.cron}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      render: (_, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_LEVEL[record.level].color}>
            {CONFIG.RENDER_CASE_LEVEL[record.level].text}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.CASE_STATUS_ENUM,
      render: (_, record) => {
        return (
          <Tag color={record.status === 'RUNNING' ? 'processing' : 'warning'}>
            {record.status}
          </Tag>
        );
      },
    },
    {
      title: '用例数',
      valueType: 'text',
      dataIndex: 'interfaceNum',
      render: (text) => <Tag color={'blue'}> {text}</Tag>,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
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
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                history.push(`/interface/task/detail/taskId=${record.uid}`);
              }}
            >
              详情
            </a>
            <Divider type={'vertical'} />
            <a onClick={async () => await runTask(record.uid)}>手动执行</a>
            {initialState?.currentUser?.id === record.creatorId ||
            initialState?.currentUser?.isAdmin ? (
              <Popconfirm
                title={'确认删除？'}
                okText={'确认'}
                cancelText={'点错了'}
                onConfirm={async () => {
                  await fetchDelTask(record.uid);
                }}
              >
                <Divider type={'vertical'} />
                <a>删除</a>
              </Popconfirm>
            ) : null}
          </>
        );
      },
    },
  ];

  const AddTaskButton = (
    <Button
      type={'primary'}
      onClick={() => {
        history.push(
          `/interface/task/detail/projectId=${projectId}&casePartId=${casePartId}`,
        );
      }}
    >
      添加任务
    </Button>
  );

  const fetchApiTasksData = useCallback(
    async (params: any, sort: any) => {
      if (!casePartId)
        return {
          data: [],
          success: false,
          total: 0,
        };
      const searchData: any = {
        casePartId: casePartId,
        ...params,
        sort: sort,
      };
      const { code, data } = await pageInterfaceTask(searchData);
      console.log('===d=ata', data);
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
    [casePartId],
  );

  useEffect(() => {
    actionRef.current?.reload();
  }, [projectId, casePartId]);

  return (
    <>
      <MyProTable
        columns={columns}
        rowKey={'uid'}
        request={fetchApiTasksData}
        actionRef={actionRef}
        toolBarRender={() => [AddTaskButton]}
      />
    </>
  );
};

export default Index;
