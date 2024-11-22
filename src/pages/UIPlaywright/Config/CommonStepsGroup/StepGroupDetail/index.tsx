import { IObjGet } from '@/api';
import {
  orderStepToGroup,
  putStep,
  queryStepsByGroupId,
  removeGroupStepById,
} from '@/api/ui';
import MyDrawer from '@/components/MyDrawer';
import { fetchUIMethodOptions } from '@/pages/UIPlaywright/someFetch';
import AddUICase from '@/pages/UIPlaywright/UICase/EditCase/AddUICase';
import { IUICaseSteps } from '@/pages/UIPlaywright/uiTypes';
import { useModel, useParams } from '@@/exports';
import {
  ApiTwoTone,
  ConsoleSqlOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { DragSortTable, ProCard } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, message, Popconfirm, Switch, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

const Index = () => {
  const { groupId } = useParams<{
    groupId: string;
  }>();
  const { initialState } = useModel('@@initialState');
  const [methodEnum, setMethodEnum] = useState<IObjGet>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addCommonStepOpen, setAddCommonStepOpen] = useState(false);
  const [addStepOpen, setAddStepOpen] = useState(false);
  const [edit, setEdit] = useState(0);
  const [stepsEditableKeys, setStepsEditableRowKeys] = useState<React.Key[]>();
  const [dataSource, setDataSource] = useState<IUICaseSteps[]>([]);

  useEffect(() => {
    fetchUIMethodOptions(setMethodEnum).then();
  }, []);

  useEffect(() => {
    if (groupId) {
      queryStepsByGroupId({ groupId: parseInt(groupId) }).then(
        ({ code, data, msg }) => {
          if (code === 0) {
            setLoading(false);
            setDataSource(data);
          }
        },
      );
    }
  }, [groupId, edit]);
  const columns: ProColumns<IUICaseSteps>[] = [
    {
      title: '顺序',
      dataIndex: 'index',
      editable: false,
      width: '5%',
      fixed: 'left',
    },
    {
      title: '属性',
      dataIndex: 'isCommonStep',
      editable: false,
      fixed: 'left',
      width: '5%',
      render: (_, record) => {
        if (record.isCommonStep) {
          return <Tag color={'blue'}>公</Tag>;
        } else if (record.is_group) {
          return <Tag color={'blue'}>组</Tag>;
        }

        return (
          <>
            {record.has_api ? (
              <Tag>
                <ApiTwoTone />
              </Tag>
            ) : null}
            {record.has_sql ? (
              <Tag>
                <ConsoleSqlOutlined />
              </Tag>
            ) : null}
            <Tag color={'orange'}>私</Tag>
          </>
        );
      },
    },
    {
      title: '名称',
      valueType: 'text',
      dataIndex: 'name',
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
      valueType: 'textarea',
      ellipsis: true,
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
      width: '12%',
      dataIndex: 'value',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '监听API',
      dataIndex: 'api_url',
      copyable: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      tooltip: '如果是iframe、请输入',
      title: 'IFrame',
      dataIndex: 'iframeName',
      valueType: 'text',
      copyable: true,
    },
    {
      tooltip: '如果点击生成了新的页面，需要开启',
      title: '新页面',
      dataIndex: 'new_page',
      valueType: 'switch',
      render: (_, record) => <Switch value={record.new_page} />,
    },
    {
      title: '忽略异常',
      dataIndex: 'is_ignore',
      valueType: 'switch',
      render: (_, record) => <Switch value={record.is_ignore} />,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (__, record, _, action) => [
        <>
          {/*公共用例不可编辑 非个人创建用例不可编辑 非admin*/}
          {record.isCommonStep ||
          (initialState?.currentUser?.id !== record.creator &&
            !initialState?.currentUser?.isAdmin) ? null : (
            <>
              <a
                key="editable"
                onClick={() => {
                  action?.startEditable?.(record.id);
                }}
              >
                编辑
              </a>
              {/*<a key="editable" onClick={async () => copyStep(record)}>*/}
              {/*  复制*/}
              {/*</a>*/}
            </>
          )}
        </>,
        <>
          {groupId &&
          (initialState?.currentUser?.id === record.creator ||
            initialState?.currentUser?.isAdmin) ? (
            <Popconfirm
              title="确认删除"
              description="非公共步骤将彻底删除、请确认"
              onConfirm={async () => {
                await removeGroupStepById({
                  stepId: record.id,
                  groupId: parseInt(groupId),
                }).then(({ code, msg }) => {
                  setConfirmLoading(false);
                  setDataSource(
                    dataSource.filter((item) => item.id !== record.id),
                  );
                  message.success(msg);
                });
              }}
              okButtonProps={{ loading: confirmLoading }}
            >
              <a>删除</a>
            </Popconfirm>
          ) : null}
        </>,
      ],
    },
  ];
  const dragHandleRender = (_: any, idx: any) => (
    <>
      <MenuOutlined style={{ cursor: 'grab', color: 'gold' }} />
      &nbsp;{idx + 1}
    </>
  );

  const addStepButton = (
    <Button
      type={'primary'}
      onClick={async () => {
        setAddStepOpen(true);
      }}
    >
      <PlusOutlined />
      添加私有步骤
    </Button>
  );
  const addCommonStepButton = (
    <Button
      type={'primary'}
      onClick={async () => {
        setAddCommonStepOpen(true);
      }}
    >
      <PlusOutlined />
      添加公共步骤
    </Button>
  );

  const handleDragSortEnd = async (
    _: number,
    __: number,
    newDataSource: IUICaseSteps[],
  ) => {
    const orderData = newDataSource.map((item) => item.id);
    if (groupId) {
      const { code, msg } = await orderStepToGroup({
        groupId: parseInt(groupId),
        stepList: orderData,
      });
      if (code === 0) {
        message.success(msg);
      }
    }
    setDataSource(newDataSource);
  };

  return (
    <ProCard>
      <MyDrawer
        name={'添加步骤'}
        width={'auto'}
        open={addStepOpen}
        setOpen={setAddStepOpen}
      >
        <AddUICase
          stepGroupId={parseInt(groupId!)}
          setOpen={setAddStepOpen}
          edit={edit}
          setEdit={setEdit}
        />
      </MyDrawer>
      <DragSortTable
        search={false}
        loading={loading}
        toolBarRender={() => [addStepButton, addCommonStepButton]}
        scroll={{ x: 1500 }}
        options={{
          density: true,
          setting: {
            listsHeight: 400,
          },
          reload: async () => {
            setEdit(edit + 1);
          },
        }}
        editable={{
          type: 'single',
          editableKeys: stepsEditableKeys,
          onChange: setStepsEditableRowKeys, // Update editable keys
          onSave: async (_, values) => {
            await putStep(values).then(({ code, msg }) => {
              if (code === 0) {
                message.success(msg);
                setEdit(edit + 1);
              }
            });
          },
        }}
        columns={columns}
        dragSortHandlerRender={dragHandleRender}
        dataSource={dataSource}
        rowKey={'id'}
        onDragSortEnd={handleDragSortEnd}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
        }}
        dragSortKey="index"
      />
    </ProCard>
  );
};

export default Index;
