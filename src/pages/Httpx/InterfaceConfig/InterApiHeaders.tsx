import {
  insertInterGlobalHeader,
  pageInterGlobalHeader,
  removeInterGlobalHeader,
  updateInterGlobalHeader,
} from '@/api/inter/interGlobal';
import { queryProjectEnum, queryProjects } from '@/components/CommonFunc';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceGlobalHeader } from '@/pages/Httpx/types';
import { pageData } from '@/utils/somefunc';
import { useAccess } from '@@/exports';
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

const InterApiHeaders = () => {
  const [hFrom] = Form.useForm<IInterfaceGlobalHeader>();
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

  const fetchInterApiHeaders = useCallback(async (values: any, sort: any) => {
    const { code, data } = await pageInterGlobalHeader({
      ...values,
      sort: sort,
    });
    return pageData(code, data);
  }, []);
  const setInterApiHeaders = async (_: any, values: IInterfaceGlobalHeader) => {
    const { code, msg } = await updateInterGlobalHeader(values);
    if (code === 0) {
      actionRef.current?.reload();
      message.success(msg);
    }
  };
  const columns: ProColumns<IInterfaceGlobalHeader>[] = [
    {
      title: 'project',
      dataIndex: 'project_id',
      hideInSearch: true,
      width: '10%',
      valueEnum: projectEnum,
      render: (text, record) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: 'Key',
      dataIndex: 'key',
      render: (text, record) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      render: (text, record) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: 'desc',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
      render: (text, record) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: '10%',
      render: (text, record, _, action) => {
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
                  await removeInterGlobalHeader(record.uid).then(
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

  const onFinish = async () => {
    const value = await hFrom.validateFields();
    const { code, msg } = await insertInterGlobalHeader(value);
    if (code === 0) {
      message.success(msg);
      hFrom.resetFields();
      setIsModalOpen(false);
      actionRef.current?.reload();
    }
  };
  return (
    <ProCard>
      <ModalForm<IInterfaceGlobalHeader>
        open={isModalOpen}
        form={hFrom}
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
        request={fetchInterApiHeaders}
        x={1000}
        toolBarRender={() => [
          <Button type={'primary'} onClick={() => setIsModalOpen(true)}>
            <PlusOutlined />
            添加请求头
          </Button>,
        ]}
        rowKey={'uid'}
        onSave={setInterApiHeaders}
      />
    </ProCard>
  );
};

export default InterApiHeaders;
