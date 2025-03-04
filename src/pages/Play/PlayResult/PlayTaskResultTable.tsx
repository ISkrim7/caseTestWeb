import { IModuleEnum, IObjGet } from '@/api';
import { pageUITaskResult } from '@/api/play/result';
import { queryProjectEnum } from '@/components/CommonFunc';
import MyProTable from '@/components/Table/MyProTable';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum, pageData } from '@/utils/somefunc';
import { history } from '@@/core/history';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  taskId?: number;
}

const PlayTaskResultTable: FC<SelfProps> = ({ taskId }) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [selectPartId, setSelectPartId] = useState<number>();

  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  // 查询所有project 设置枚举
  useEffect(() => {
    queryProjectEnum(setProjectEnumMap).then();
  }, []);

  useEffect(() => {
    if (selectProjectId) {
      fetchModulesEnum(selectProjectId, ModuleEnum.API, setModuleEnum).then();
    }
  }, [selectProjectId]);
  const fetchTaskData = useCallback(
    async (params: any, sort: any) => {
      const newParams = {
        ...params,
        ...sort,
        module_type: ModuleEnum.UI_TASK,
        taskId: taskId,
      };
      if (newParams.run_day && params.run_day.length > 1) {
        newParams.run_day = [
          dayjs(params.runDay[0]).format('YYYY-MM-DD'),
          dayjs(params.runDay[1]).format('YYYY-MM-DD'),
        ];
      }
      const { code, data } = await pageUITaskResult(newParams);
      return pageData(code, data);
    },
    [taskId],
  );
  const columns: ProColumns<any>[] = [
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
      title: '项目',
      dataIndex: 'project_id',
      hideInTable: true,
      valueType: 'select',
      valueEnum: { ...projectEnumMap },
      // valueEnum: { 1: { text: '全部'} },
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
      dataIndex: 'part_id',
      hideInTable: true,
      valueType: 'treeSelect',
      initialValue: selectPartId,
      fieldProps: {
        value: selectPartId,
        onSelect: (value: number) => {
          setSelectPartId(value);
        },
        treeData: moduleEnum,
        fieldNames: {
          label: 'title',
        },
      },
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
      search: {
        transform: (value) => {
          return {
            run_day: [
              dayjs(value[0]).format('YYYY-MM-DD'),
              dayjs(value[1]).format('YYYY-MM-DD'),
            ],
          };
        },
      },
      // search: {
      //   transform: (value) => {
      //     return {dayjs(value[0]).format("YYYY-MM-DD"),
      //       dayjs(value[1]).format("YYYY-MM-DD")""
      //   },
      // },
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
      title: '执行时间',
      dataIndex: 'start_time',
      hideInSearch: true,
      render: (_, record) => <Tag color={'blue'}>{record.start_time}</Tag>,
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
      x={1000}
    />
  );
};

export default PlayTaskResultTable;
