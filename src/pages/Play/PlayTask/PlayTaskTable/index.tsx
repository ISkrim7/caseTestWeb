import { getTaskJobNextRunTime, handelAPSRunTask } from '@/api/aps';
import {
  delCaseTaskByUid,
  pageUICaseTask,
  setUITaskSwitch,
} from '@/api/play/task';
import MyProTable from '@/components/Table/MyProTable';
import { IUITask } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { history } from '@@/core/history';
import { useModel } from '@@/exports';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Switch, Tag } from 'antd';
import { FC, useCallback, useRef } from 'react';

interface SelfProps {
  currentProjectId?: number;
  currentPartId?: number;
  perKey: string;
}

const Index: FC<SelfProps> = (props) => {
  const { currentProjectId, currentPartId, perKey } = props;
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const { initialState } = useModel('@@initialState');

  const fetchPageUITaskTable = useCallback(
    async (params: any, sort: any) => {
      const { code, data } = await pageUICaseTask({
        case_part_id: currentPartId,
        sort: sort,
        ...params,
      });
      return pageData(code, data);
    },
    [currentProjectId, currentPartId],
  );

  const setTaskSwitch = async (uid: string, flag: boolean) => {
    const { code } = await setUITaskSwitch({ uid: uid, switch: flag });
    if (code === 0) {
      if (flag) {
        message.success('已重启任务');
      } else {
        message.success('已暂停任务');
      }
    }
    actionRef.current?.reload();
  };

  const columns: ProColumns<IUITask>[] = [
    {
      title: '任务编号',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      width: '10%',
      copyable: true,
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
    },

    {
      title: '是否启动',
      dataIndex: 'switch',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            onClick={async (checked) => {
              await setTaskSwitch(record.uid, checked);
            }}
            value={record.switch}
          />
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.UI_LEVEL_ENUM,
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
      valueEnum: CONFIG.UI_STATUS_ENUM,
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
      dataIndex: 'ui_case_num',
      hideInSearch: true,
      render: (text) => <Tag color={'blue'}> {text}</Tag>,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'date',
      sorter: true,
      search: false,
    },

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                history.push(`/ui/task/detail/taskId=${record.id}`);
              }}
            >
              详情
            </a>
            <Divider type={'vertical'} />
            <a
              onClick={async () => {
                const { code, msg } = await handelAPSRunTask({
                  taskId: record.id,
                  userId: initialState!.currentUser!.id!,
                });
                if (code === 0) {
                  message.success(msg);
                  actionRef.current?.reload();
                }
              }}
            >
              手动执行
            </a>
            <Divider type={'vertical'} />
            <a
              onClick={async () => {
                const { code, data, msg } = await getTaskJobNextRunTime({
                  jobId: record.uid,
                });
                if (code === 0) {
                  message.success(data);
                } else {
                  message.error(msg);
                }
              }}
            >
              下次执行时间
            </a>
            {initialState?.currentUser?.id === record.creator ||
            initialState?.currentUser?.isAdmin ? (
              <Popconfirm
                title={'确认删除？'}
                okText={'确认'}
                cancelText={'点错了'}
                onConfirm={async () => {
                  await delCaseTaskByUid({ taskId: record.uid }).then(() => {
                    actionRef.current?.reload();
                  });
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
        history.push(`/ui/addTask`);
      }}
    >
      添加任务
    </Button>
  );
  return (
    <MyProTable
      persistenceKey={perKey}
      columns={columns}
      rowKey={'id'}
      x={1000}
      request={fetchPageUITaskTable}
      actionRef={actionRef}
      toolBarRender={() => [AddTaskButton]}
    />
  );
};

export default Index;
