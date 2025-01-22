import { addEnv, editEnv, pageEnv, removeEnv } from '@/api/play/env';
import MyProTable from '@/components/Table/MyProTable';
import { IUIEnv } from '@/pages/UIPlaywright/uiTypes';
import { pageData } from '@/utils/somefunc';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProCard,
  ProColumns,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Divider, Form, message, Tag } from 'antd';
import { useCallback, useRef, useState } from 'react';

const Index = () => {
  const [envForm] = Form.useForm<IUIEnv>();
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageEnvs = useCallback(async (params: any, sort: any) => {
    const { code, data } = await pageEnv({
      ...params,
      sort: sort,
    });
    return pageData(code, data);
  }, []);

  const fetchAddEnv = async () => {
    const values = await envForm.validateFields();
    const { code, msg } = await addEnv(values);
    if (code === 0) {
      message.success(msg);
      setIsModalOpen(false);
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<IUIEnv>[] = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '10%',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.name}</Tag>;
      },
    },
    {
      title: '地址',
      dataIndex: 'domain',
      width: '70%',
      copyable: true,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '10%',
      fixed: 'right',
      render: (_, record, __, action) => {
        return (
          <>
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.uid);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={async () => {
                await removeEnv({ uid: record.uid }).then(({ code, msg }) => {
                  if (code === 0) {
                    message.success(msg);
                  }
                });
              }}
            >
              删除
            </a>
          </>
        );
      },
    },
  ];

  const AddMethod = (
    <Button type={'primary'} onClick={() => setIsModalOpen(true)}>
      <PlusOutlined />
      添加
    </Button>
  );

  const OnUpdate = async (_key: any, values: IUIEnv) => {
    const { code, msg } = await editEnv(values);
    if (code === 0) {
      message.success(msg);
      actionRef.current?.reload();
    }
  };
  return (
    <ProCard split={'horizontal'}>
      <ModalForm
        open={isModalOpen}
        form={envForm}
        onFinish={fetchAddEnv}
        onOpenChange={setIsModalOpen}
      >
        <ProCard style={{ marginTop: 10 }}>
          <ProFormText
            name={'name'}
            label={'环境名'}
            required
            rules={[{ required: true, message: '环境名必填' }]}
          />
          <ProFormText
            name={'domain'}
            label={'地址'}
            required
            rules={[{ required: true, message: '地址必填' }]}
          />
          <ProFormTextArea name={'description'} label={'描述'} />
        </ProCard>
      </ModalForm>
      <MyProTable
        actionRef={actionRef}
        request={pageEnvs}
        columns={columns}
        x={1000}
        toolBarRender={() => [AddMethod]}
        rowKey={'uid'}
        onSave={OnUpdate}
      />
    </ProCard>
  );
};

export default Index;
