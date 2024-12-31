import { clearApiRecord, queryApiRecord, startApiRecord } from '@/api/inter';
import MyProTable from '@/components/Table/MyProTable';
import RecordDetail from '@/pages/Httpx/InterfaceApiRecord/RecordDetail';
import { IInterfaceAPIRecord } from '@/pages/Httpx/types';
import { CONFIG } from '@/utils/config';
import { LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProCard,
  ProColumns,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import { useRef, useState } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const { API_REQUEST_METHOD } = CONFIG;

  const [recordStatus, setRecordStatus] = useState(false);
  const [recordDataSource, setRecordDataSource] =
    useState<IInterfaceAPIRecord[]>();
  const [polling, setPolling] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const StartRecord = async (values: any) => {
    setRecordStatus(true);
    setPolling(3000);
    const { code, data } = await startApiRecord(values);
    if (code === 0) {
      setOpenModal(false);
      message.success('开始录制');
    }
  };
  const StopRecord = async () => {
    setPolling(0);
    setRecordStatus(false);
  };

  const queryRecord = async () => {
    const { code, data } = await queryApiRecord();
    if (code === 0) {
      setRecordDataSource(data);
      return data;
    }
  };

  const columns: ProColumns<IInterfaceAPIRecord>[] = [
    {
      title: 'URL',
      dataIndex: 'url',
      copyable: true,
      render: (_, record) => {
        return <a>{record.url}</a>;
      },
    },
    {
      title: 'Method',
      dataIndex: 'method',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.method}</Tag>;
      },
    },
    {
      title: 'Time',
      dataIndex: 'create_time',
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
      {!recordStatus ? (
        <>
          <Button type={'primary'} onClick={() => setOpenModal(true)}>
            <PlayCircleOutlined />
            开始录制
          </Button>
        </>
      ) : (
        <Button type={'primary'} onClick={StopRecord}>
          <LoadingOutlined />
          停止录制
        </Button>
      )}
      {recordDataSource && recordDataSource?.length > 0 && (
        <Button
          type={'primary'}
          onClick={async () => {
            const { code } = await clearApiRecord();
            if (code === 0) {
              setRecordDataSource([]);
              actionRef.current?.reload();
            }
          }}
        >
          清空
        </Button>
      )}
    </>
  );

  const expandedRowRender = (record: IInterfaceAPIRecord) => {
    return <RecordDetail interfaceAPIRecordInfo={record} />;
  };
  return (
    <ProCard>
      <ModalForm
        open={openModal}
        onOpenChange={setOpenModal}
        onFinish={StartRecord}
      >
        <ProFormSelect
          mode={'multiple'}
          name={'method'}
          options={API_REQUEST_METHOD}
          label={'目标方法'}
        />
        <ProFormText
          name={'url'}
          label={'目标url'}
          placeholder={'请输入URL 以过滤请求'}
        />
      </ModalForm>
      <MyProTable
        actionRef={actionRef}
        // @ts-ignore
        polling={polling}
        expandable={{
          expandedRowRender,
        }}
        search={false}
        columns={columns}
        rowKey={'uid'}
        request={queryRecord}
        dataSource={recordDataSource}
        toolBarRender={() => [recordBut]}
      />
    </ProCard>
  );
};

export default Index;
