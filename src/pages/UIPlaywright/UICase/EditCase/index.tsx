import { IObjGet } from '@/api';
import { clearUICaseResult, handelAPSRunCase } from '@/api/aps';
import {
  addUICase,
  getUICase,
  handelCaseSteps,
  orderCaseSteps,
  putUICase,
  queryStepByCaseId,
} from '@/api/ui';
import MyDrawer from '@/components/MyDrawer';
import UISingle from '@/pages/Report/History/UISingle';
import {
  fetchCaseParts,
  fetchProject,
  fetchQueryEnv,
  fetchUIMethodOptions,
} from '@/pages/UIPlaywright/someFetch';
import AddUICase from '@/pages/UIPlaywright/UICase/EditCase/AddUICase';
import CaseVariables from '@/pages/UIPlaywright/UICase/EditCase/CaseVariables';
import CommonCaseStepTable from '@/pages/UIPlaywright/UICase/EditCase/CommonCaseStepTable';
import StepFunc from '@/pages/UIPlaywright/UICase/EditCase/StepFunc';
import GroupSteps from '@/pages/UIPlaywright/UICase/EditCase/StepFunc/GroupSteps';
import StepGroupTable from '@/pages/UIPlaywright/UICase/EditCase/StepGroupTable';
import {
  IUICase,
  IUICaseSteps,
  ProjectEnum,
} from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { history, useModel, useParams } from '@@/exports';
import {
  ApiTwoTone,
  ConsoleSqlOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  DragSortTable,
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import {
  Breadcrumb,
  Button,
  Divider,
  Form,
  message,
  Popconfirm,
  Switch,
  Tabs,
  Tag,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';

interface CasePartEnum {
  title: string;
  value: number;
  children?: CasePartEnum[];
}

const Index = () => {
  const { caseId, projectId } = useParams<{
    caseId: string;
    projectId: string;
  }>();
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm<IUICase>();
  const [mode, setMode] = useState<string>();
  const [projectEnum, setProjectEnum] = useState<ProjectEnum[]>([]);
  const [casePartEnum, setCasePartEnum] = useState<CasePartEnum[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [methodEnum, setMethodEnum] = useState<IObjGet>();
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [dataSource, setDataSource] = useState<IUICaseSteps[]>([]);
  const { API_LEVEL_SELECT, API_STATUS_SELECT } = CONFIG;
  const [stepsEditableKeys, setStepsEditableRowKeys] = useState<React.Key[]>();
  const [addCommonStepOpen, setAddCommonStepOpen] = useState(false);
  const [addStepGroupOpen, setAddStepGroupOpen] = useState(false);
  const [addStepOpen, setAddStepOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [edit, setEdit] = useState(0);
  const [creatorId, setCreatorId] = useState<number>();
  const [envOptions, setEnvOptions] = useState<any>([]);
  const [tryButtonStatus, setTryButtonStatus] = useState(false);
  const [copyStepData, setCopyStepData] = useState<IUICaseSteps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProject(setProjectEnum),
      fetchUIMethodOptions(setMethodEnum),
      fetchQueryEnv(setEnvOptions),
    ]).then((r) => r.reverse());
    form.setFieldsValue({
      password: 'App!User5i5j@',
    });
  }, []);
  useEffect(() => {
    if (projectId) {
      setCurrentProjectId(parseInt(projectId));
      form.setFieldsValue({ projectId: parseInt(projectId) });
    }
  }, [projectId]);
  useEffect(() => {
    if (currentProjectId) {
      fetchCaseParts(currentProjectId, setCasePartEnum).then();
    }
  }, [currentProjectId]);
  useEffect(() => {
    if (caseId) {
      setMode('detail');
      getUICase({ id: caseId }).then(async ({ code, data, msg }) => {
        if (code === 0 && data) {
          form.setFieldsValue(data);
          setCurrentProjectId(data.projectId);
          setCreatorId(data.creator);
        } else {
          message.error(msg);
        }
      });
      queryStepByCaseId({ id: caseId }).then(async ({ code, data, msg }) => {
        if (code === 0 && data) {
          setLoading(false);
          setDataSource(data);
        } else {
          message.error(msg);
        }
      });
    } else {
      setMode('add');
    }
  }, [caseId, edit]);

  const onSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue(true);
    //首次添加
    if (mode === 'add') {
      const body = {
        ...values,
        steps: dataSource,
      };
      const { code, data, msg } = await addUICase(body);
      if (code === 0) {
        message.success(msg);
        history.push(`/ui/case/detail/caseId=${data}`);
      }
    } else if (mode === 'update') {
      const { code, msg } = await putUICase(values);
      if (code === 0) {
        message.success(msg);
        setMode('detail');
        setEdit(edit + 1);
      }
    }
  };
  const tryCase = async () => {
    setTryButtonStatus(true);
    if (caseId) {
      const { code } = await handelAPSRunCase({
        caseId: parseInt(caseId),
        userId: initialState!.currentUser!.id!,
      });
      if (code === 0) {
        message.success('已在后台运行... 底部刷新结果查看');
        // 两秒后解除按钮禁用状态
        setTimeout(() => {
          setTryButtonStatus(false);
        }, 2000);
        setEdit(edit + 1);
      }
    }
  };

  const handleDelCaseStep = async (record: IUICaseSteps) => {
    setConfirmLoading(true);
    handelCaseSteps({ caseId: caseId!, stepId: record.uid }, 'DELETE').then(
      ({ code, msg }) => {
        if (code === 0) {
          message.success(msg);
          setConfirmLoading(false);
          setDataSource(dataSource.filter((item) => item.id !== record.id));
        }
      },
    );
  };

  const dragHandleRender = (_: any, idx: any) => (
    <>
      <MenuOutlined style={{ cursor: 'grab', color: 'gold' }} />
      &nbsp;{idx + 1}
    </>
  );

  const copyStep = async (record: IUICaseSteps) => {
    setCopyStepData(record);
    setAddStepOpen(true);
  };

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
          record.is_group ||
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
              <a key="editable" onClick={async () => copyStep(record)}>
                复制
              </a>
            </>
          )}
        </>,
        <>
          {caseId &&
          (initialState?.currentUser?.id === creatorId ||
            initialState?.currentUser?.isAdmin) ? (
            <Popconfirm
              title="确认删除"
              description="非公共步骤将彻底删除、请确认"
              onConfirm={async () => await handleDelCaseStep(record)}
              okButtonProps={{ loading: confirmLoading }}
            >
              <a>删除</a>
            </Popconfirm>
          ) : null}
        </>,
      ],
    },
  ];
  const handleDragSortEnd = async (
    _: number,
    __: number,
    newDataSource: IUICaseSteps[],
  ) => {
    const orderData = newDataSource.map((item) => item.id);
    if (caseId) {
      const { code, msg } = await orderCaseSteps({
        caseId: caseId,
        steps: orderData,
      });
      if (code === 0) {
        message.success(msg);
      }
    }
    setDataSource(newDataSource);
  };

  const setReload = async () => {
    setEdit(edit + 1);
  };

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

  const addStepGroupButton = (
    <Button
      type={'primary'}
      onClick={async () => {
        setAddStepGroupOpen(true);
      }}
    >
      <PlusOutlined />
      添加步骤组
    </Button>
  );

  const expandedRowRender = (record: IUICaseSteps) => {
    if (record.is_group) {
      return <GroupSteps groupId={record.group_Id} methodEnum={methodEnum} />;
    } else {
      // 如果是前后置置步骤，则显示前置步骤
      return <StepFunc stepId={record.id} reload={setReload} />;
    }
  };
  return (
    <>
      <ProCard>
        <Breadcrumb
          items={[
            {
              title: <a href="/ui/cases">用例列表</a>,
            },
            {
              title: '用例详情',
            },
          ]}
        />
      </ProCard>
      <ProCard
        split={'horizontal'}
        bodyStyle={{ height: 'auto', width: 'auto' }}
        hoverable
        extra={
          <>
            {mode === 'add' || mode === 'update' ? (
              <>
                <Button onClick={onSubmit} type={'primary'}>
                  提交
                </Button>
                {mode === 'update' ? (
                  <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => setMode('detail')}
                    type={'primary'}
                  >
                    取消
                  </Button>
                ) : null}
              </>
            ) : (
              <>
                <Button
                  type={'primary'}
                  onClick={tryCase}
                  loading={tryButtonStatus}
                >
                  Try
                </Button>
                <Divider type="vertical" />
                {initialState?.currentUser?.id === creatorId ||
                initialState?.currentUser?.isAdmin ? (
                  <Button
                    onClick={() => {
                      setMode('update');
                    }}
                  >
                    修改
                  </Button>
                ) : null}
              </>
            )}
          </>
        }
      >
        <MyDrawer
          name={'添加步骤'}
          width={'auto'}
          open={addStepOpen}
          setOpen={setAddStepOpen}
        >
          <AddUICase
            uiCaseId={caseId!}
            setOpen={setAddStepOpen}
            edit={edit}
            setEdit={setEdit}
            copyData={copyStepData}
          />
        </MyDrawer>
        <MyDrawer
          name={'公共步骤'}
          width={'auto'}
          open={addCommonStepOpen}
          setOpen={setAddCommonStepOpen}
        >
          <CommonCaseStepTable
            dataSource={dataSource}
            setDataSource={setDataSource}
            caseId={caseId!}
            actionRef={actionRef}
          />
        </MyDrawer>
        <MyDrawer
          name={'公共步骤组'}
          width={'70%'}
          open={addStepGroupOpen}
          setOpen={setAddStepGroupOpen}
        >
          <StepGroupTable
            caseId={parseInt(caseId!)}
            edit={edit}
            setEdit={setEdit}
            setOpen={setAddStepGroupOpen}
            dataSource={dataSource}
          />
        </MyDrawer>
        <ProCard title={'基本信息'}>
          <ProForm
            disabled={mode === 'detail'}
            layout={'horizontal'}
            submitter={false}
            form={form}
          >
            <ProForm.Group>
              <ProFormText
                width={'md'}
                name="title"
                label="用例标题"
                required={true}
                rules={[{ required: true, message: '用例标题必填' }]}
              />
              <ProFormSelect
                name="level"
                label="优先级"
                width={'md'}
                initialValue={'P1'}
                options={API_LEVEL_SELECT}
                required={true}
                rules={[{ required: true, message: '用例优先级必选' }]}
              />
              <ProFormSelect
                name="status"
                label="用例状态"
                initialValue={'DEBUG'}
                width={'md'}
                options={API_STATUS_SELECT}
                required={true}
                rules={[{ required: true, message: '用例状态必须选' }]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                required
                options={projectEnum}
                name="projectId"
                label="所属项目"
                width={'md'}
                initialValue={currentProjectId}
                rules={[{ required: true, message: '所属项目必选' }]}
                fieldProps={{
                  onChange: (value: number) => {
                    setCurrentProjectId(value);
                    form.setFieldsValue({ casePartId: undefined });
                  },
                }}
              />
              <ProFormTreeSelect
                required
                name="casePartId"
                label="所属模块"
                allowClear
                rules={[{ required: true, message: '所属模块必选' }]}
                fieldProps={{
                  treeData: casePartEnum,
                  fieldNames: {
                    label: 'title',
                  },
                  filterTreeNode: true,
                }}
                width={'md'}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                required
                showSearch={true}
                options={envOptions}
                name="envId"
                label="运行环境"
                width={'md'}
                rules={[{ required: true, message: '运行环境必填' }]}
              />
              <ProFormText required name="username" label="登录帐号" />
              <ProFormText.Password
                required
                name="password"
                placeholder={'App!User5i5j@'}
                label="登录密码"
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormTextArea
                width={'md'}
                name="desc"
                label="用例描述"
                required={true}
                rules={[{ required: true, message: '用例描述必填' }]}
              />
            </ProForm.Group>
          </ProForm>
        </ProCard>
        <ProCard>
          <Tabs size={'large'} defaultActiveKey={'2'}>
            <Tabs.TabPane tab={'前置变量'} key={'1'}>
              <CaseVariables currentCaseId={parseInt(caseId!)} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={'用例步骤'} key={'2'}>
              <DragSortTable
                loading={loading}
                expandable={{
                  expandedRowRender,
                  rowExpandable: (record) => !record.isCommonStep,
                }}
                toolBarRender={() => {
                  // 如果是编辑状态
                  if (
                    (mode !== 'add' && initialState?.currentUser?.isAdmin) ||
                    initialState?.currentUser?.id === creatorId
                  ) {
                    return [
                      addStepButton,
                      addCommonStepButton,
                      addStepGroupButton,
                    ];
                  } else {
                    return [];
                  }
                }}
                scroll={{ x: 1500 }}
                options={{
                  density: true,
                  setting: {
                    listsHeight: 400,
                  },
                  reload: setReload,
                }}
                search={false}
                editable={{
                  type: 'single',
                  editableKeys: stepsEditableKeys,
                  onChange: setStepsEditableRowKeys, // Update editable keys
                  onSave: async (_, data: IUICaseSteps) => {
                    data.isCommonStep = false;
                    //新增或者修改
                    if (caseId) {
                      //修改
                      const addData = { caseId: caseId, ...data };
                      const { code, msg } = await handelCaseSteps(
                        addData,
                        'PUT',
                      );
                      if (code === 0) {
                        message.success(msg);
                        actionRef.current?.reload();
                        setEdit(edit + 1);
                      }
                    }
                    // 查找现有数据中是否有与data.id相同的记录
                    const existingIndex = dataSource.findIndex(
                      (item: any) => item.id === data.id,
                    );

                    if (existingIndex !== -1) {
                      // 如果找到，则更新现有记录
                      const updatedDataSource = [...dataSource];
                      updatedDataSource[existingIndex] = data;
                      setDataSource(updatedDataSource);
                    } else {
                      // 如果未找到，则新增记录
                      setDataSource([...dataSource, data]);
                    }
                  },
                  actionRender: (_, __, defaultDom) => {
                    return [defaultDom.save, defaultDom.cancel];
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
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
        {caseId ? (
          <ProCard
            title={'用例调试历史'}
            style={{ marginTop: 200, height: 'auto' }}
            bodyStyle={{ height: 'auto' }}
            extra={
              <Button
                type={'primary'}
                onClick={async () => {
                  clearUICaseResult({ caseId: parseInt(caseId) }).then(
                    ({ code, msg }) => {
                      if (code === 0) {
                        message.success(msg);
                        setEdit(edit + 1);
                      }
                    },
                  );
                }}
              >
                清空调试历史
              </Button>
            }
          >
            <UISingle currentCaseId={parseInt(caseId)} />
          </ProCard>
        ) : null}
      </ProCard>
    </>
  );
};

export default Index;
