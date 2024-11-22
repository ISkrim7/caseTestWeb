import { addMethod, delMethod, queryMethodOptions } from '@/api/ui';
import MyProTable from '@/components/Table/MyProTable';
import { IUIMethod } from '@/pages/UIPlaywright/uiTypes';
import { useModel } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProCard,
  ProColumns,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message, Tag } from 'antd';
import { useEffect, useState } from 'react';

const opt = [
  { label: '是', value: 1 },
  { label: '否', value: 2 },
];
const Index = () => {
  const [methodForm] = Form.useForm<{
    value: string;
    label: string;
    desc?: string;
  }>();
  const [methodDataSource, setMethodDataSource] = useState<IUIMethod[]>();
  const [edit, setEdit] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    queryMethodOptions().then(({ code, data }) => {
      if (code === 0) {
        setMethodDataSource(data);
      }
    });
  }, [edit]);
  const AddMethod = (
    <>
      {initialState?.currentUser?.isAdmin ? (
        <Button type={'primary'} onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
          添加方法
        </Button>
      ) : null}
    </>
  );
  const onMethodFormFinish = async () => {
    const values = await methodForm.validateFields();
    await addMethod(values).then(({ code, msg }) => {
      if (code === 0) {
        message.success(msg);
        setIsModalOpen(false);
        setEdit(edit + 1);
      }
    });
  };

  const columns: ProColumns<IUIMethod>[] = [
    {
      title: '名称',
      dataIndex: 'label',
      fixed: 'left',
      width: '15%',
    },
    {
      title: '值',
      dataIndex: 'value',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.value}</Tag>;
      },
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: '提取器',
      width: '5%',
      dataIndex: 'need_locator',
      render: (_, record) => {
        return (
          <Tag color={record.need_locator === 1 ? 'green' : 'red'}>
            {record.need_locator === 1 ? '是' : '否'}
          </Tag>
        );
      },
    },
    {
      title: '输入值',
      dataIndex: 'need_value',
      width: '5%',

      render: (_, record) => {
        return (
          <Tag color={record.need_value === 1 ? 'green' : 'red'}>
            {record.need_value === 1 ? '是' : '否'}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: '5%',
      render: (text, record, _, action) => [
        <a
          onClick={async () => {
            await delMethod({ id: record.id }).then(({ code, msg }) => {
              if (code === 0) {
                message.success(msg);
                setEdit(edit + 1);
              }
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <ProCard split={'horizontal'}>
      <ModalForm
        open={isModalOpen}
        form={methodForm}
        onFinish={onMethodFormFinish}
        onOpenChange={setIsModalOpen}
      >
        <ProCard style={{ marginTop: 10 }}>
          <ProFormText
            name={'label'}
            label={'方法名'}
            required
            rules={[{ required: true, message: '方法名必填' }]}
          />
          <ProFormText
            name={'value'}
            label={'方法值'}
            required
            rules={[{ required: true, message: '方法值必填' }]}
          />
          <ProFormText name={'desc'} label={'方法描述'} />
          <ProFormSelect
            name={'need_locator'}
            options={opt}
            label={'是否需要定位器'}
            initialValue={1}
          />
          <ProFormSelect
            name={'need_value'}
            options={opt}
            label={'是否需要输入值'}
            initialValue={1}
          />
        </ProCard>
      </ModalForm>
      <MyProTable
        search={false}
        columns={columns}
        dataSource={methodDataSource}
        reload={() => {
          setEdit(edit + 1);
        }}
        x={1000}
        toolBarRender={() => [AddMethod]}
        rowKey={'id'}
      />
    </ProCard>
  );
};

export default Index;
