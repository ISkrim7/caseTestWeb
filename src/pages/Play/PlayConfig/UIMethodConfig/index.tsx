import {
  addMethod,
  pageMethods,
  removeMethod,
  updateMethod,
} from '@/api/play/method';
import MyProTable from '@/components/Table/MyProTable';
import { IUIMethod } from '@/pages/UIPlaywright/uiTypes';
import { pageData } from '@/utils/somefunc';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProCard,
  ProColumns,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message, Tag } from 'antd';
import { useCallback, useRef, useState } from 'react';

const Index = () => {
  const [methodForm] = Form.useForm<IUIMethod>();

  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pageUIMethod = useCallback(async (values: any, sort: any) => {
    const { code, data } = await pageMethods({ ...values, sort: sort });
    return pageData(code, data);
  }, []);

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
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '提取器',
      width: '10%',
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
      width: '10%',
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
      width: '10%',
      render: (text, record, _, action) => [
        <a
          onClick={async () => {
            action?.startEditable?.(record.uid);
          }}
        >
          编辑
        </a>,
        <a
          onClick={async () => {
            await removeMethod(record.uid).then(({ code, msg }) => {
              if (code === 0) {
                message.success(msg);
              }
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const AddMethod = (
    <Button type={'primary'} onClick={() => setIsModalOpen(true)}>
      <PlusOutlined />
      添加
    </Button>
  );
  const OnUpdateMethod = async (_: any, values: IUIMethod) => {
    const { code, msg } = await updateMethod(values);
    if (code === 0) {
      actionRef.current?.reload();
      message.success(msg);
    }
  };
  const onMethodFormFinish = async (values: IUIMethod) => {
    const { code, msg } = await addMethod(values);
    if (code === 0) {
      message.success(msg);
      actionRef.current?.reload();
      setIsModalOpen(false);
    }
  };
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
          <ProFormText name={'description'} label={'方法描述'} />
          <ProFormSelect
            name={'need_locator'}
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 2 },
            ]}
            label={'是否需要定位器'}
            initialValue={1}
          />
          <ProFormSelect
            name={'need_value'}
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 2 },
            ]}
            label={'是否需要输入值'}
            initialValue={1}
          />
        </ProCard>
      </ModalForm>
      <MyProTable
        actionRef={actionRef}
        columns={columns}
        request={pageUIMethod}
        x={1000}
        toolBarRender={() => [AddMethod]}
        rowKey={'uid'}
        onSave={OnUpdateMethod}
      />
    </ProCard>
  );
};

export default Index;
