import { ISearch } from '@/api';
import { pageInterfacesResult } from '@/api/interface';
import HistoryTable from '@/pages/Report/History/component/HistoryTable';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { message, Tag } from 'antd';
import { FC, useEffect, useRef } from 'react';
import { history } from 'umi';

interface SelfProps {
  taskId?: number;
}

const Index: FC<SelfProps> = ({ taskId }) => {
  /**
   * 数据请求
   * @param params
   */
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  const fetchData = async (params: ISearch) => {
    const newParams = {
      ...params,
      taskId: taskId,
    };
    const { code, data, msg } = await pageInterfacesResult(newParams);
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
  };

  useEffect(() => {
    if (taskId) {
      actionRef.current?.reload();
    }
  }, [taskId]);

  const columns: ProColumns[] = [
    {
      title: 'UID',
      dataIndex: 'uid',
      ellipsis: true,
      renderText: (text, record) => (
        <a
          onClick={() => {
            history.push(`/report/history/detail/uid=${record.uid}`);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '执行人',
      dataIndex: 'starterName',
      renderText: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '执行时间',
      dataIndex: 'create_time',
      renderText: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      renderText: (_, record) => (
        <Tag color={record.status === 'DONE' ? 'green' : 'blue'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <a
          onClick={() => {
            history.push(`/report/history/detail/uid=${record.uid}`);
          }}
        >
          详情
        </a>
      ),
    },
  ];

  return (
    <HistoryTable
      request={fetchData}
      title={'批量构建历史'}
      columns={columns}
    />
  );
};

export default Index;
