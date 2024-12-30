import { queryApiRecord } from '@/api/inter';
import MyProTable from '@/components/Table/MyProTable';
import { LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useEffect, useState } from 'react';

const Index = () => {
  const [recordStatus, setRecordStatus] = useState(false);
  const [recordDataSrouce, setRecordDataSource] = useState<any[]>();
  useEffect(() => {
    if (recordStatus) {
      queryApiRecord().then(async ({ code, data }) => {
        if (code === 0) {
          const new_data = data.map((item, index) => {
            return {
              id: index,
              ...item,
            };
          });
          console.log(new_data);
          setRecordDataSource(new_data);
        }
      });
    }
  }, [recordStatus]);
  const columns: ProColumns[] = [
    {
      title: 'URL',
      dataIndex: 'url',
      copyable: true,
    },
    {
      title: 'Method',
      dataIndex: 'method',
    },
    {
      title: 'Option',
      dataIndex: 'options',
      render: (text, record) => {
        return <a>详情</a>;
      },
    },
  ];

  const recordBut = (
    <>
      <Button type="primary" onClick={() => setRecordStatus(!recordStatus)}>
        {!recordStatus ? (
          <>
            <PlayCircleOutlined style={{ marginRight: 5 }} />
            开始录制
          </>
        ) : (
          <>
            <LoadingOutlined style={{ marginRight: 5 }} />
            停止录制
          </>
        )}
      </Button>
    </>
  );
  return (
    <MyProTable
      search={false}
      columns={columns}
      rowKey={'id'}
      dataSource={recordDataSrouce}
      toolBarRender={() => [recordBut]}
    />
  );
};

export default Index;
