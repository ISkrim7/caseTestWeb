import {
  getNextTaskRunTime,
  pageApiTask,
  removeApiTaskBaseInfo,
  setApiTaskAuto,
} from '@/api/inter/interTask';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPITask } from '@/pages/Httpx/types';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { history } from '@@/core/history';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Switch, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef } from 'react';

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

  useEffect(() => {
    actionRef.current?.reload();
  }, [currentModuleId, currentProjectId]);

  const fetchPageTasks = useCallback(
    async (params: any, sort: any) => {
      const { code, data } = await pageApiTask({
        ...params,
        module_id: currentModuleId,
        module_type: ModuleEnum.API_TASK,
        sort: sort,
      });
      return pageData(code, data);
    },
    [currentModuleId],
  );

  const setTaskAuto = async (auto: boolean, taskId: number) => {
    const { code } = await setApiTaskAuto({ is_auto: auto, taskId: taskId });
    if (code === 0) {
      message.success(auto ? '已开启任务' : '已暂暂停任务');
      actionRef.current?.reload();
    }
  };
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
    },
    {
      title: '业务用例数',
      dataIndex: 'total_cases_num',
      key: 'total_cases_num',
      hideInSearch: true,
      render: (text) => {
        return <Tag color={'green'}>{text}</Tag>;
      },
    },
    {
      title: 'API数',
      dataIndex: 'total_apis_num',
      key: 'total_apis_num',
      hideInSearch: true,
      render: (text) => {
        return <Tag color={'green'}>{text}</Tag>;
      },
    },
    {
      title: '自动执行',
      dataIndex: 'is_auto',
      key: 'is_auto',
      hideInSearch: true,
      valueType: 'switch',
      render: (_, record) => (
        <Switch
          value={record.is_auto}
          onChange={async (checked) => {
            return await setTaskAuto(checked, record.id);
          }}
        />
      ),
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      render: (_, record) => {
        return <Tag color={'blue'}>{record.level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.API_STATUS_ENUM,
      render: (text) => {
        return <Tag color={'warning'}>{text}</Tag>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      render: (_, record) => {
        return <Tag>{record.creatorName}</Tag>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (text, record, _) => {
        return (
          <>
            <a
              onClick={async () => {
                const { code, data } = await getNextTaskRunTime(record.uid);
                if (code === 0) {
                  message.success(data);
                }
              }}
            >
              下次运行时间
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                history.push(`/interface/task/detail/taskId=${record.id}`);
              }}
            >
              详情
            </a>
            <Popconfirm
              title={'确认删除？'}
              okText={'确认'}
              cancelText={'点错了'}
              onConfirm={async () => {
                const { code, msg } = await removeApiTaskBaseInfo(record.id);
                if (code === 0) {
                  message.success(msg);
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
