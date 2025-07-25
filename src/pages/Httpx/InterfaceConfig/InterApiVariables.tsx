import {
  insertInterGlobalVariable,
  pageInterGlobalVariable,
  removeInterGlobalVariable,
  updateInterGlobalVariable,
} from '@/api/inter/interGlobal';
import { queryProjectEnum, queryProjects } from '@/components/CommonFunc';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceGlobalVariable } from '@/pages/Httpx/types';
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
import { ProFormSelect } from '@ant-design/pro-form';
import { Button, Form, message, Tag } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccess } from 'umi';

const InterApiVariables = () => {
  const [varFrom] = Form.useForm<IInterfaceGlobalVariable>();
  const { isAdmin } = useAccess();
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [projectEnum, setProjectEnum] = useState<any>([]);
  useEffect(() => {
    queryProjects(setProjects).then();
    queryProjectEnum(setProjectEnum).then();
  }, []);
  const columns: ProColumns<IInterfaceGlobalVariable>[] = [
    {
      title: 'project',
      dataIndex: 'project_id',
      //hideInSearch: true,
      width: '10%',
      valueEnum: projectEnum,
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: 'Key',
      dataIndex: 'key',
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: 'desc',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: '10%',
      render: (__, record, _, action) => {
        return isAdmin
          ? [
              <a
                onClick={async () => {
                  action?.startEditable?.(record.uid);
                }}
              >
                编辑
              </a>,
              <a
                onClick={async () => {
                  await removeInterGlobalVariable(record.uid).then(
                    ({ code, msg }) => {
                      if (code === 0) {
                        message.success(msg);
                        actionRef.current?.reload();
                      }
                    },
                  );
                }}
              >
                删除
              </a>,
            ]
          : [
              <a
                onClick={async () => {
                  action?.startEditable?.(record.uid);
                }}
              >
                编辑
              </a>,
            ];
      },
    },
  ];

  const fetchInterApiVariables = useCallback(async (values: any, sort: any) => {
    const { code, data } = await pageInterGlobalVariable({
      ...values,
      sort: sort,
    });
    return pageData(code, data);
  }, []);

  const setInterApiVariables = async (
    _: any,
    values: IInterfaceGlobalVariable,
  ) => {
    const { code, msg } = await updateInterGlobalVariable(values);
    if (code === 0) {
      actionRef.current?.reload();
      message.success(msg);
    }
  };

  const onFinish = async () => {
    const value = await varFrom.validateFields();
    const { code, msg } = await insertInterGlobalVariable(value);
    if (code === 0) {
      message.success(msg);
      varFrom.resetFields();
      setIsModalOpen(false);
      actionRef.current?.reload();
    }
  };
  return (
    <ProCard>
      <ModalForm<IInterfaceGlobalVariable>
        open={isModalOpen}
        form={varFrom}
        onFinish={onFinish}
        onOpenChange={setIsModalOpen}
      >
        <ProFormSelect
          options={projects}
          label={'所属项目'}
          name={'project_id'}
          required={true}
        />
        <ProFormText
          name={'key'}
          label={'key'}
          required
          rules={[{ required: true, message: 'key必填' }]}
        />
        <ProFormText
          name={'value'}
          label={'value'}
          required
          rules={[{ required: true, message: 'value必填' }]}
        />
        <ProFormTextArea name={'description'} label={'desc'} />
      </ModalForm>
      <MyProTable
        actionRef={actionRef}
        columns={columns}
        request={fetchInterApiVariables}
        x={1000}
        toolBarRender={() => [
          <Button type={'primary'} onClick={() => setIsModalOpen(true)}>
            <PlusOutlined />
            添加变量
          </Button>,
        ]}
        rowKey={'uid'}
        onSave={setInterApiVariables}
      />
    </ProCard>
  );
};

export default InterApiVariables;
