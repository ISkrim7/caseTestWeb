import {
  addStepGroup,
  delStepGroup,
  pageStepGroup,
  putStepGroup,
} from '@/api/ui';
import MyProTable from '@/components/Table/MyProTable';
import { IUICaseSteps, IUIStepGroup } from '@/pages/UIPlaywright/uiTypes';
import { pageData } from '@/utils/somefunc';
import { useModel } from '@@/plugin-model';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, Divider, Form, message, Tag } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { history } from 'umi';

const Index = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  const [dataSource, setDataSource] = useState<IUICaseSteps[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { initialState } = useModel('@@initialState');
  const pageGroup = useCallback(async (params: any, sort: any) => {
    const search_data = {
      ...params,
      sort: sort,
    };
    const { code, data } = await pageStepGroup(search_data);
    return pageData(code, data, setDataSource);
  }, []);

  const columns: ProColumns<IUIStepGroup>[] = [
    {
      title: '步骤ID',
      dataIndex: 'id',
      valueType: 'text',
      width: '8%',
      editable: false,
    },
    {
      title: '步骤名称',
      dataIndex: 'name',
      valueType: 'text',
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
      title: '步骤描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInSearch: true,
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
      title: '步骤数量',
      dataIndex: 'stepNum',
      editable: false,
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      editable: false,
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (text, record, _, action) => {
        return [
          <a
            key="detali"
            onClick={() => {
              history.push(`/ui/case/stepGroup/detail/groupId=${record.id}`);
            }}
          >
            详情
          </a>,
          <Divider type={'vertical'} />,
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>,
          <Divider type={'vertical'} />,
          <a
            onClick={async () => {
              delStepGroup({ id: record.id }).then(({ code, msg }) => {
                if (code === 0) {
                  message.success(msg);
                  actionRef.current?.reload();
                }
              });
            }}
          >
            删除
          </a>,
        ];
      },
    },
  ];
  const onSave = async (_: any, record: any) => {
    const update = {
      uid: record.uid,
      name: record.name,
      desc: record.desc,
      updater: initialState?.currentUser?.id!,
    };
    putStepGroup(update).then(({ code, msg }) => {
      if (code === 0) {
        message.success(msg);
        actionRef.current?.reload();
      }
    });
  };
  return (
    <>
      <ModalForm
        form={form}
        title={'添加步骤组'}
        open={openModal}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setOpenModal(false),
        }}
        onFinish={async () => {
          const values = await form.validateFields();
          values.creator = initialState?.currentUser?.id;
          values.creatorName = initialState?.currentUser?.username;
          await addStepGroup(values).then(({ code, msg }) => {
            if (code === 0) {
              message.success(msg);
              setOpenModal(false);
              form.resetFields();
              actionRef.current?.reload();
            }
          });
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="组名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />
        <ProFormTextArea
          width="md"
          name="desc"
          label="组描述"
          placeholder="请输入描述"
        />
      </ModalForm>

      <MyProTable
        columns={columns}
        request={pageGroup}
        actionRef={actionRef}
        onSave={onSave}
        x={800}
        dataSource={dataSource}
        toolBarRender={() => [
          <Button type={'primary'} onClick={async () => setOpenModal(true)}>
            <PlusOutlined />
            添加步骤组
          </Button>,
        ]}
        rowKey={'id'}
      />
    </>
  );
};

export default Index;
