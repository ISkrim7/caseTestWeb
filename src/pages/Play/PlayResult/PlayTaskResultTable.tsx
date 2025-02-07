import { pageUITaskResult } from '@/api/play/result';
import MyProTable from '@/components/Table/MyProTable';
import { UIMultipleReport } from '@/pages/Report/uiReport';
import { CONFIG } from '@/utils/config';
import { history } from '@@/core/history';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { message, Tag } from 'antd';
import dayjs from 'dayjs';
import { FC, useCallback, useRef } from 'react';

interface SelfProps {
  taskId?: number;
}

const PlayTaskResultTable: FC<SelfProps> = ({ taskId }) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const fetchTaskData = useCallback(
    async (params: any, sort: any) => {
      const newParams = {
        ...params,
        ...sort,
        taskId: taskId,
      };
      if (newParams.runDay && params.runDay.length > 1) {
        newParams.runDay = [
          dayjs(params.runDay[0]).format('YYYY-MM-DD'),
          dayjs(params.runDay[1]).format('YYYY-MM-DD'),
        ];
      }
      console.log(newParams);

      const { code, data, msg } = await pageUITaskResult(newParams);
      if (code === 0) {
        return {
          data: data.items,
          total: data.pageInfo.total,
          success: true,
          pageSize: data.pageInfo.page,
          current: data.pageInfo.limit,
        };
      } else {
        message.error(msg);
        return {
          success: false,
        };
      }
    },
    [taskId],
  );
  const columns: ProColumns<UIMultipleReport>[] = [
    {
      title: '报告ID',
      dataIndex: 'uid',
      fixed: 'left',
      width: '10%',
      renderText: (text, record) => (
        <a
          onClick={() => {
            history.push(`/report/history/uiTask/detail/uid=${record.id}`);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '任务名称',
      dataIndex: 'task_name',
      fixed: 'left',
      width: '14%',
      renderText: (text, record) => (
        <a
          onClick={() => {
            history.push(`/ui/task/detail/taskId=${record.task_id}`);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '执行人',
      dataIndex: 'starter_name',
      width: '10%',
      renderText: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '执行日期',
      dataIndex: 'run_day',
      valueType: 'dateRange',
      ellipsis: true,
      hideInTable: true,
      // search: {
      //   transform: (value) => {
      //     return {dayjs(value[0]).format("YYYY-MM-DD"),
      //       dayjs(value[1]).format("YYYY-MM-DD")""
      //   },
      // },
    },
    {
      title: '执行时间',
      dataIndex: 'start_time',
      hideInSearch: true,
      render: (_, record) => <Tag color={'blue'}>{record.start_time}</Tag>,
    },

    {
      title: '运行状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.UI_STATUS_ENUM,
      render: (_, record) => {
        return CONFIG.UI_STATUS_ENUM[record.status]?.tag;
      },
    },
    {
      title: '运行结果',
      dataIndex: 'result',
      valueType: 'select',
      valueEnum: CONFIG.UI_RESULT_ENUM,
      render: (_, record) => {
        return CONFIG.UI_RESULT_ENUM[record.result]?.tag;
      },
    },
    {
      title: '用时',
      dataIndex: 'total_usetime',
      hideInSearch: true,
      renderText: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <a
          onClick={() => {
            history.push(`/ui/report/detail/resultId=${record.id}`);
          }}
        >
          详情
        </a>
      ),
    },
  ];

  return (
    <MyProTable
      actionRef={actionRef}
      rowKey={'id'}
      columns={columns}
      request={fetchTaskData}
      x={1200}
    />
  );
};

export default PlayTaskResultTable;
