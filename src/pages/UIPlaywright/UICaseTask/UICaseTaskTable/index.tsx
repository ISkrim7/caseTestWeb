import { IObjGet, ISearch } from '@/api';
import { getTaskJobNextRunTime, handelAPSRunTask } from '@/api/aps';
import { delCaseTaskByUid, pageUICaseTask, setUITaskSwitch } from '@/api/ui';
import MyProTable from '@/components/Table/MyProTable';
import { IUITask } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { history, useModel } from '@@/exports';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Switch, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef } from 'react';

interface SelfProps {
  currentProject?: number;
  currentCasePart: number;
}

const Index: FC<SelfProps> = ({ currentProject, currentCasePart }) => {
  const { initialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

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
  const fetchPageUICaseTable = useCallback(
    async (params: ISearch, sort: IObjGet) => {
      const fetchData = {
        casePartId: currentCasePart,
        ...params,
        sort: sort,
      };
      const { code, data } = await pageUICaseTask(fetchData);
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
    [currentProject, currentCasePart],
  );
  useEffect(() => {
    actionRef.current?.reload();
  }, [currentCasePart, currentProject]);
  const columns: ProColumns<IUITask>[] = [
    {
      title: '任务编号',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      copyable: true,
      width: 100,
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      copyable: true,
      width: 150,
    },

    {
      title: '是否启动',
      dataIndex: 'switch',
      hideInSearch: true,
      width: 100,

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

      width: 100,

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
      width: 100,
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
      width: 50,
      render: (text) => <Tag color={'blue'}> {text}</Tag>,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: 100,
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      search: false,
      width: 100,
    },

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 140,

      render: (_, record) => {
        return (
          <>
            <a
              onClick={() => {
                history.push(`/ui/task/detail/taskId=${record.uid}`);
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
  const AddCaseTaskButton = (
    <Button
      type={'primary'}
      onClick={() => {
        history.push(`/ui/addUITask/projectId=${currentProject}`);
      }}
    >
      添加任务
    </Button>
  );
  return (
    <MyProTable
      columns={columns}
      pagination={{
        showQuickJumper: true,
        defaultPageSize: 10,
        showSizeChanger: true,
      }}
      rowKey={'uid'}
      request={fetchPageUICaseTable}
      actionRef={actionRef}
      toolBarRender={() => [AddCaseTaskButton]}
    />
  );
};

export default Index;
