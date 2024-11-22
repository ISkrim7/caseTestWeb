import { IObjGet } from '@/api';
import { delCommonStep, pageStepOptions, putStep } from '@/api/ui';
import MyDrawer from '@/components/MyDrawer';
import { fetchUIMethodOptions } from '@/pages/UIPlaywright/someFetch';
import AddUICase from '@/pages/UIPlaywright/UICase/EditCase/AddUICase';
import { IUICaseSteps } from '@/pages/UIPlaywright/uiTypes';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  EditableProTable,
  ProCard,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, message, Switch, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Index = () => {
  const [methodEnum, setMethodEnum] = useState<IObjGet>();
  const [stepDataSource, setStepDataSource] = useState<IUICaseSteps[]>();
  const [addStepOpen, setAddStepOpen] = useState(false);
  const [edit, setEdit] = useState(0);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [stepsEditableKeys, setStepsEditableRowKeys] = useState<React.Key[]>();
  useEffect(() => {
    fetchUIMethodOptions(setMethodEnum).then();
  }, []);
  useEffect(() => {
    if (edit) {
      actionRef.current?.reload();
    }
  }, [edit]);
  const fetchCommonStepPage = async (values: any) => {
    values.isCommonStep = 1;
    const { code, data } = await pageStepOptions(values);
    if (code === 0) {
      setStepDataSource(data.items);
      return {
        data: data.items,
        total: data.pageInfo.total,
        success: true,
        pageSize: data.pageInfo.page,
        current: data.pageInfo.limit,
      };
    } else {
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const columns: ProColumns<IUICaseSteps>[] = [
    {
      title: 'uid',
      dataIndex: 'uid',
      copyable: true,
      editable: false,
      fixed: 'left',
      width: '8%',
    },
    {
      title: '名称',
      valueType: 'text',
      dataIndex: 'name',
      fixed: 'left',
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
    },
    {
      title: '描述',
      key: 'desc',
      dataIndex: 'desc',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
    },
    {
      title: '元素定位',
      dataIndex: 'locator',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
      valueType: 'textarea',
      width: '12%',
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
    },
    {
      title: '方法',
      dataIndex: 'method',
      valueEnum: { ...methodEnum },
      width: '15%',
      valueType: 'select',
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
    },
    {
      tooltip: '用于输入值，或者用于expect校验的预期值',
      title: '输入值',
      dataIndex: 'value',
      valueType: 'text',
      hideInSearch: true,

      ellipsis: true,
    },
    {
      tooltip: '如果是iframe、请输入',
      title: 'IFrame',
      dataIndex: 'iframeName',
      valueType: 'text',
      width: '9%',
      hideInSearch: true,

      copyable: true,
    },
    {
      tooltip: '如果点击生成了新的页面，需要开启',
      title: '新页面',
      dataIndex: 'new_page',
      valueType: 'switch',
      hideInSearch: true,

      width: '5%',
      render: (_, record) => <Switch value={record.new_page} />,
    },
    {
      title: '忽略异常',
      dataIndex: 'is_ignore',
      hideInSearch: true,
      valueType: 'switch',
      width: '5%',
      render: (_, record) => <Switch value={record.is_ignore} />,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      valueType: 'text',
      width: '8%',
      editable: false,
      fixed: 'right',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: 'opt',
      valueType: 'option',
      fixed: 'right',
      width: '5%',
      render: (_, record, __, action) => [
        <a
          key="editable"
          onClick={() => {
            console.log('==', record);
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            const { code, msg } = await delCommonStep({ uid: record.uid });
            if (code === 0) {
              message.success(msg);
              action?.reload?.();
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const addStepButton = (
    <Button
      type={'primary'}
      onClick={async () => {
        setAddStepOpen(true);
      }}
    >
      <PlusOutlined />
      添加共有步骤
    </Button>
  );
  return (
    <ProCard split={'horizontal'}>
      <MyDrawer
        name={'添加步骤'}
        width={'auto'}
        open={addStepOpen}
        setOpen={setAddStepOpen}
      >
        <AddUICase
          setOpen={setAddStepOpen}
          edit={edit}
          setEdit={setEdit}
          isCommonStep={true}
        />
      </MyDrawer>
      <EditableProTable
        actionRef={actionRef}
        options={{
          density: true,
          setting: {
            listsHeight: 400,
          },
        }}
        search={{
          labelWidth: 'auto',
          showHiddenNum: true,
        }}
        recordCreatorProps={false}
        dataSource={stepDataSource}
        rowKey={'id'}
        editable={{
          type: 'single',
          onChange: setStepsEditableRowKeys,
          onSave: async (_, values) => {
            console.log(values);
            await putStep(values).then(({ code, msg }) => {
              if (code === 0) {
                message.success(msg);
                actionRef.current?.reload();
              }
            });
          },
        }}
        scroll={{ x: 1500 }}
        columns={columns}
        toolBarRender={() => [addStepButton]}
        request={fetchCommonStepPage}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
      />
    </ProCard>
  );
};

export default Index;
