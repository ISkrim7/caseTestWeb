import { pageUITaskReport } from '@/api/ui';
import HistoryTable from '@/pages/Report/History/component/HistoryTable';
import { UIMultipleReport } from '@/pages/Report/uiReport';
import { CONFIG } from '@/utils/config';
import { history } from '@@/core/history';
import { ProColumns } from '@ant-design/pro-components';
import { message, Tag } from 'antd';
import dayjs from 'dayjs';
import { FC, useCallback } from 'react';

interface SelfProps {
  taskId?: number;
}

const Index: FC<SelfProps> = ({ taskId }) => {
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

      const { code, data, msg } = await pageUITaskReport(newParams);
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
      title: 'UID',
      dataIndex: 'uid',
      hideInSearch: taskId !== undefined,
      fixed: 'left',
      width: '10%',
      renderText: (text, record) => (
        <a
          onClick={() => {
            history.push(`/report/history/uiTask/detail/uid=${record.uid}`);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      fixed: 'left',
      hideInSearch: taskId !== undefined,
      width: '14%',
      renderText: (text, record) => (
        <a
          onClick={() => {
            history.push(`/ui/task/detail/taskId=${record.taskUid}`);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '执行人',
      dataIndex: 'starterName',
      width: '10%',
      renderText: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '执行日期',
      dataIndex: 'runDay',
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
      dataIndex: 'totalUseTime',
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
            history.push(`/report/history/uiTask/detail/uid=${record.uid}`);
          }}
        >
          详情
        </a>
      ),
    },
  ];

  return (
    <HistoryTable
      request={fetchTaskData}
      title={'批量构建历史'}
      columns={columns}
    />
  );
};

export default Index;
