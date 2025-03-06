import { pageDBConfig, removeDBConfig } from '@/api/base/dbConfig';
import MyProTable from '@/components/Table/MyProTable';
import DBModel from '@/pages/Project/Db/DBModel';
import { pageData } from '@/utils/somefunc';
import { useAccess } from '@@/exports';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { Divider } from 'antd';
import { useRef, useState } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发’
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAccess();
  const [currentDBConfig, setCurrentDBConfig] = useState<string>();
  const queryDbs = async (params: any, sort: any) => {
    const { code, data } = await pageDBConfig({ ...params, sort: sort });
    return pageData(code, data);
  };
  const isReload = async () => {
    await actionRef.current?.reload();
    setOpen(false);
  };

  const columns: ProColumns[] = [
    {
      title: 'db_type',
      dataIndex: 'db_type',
      valueType: 'select',
      valueEnum: {
        1: { text: 'mysql', value: 1 },
        2: { text: 'oracle', value: 2 },
        3: { text: 'redis', value: 3 },
      },
    },
    {
      title: 'name',
      dataIndex: 'db_name',
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
      title: 'database',
      dataIndex: 'db_database',
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
      render: (text, record, _, action) => {
        if (isAdmin) {
          return (
            <>
              <a
                key="editable"
                onClick={() => {
                  setCurrentDBConfig(record.uid);
                  setOpen(true);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                onClick={async () => {
                  const { code } = await removeDBConfig({ uid: record.uid });
                  if (code === 0) {
                    await actionRef.current?.reload();
                  }
                }}
              >
                删除
              </a>
            </>
          );
        }
      },
    },
  ];

  return (
    <ProCard>
      <MyProTable
        toolBarRender={() => [
          <DBModel
            callBack={isReload}
            currentDBConfigId={currentDBConfig}
            open={open}
            setOpen={setOpen}
          />,
        ]}
        headerTitle={'DB配置'}
        actionRef={actionRef}
        columns={columns}
        request={queryDbs}
        rowKey={'uid'}
      />
    </ProCard>
  );
};

export default Index;
