import React, { FC, useState } from 'react';
import { modifyPageInfo } from '@/api/cbsAPI/modifyAPI';
import { message, Tag } from 'antd';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { IModifyInfo } from '@/pages/Report/History/Base/IBaseModify';
import HistoryTable from '@/pages/Report/History/component/HistoryTable';
import BaseModifyDraw from '@/pages/Report/History/Base/BaseModifyDraw';

const Index: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentResultUid, setCurrentResultUid] = useState<string>();

  const fetchData = async (params: any) => {
    const { code, data, msg } = await modifyPageInfo({ ...params });
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
  const columns: ProColumns<IModifyInfo>[] = [
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
      title: '运行状态',
      dataIndex: 'status',
      search: false,
      renderText: (text, record, index, action) => (
        <Tag color={record.status ? 'blue' : 'red'}>{record.status}</Tag>
      ),
    },
    {
      title: '用时时间',
      dataIndex: 'useTime',
      search: false,
      renderText: (text, record, index, action) => (
        <Tag color={'blue'}>{record.useTime}</Tag>
      ),
    },
    {
      title: '结果',
      dataIndex: 'result',
      search: false,
      renderText: (text, record, index, action) => (
        <Tag color={record.result ? 'green' : 'red'}>
          {record.result ? 'success' : 'fail'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      {currentResultUid ? (
        <BaseModifyDraw
          open={open}
          setOpen={setOpen}
          currentResultUid={currentResultUid}
        />
      ) : null}
      <HistoryTable
        request={fetchData}
        title={'异动巡检批次'}
        columns={columns}
      />
    </div>
  );
};

export default Index;
