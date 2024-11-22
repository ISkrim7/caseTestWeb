import { IObjGet } from '@/api';
import {
  addCollectInfo,
  delCollectInfo,
  IAddCollectInfo,
  ICollectInfo,
  pageCollectInfo,
  putCollectInfo,
} from '@/api/cbsAPI/cbs';
import MyProTable from '@/components/Table/MyProTable';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, message, Space, Tag } from 'antd';
import { useRef } from 'react';

const E: IObjGet = {
  bug: 'BUG',
  house: '房',
  client: '客',
  sign: '签约',
  other: '其他',
  xq: '需',
};

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [form] = Form.useForm<IAddCollectInfo>();

  const onFinish = async () => {
    const body = form.getFieldsValue();
    const { code, msg } = await addCollectInfo(body);
    if (code === 0) {
      message.success(msg);
      actionRef.current?.reload();
      return true;
    }
  };

  const ModalFormButton = (
    <ModalForm<IAddCollectInfo>
      title={'添加需求&BUG'}
      trigger={
        <Button type={'primary'}>
          <PlusOutlined />
          添加
        </Button>
      }
      form={form}
      autoFocusFirstInput
      onFinish={onFinish}
    >
      <ProForm.Group>
        <ProFormText width="md" name="title" label="标题" required />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="tag"
          label="标签"
          required
          options={[
            {
              label: 'BUG',
              value: 'bug',
            },
            {
              label: '需求',
              value: 'xq',
            },
          ]}
        />
        <ProFormSelect
          width="md"
          name="model"
          label="模块"
          required
          options={[
            {
              label: '房源',
              value: 'house',
            },
            {
              label: '客源',
              value: 'client',
            },
            {
              label: '签约',
              value: 'sign',
            },
            {
              label: '其他',
              value: 'other',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea width="lg" name="desc" label="描述" required />
      </ProForm.Group>
    </ModalForm>
  );
  const resultEnum = (result: string) => {
    const map: IObjGet = {
      solve: { text: '解决', color: 'green' },
      reject: { text: '否决', color: 'red' },
      shelve: { text: '搁置', color: 'grey' },
    };
    return map[result] || { text: '', color: '' };
  };

  const isReload = () => {
    actionRef.current?.reload();
  };
  const columns: ProColumns<ICollectInfo>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 40,
    },
    {
      dataIndex: 'uid',
      hideInTable: true,
      search: false,
    },

    {
      title: '标题',
      filters: true,
      dataIndex: 'title',
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
      title: '标签',
      dataIndex: 'tag',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      valueEnum: {
        xq: { text: '需求' },
        bug: { text: 'BUG' },
      },
      render: (_, row) => (
        <Space size={0}>
          <Tag color={row.tag === 'bug' ? 'red' : 'green'}>{E[row.tag]}</Tag>
        </Space>
      ),
    },
    {
      title: '模块',
      dataIndex: 'model',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      valueEnum: {
        house: { text: '房' },
        client: { text: '客' },
        sign: { text: '签约' },
        other: { text: '其他' },
      },
      render: (_, row) => (
        <Space size={0}>
          <Tag color={'blue'}>{E[row.model]}</Tag>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      ellipsis: true,
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      render: (_, row) => <Tag color={'green'}>{row.submitter}</Tag>,
    },
    {
      title: '结果',
      dataIndex: 'result',
      valueEnum: {
        solve: { text: '解决' },
        reject: { text: '否决' },
        shelve: { text: '暂时搁置' },
      },
      render: (_, row) => (
        <Tag color={resultEnum(row.result as string).color}>
          {resultEnum(row.result as string).text}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      valueType: 'dateTime',
      dataIndex: 'create_time',
      editable: false,
    },
    {
      title: '更新时间',
      valueType: 'dateTime',
      dataIndex: 'update_time',
      editable: false,
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

  const pageCollects = async (params: any, sort: any) => {
    const searchInfo: any = {
      ...params,
      sort: sort,
    };
    const { code, data } = await pageCollectInfo(searchInfo);
    if (code === 0) {
      return {
        data: data.items,
        total: data.pageInfo.total,
        success: true,
        pageSize: data.pageInfo.page,
        current: data.pageInfo.limit,
      };
    }
    return {
      data: [],
      total: 0,
      success: false,
    };
  };

  const OnSave = async (_: any, record: ICollectInfo) => {
    const { code } = await putCollectInfo(record);
    if (code === 0) {
      isReload();
    }
  };
  const OnDelete = async (_: any, record: ICollectInfo) => {
    const { code, msg } = await delCollectInfo({ uid: record.uid });
    if (code === 0) {
      message.success(msg);
      isReload();
    }
  };
  return (
    <MyProTable
      headerTitle={'需求与BUG收集'}
      columns={columns}
      request={pageCollects}
      rowKey={'uid'}
      onDelete={OnDelete}
      onSave={OnSave}
      actionRef={actionRef}
      toolBarRender={() => [ModalFormButton]}
    />
  );
};

export default Index;
