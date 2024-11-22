import { ISearch } from '@/api';
import { perfInspection } from '@/api/cbsAPI/cbs';
import HistoryTable from '@/pages/Report/History/component/HistoryTable';
import { IPerfInspection } from '@/pages/Report/History/PerfInsp/PerfResultAPI';
import PerfResultTab from '@/pages/Report/History/PerfInsp/PerfResultTab';
import { ProColumns } from '@ant-design/pro-components';
import { message, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const Index = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentResultUid, setCurrentResultUid] = useState<string>();

  const fetchData = async (params: any, sort: any) => {
    const body: ISearch = {
      ...params,
      sort: { ...sort },
    };
    const { code, data, msg } = await perfInspection({ ...body });
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

  const columns: ProColumns<IPerfInspection>[] = [
    {
      title: 'UID',
      dataIndex: 'uid',
      ellipsis: true,
      renderText: (text, record, index, action) => (
        <a
          onClick={() => {
            setCurrentResultUid(record.uid);
            setOpen(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '环境',
      dataIndex: 'uat',
      render: (text, record, index, action) => {
        if (record.uat) {
          return <Tag color={'blue'}>线上</Tag>;
        } else {
          return <Tag color={'blue'}>UAT</Tag>;
        }
      },
    },
    {
      title: '执行标题',
      dataIndex: 'title',
      search: false,
      renderText: (text, record, index, action) => (
        <a
          onClick={() => {
            setCurrentResultUid(record.uid);
            setOpen(true);
          }}
        >
          {record.title}
        </a>
      ),
    },
    {
      title: '执行人',
      dataIndex: 'runner',
      renderText: (text, record, index, action) => (
        <Tag color={'blue'}>{record.runner}</Tag>
      ),
    },
    {
      title: '测试结果',
      dataIndex: 'result',
      valueEnum: { 1: 'success', 0: 'fail' },
      renderText: (text, record, index, action) => (
        <Tag color={record.result ? 'green' : 'red'}>
          {record.result ? 'success' : 'fail'}
        </Tag>
      ),
    },
    {
      title: '执行日期',
      dataIndex: 'runDay',
      valueType: 'date',
    },
    {
      title: '执行时间',
      key: 'beginTime',
      sorter: true,
      dataIndex: 'beginTime',
      valueType: 'dateTime',
    },
    {
      title: '执行日期范围',
      key: 'beginTime',
      dataIndex: 'beginTime',
      valueType: 'dateMonthRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          const [startOfMonth, endOfMonth] = value; // 获取选择月份的第一天（0点）
          // 使用dayjs将字符串转换为日期，并设置为月初和月末
          const startDate = dayjs(startOfMonth)
            .startOf('month')
            .format('YYYY-MM');
          const endDate = dayjs(endOfMonth).endOf('month').format('YYYY-MM');
          return {
            startTime: startDate,
            endTime: endDate,
          };
        },
      },
    },
    {
      title: '用时时间',
      dataIndex: 'useTime',
      search: false,
      renderText: (_, record) => <Tag color={'blue'}>{record.useTime}</Tag>,
    },
  ];

  return (
    <div>
      {currentResultUid ? (
        <PerfResultTab
          open={open}
          setOpen={setOpen}
          currentResultUid={currentResultUid}
        />
      ) : null}
      <HistoryTable request={fetchData} title={'巡检批次'} columns={columns} />
    </div>
  );
};

export default Index;
