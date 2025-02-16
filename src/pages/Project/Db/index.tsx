import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import DBForm from '@/pages/Project/Db/DBDrawer';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发’
  const [open, setOpen] = useState(false);

  const pageDbs = async (params: any, sort: any) => {};
  const isReload = async () => {
    await actionRef.current?.reload();
  };

  const columns: ProColumns[] = [
    {
      title: 'db_type',
      dataIndex: 'db_type',
      valueType: 'select',
      valueEnum: {
        mysql: { text: 'mysql', value: 1 },
        oracle: { text: 'oracle', value: 2 },
        redis: { text: 'redis', value: 3 },
      },
    },
    {
      title: 'name',
      dataIndex: 'name',
      ellipsis: true,
      width: '10%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: 'desc',
      dataIndex: 'description',
      width: '10%',
    },
    {
      title: 'database',
      dataIndex: 'database',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'host',
      dataIndex: 'host',
    },
    {
      title: 'port',
      dataIndex: 'port',
    },
    {
      title: 'username',
      dataIndex: 'username',
      hideInTable: true,
    },
    {
      title: 'password',
      dataIndex: 'password',
      hideInTable: true,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      ellipsis: true,
      editable: false,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.uid);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <>
      <MyDrawer name={''} width={'20%'} open={open} setOpen={setOpen}>
        <DBForm />
      </MyDrawer>
      <MyProTable
        toolBarRender={() => [
          <Button onClick={() => setOpen(true)}>添加DB</Button>,
        ]}
        headerTitle={'DB配置'}
        actionRef={actionRef}
        columns={columns}
        request={pageDbs}
        rowKey={'uid'}
      />
    </>
  );
};

export default Index;
