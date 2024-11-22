import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { FC, useRef } from 'react';

interface SelfProps {
  request: any;
  title: string;
  columns: ProColumns[];
}

const HistoryTable: FC<SelfProps> = (props) => {
  const { request, title, columns } = props;
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const formatDate = (value: dayjs.Dayjs, valueType: string): string => {
    return value.format('YYYY-MM-DD HH:mm:ss');
  };
  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      rowKey="uid"
      request={request}
      scroll={{ x: 1300 }}
      options={{
        setting: {
          listsHeight: 400,
        },
        reload: true,
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter={formatDate}
      headerTitle={title}
    />
  );
};

export default HistoryTable;
