import { pageInterfaceResult } from '@/api/interface';
import InterResponse from '@/pages/Interface/InterResponse';
import HistoryTable from '@/pages/Report/History/component/HistoryTable';
import { ProColumns } from '@ant-design/pro-components';
import { message, Tag } from 'antd';
import { FC, useState } from 'react';

interface SelfProps {
  interfaceUid?: string;
}

const Index: FC<SelfProps> = ({ interfaceUid }) => {
  const [responseUid, setResponseUid] = useState<string>();
  const [openResult, setOpenResult] = useState(false);

  /**
   * 数据请求
   * @param params
   */
  const fetchData = async (params: any) => {
    const newParams = {
      ...params,
      interfaceUid: interfaceUid,
    };
    const { code, data, msg } = await pageInterfaceResult(newParams);
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

  const columns: ProColumns[] = [
    {
      title: '构建UID',
      dataIndex: 'uid',
      ellipsis: true,
      hideInSearch: interfaceUid !== undefined,
      renderText: (text, record) => (
        <a
          onClick={() => {
            setOpenResult(true);
            setResponseUid(record.uid);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '用例ID',
      dataIndex: 'interfaceUid',
      hidden: true,
    },
    {
      title: '执行用例',
      dataIndex: 'interfaceName',
      search: false,
      renderText: (text, record) => (
        <a
          onClick={() => {
            setOpenResult(true);
            setResponseUid(record.uid);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: { SUCCESS: { text: '成功' }, ERROR: { text: '失败' } },
      renderText: (text, record) => (
        <Tag color={text === 'SUCCESS' ? 'green' : 'red'}>{record.status}</Tag>
      ),
    },
    {
      title: '执行人',
      dataIndex: 'starterName',
      renderText: (_, record) => <Tag color={'blue'}>{record.starterName}</Tag>,
    },
    {
      title: '执行时间',
      dataIndex: 'create_time',
      renderText: (_, record) => <Tag color={'blue'}>{record.create_time}</Tag>,
    },
  ];

  return (
    <>
      <InterResponse
        open={openResult}
        setOpen={setOpenResult}
        resultUid={responseUid}
      />
      <HistoryTable
        request={fetchData}
        title={'单个构建历史'}
        columns={columns}
      />
    </>
  );
};

export default Index;
