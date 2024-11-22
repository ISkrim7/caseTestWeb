import { IObjGet, ISearch } from '@/api';
import {
  addTaskJob,
  handelAPSRunTask,
  pageUICase,
  queryRootPartsByProjectId,
} from '@/api/aps';
import {
  addTaskCase,
  getCaseTaskByUid,
  newCaseTask,
  pageUICaseByTaskId,
  removeTaskCase,
  updateCaseTask,
} from '@/api/ui';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import UIMultiple from '@/pages/Report/History/UIMultiple';
import {
  fetchCaseParts,
  fetchProject,
  fetchQueryEnv2Obj,
} from '@/pages/UIPlaywright/someFetch';
import {
  CasePartEnum,
  IUICase,
  IUITask,
  ProjectEnum,
} from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { history, useModel, useParams } from '@@/exports';
import { MailOutlined, WechatWorkOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, Form, message, Space, TableProps, Tag } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

const Index = () => {
  const { taskId, projectId } = useParams<{
    taskId: string;
    projectId: string;
  }>();
  const { initialState } = useModel('@@initialState');

  const [tasKForm] = Form.useForm<IUITask>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [currentTaskId, setCurrentTaskId] = useState<number>();
  const [selectProjectId, setSelectProjectId] = useState<string>();
  const [selectPartId, setSelectPartId] = useState<any>();
  const { API_LEVEL_SELECT } = CONFIG;
  const [mode, setMode] = useState<string>();
  const [isSend, setIsSend] = useState(false);
  const [isAuto, setIsAuto] = useState(false);
  const [dataSource, setDataSource] = useState<IUICase[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(0);
  const [projectEnum, setProjectEnum] = useState<ProjectEnum[]>([]);
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [partEnumMap, setPartEnumMap] = useState<CasePartEnum[]>([]);
  const [cornDate, setCronDate] = useState<string | null>(null);
  const [envOptions, setEnvOptions] = useState<IObjGet>({});
  const [tryButtonStatus, setTryButtonStatus] = useState(false);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [confirmButtonStatus, setConfirmButtonStatus] = useState(true);
  const [rootPartArr, setRootPartArr] = useState<
    { label: string; value: number }[]
  >([]);

  /**
   * 查询所属用例分页
   */
  const fetchTaskCases = useCallback(
    async (params?: ISearch, sort?: IObjGet) => {
      if (taskId) {
        const search_data = {
          taskId: taskId,
          sort: sort,
          ...params,
        };
        const { code, data } = await pageUICaseByTaskId(search_data);
        if (code === 0) {
          setDataSource(data.items);
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
          success: false,
          total: 0,
        };
      }
    },
    [taskId, edit],
  );

  // 查询所有project 设置枚举
  useEffect(() => {
    fetchProject(setProjectEnum, setProjectEnumMap).then();
    fetchQueryEnv2Obj(setEnvOptions).then();
  }, []);
  // Task详情回显、查询数据
  useEffect(() => {
    const fetchTask = async () => {
      const { code, data } = await getCaseTaskByUid(
        { taskUid: taskId! },
        'GET',
      );
      if (code === 0) return data;
    };
    if (taskId) {
      setMode('detail');
      fetchTask().then((data) => {
        if (data) {
          tasKForm.setFieldsValue(data);
          setIsAuto(data.isAuto);
          setCurrentTaskId(data.id);
          setCurrentProjectId(data.projectId);
          setSelectProjectId(data.projectId.toString());
          setSelectPartId(data.casePartId.toString());
          setIsSend(data.isSend);
        }
      });
    } else {
      setMode('add');
    }
  }, [taskId, edit]);
  // 首次录入  默认设置传递的 projectId casePartId
  useEffect(() => {
    if (projectId) {
      setCurrentProjectId(parseInt(projectId));
      setSelectProjectId(projectId);
      tasKForm.setFieldsValue({ projectId: parseInt(projectId) });
    }
  }, [projectId]);
  // 通过currentProjectId 设置 casePart 枚举
  useEffect(() => {
    if (currentProjectId) {
      queryRootPartsByProjectId({ projectId: currentProjectId }).then(
        async ({ code, data }) => {
          if (code === 0 || data) {
            const partArr = data.map((items) => {
              return {
                label: items.partName,
                value: items.id as number,
              };
            });
            setRootPartArr(partArr);
          }
        },
      );
    }
    if (selectProjectId) {
      fetchCaseParts(parseInt(selectProjectId), setPartEnumMap).then();
    }
  }, [currentProjectId, selectProjectId]);
  /**
   * 查询用例分页
   */
  const fetchUICases = async (params: any, sort: any) => {
    const value = { ...params, sort: sort };
    const { code, data } = await pageUICase(value);
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
      success: false,
      total: 0,
    };
  };

  const onSelect = async (record: IUICase, selected: boolean) => {
    const selectRow: IUICase = { ...record };
    if (selected) {
      if (dataSource?.some((item) => item.id === selectRow.id)) {
        const message_str = `用例  ${record.title} 已经存在！`;
        message.warning(message_str).then(() => {
          setSelectedRowKeys(
            selectedRowKeys.filter((key) => key !== record.id),
          );
          setConfirmButtonStatus(true);
        });
        return;
      } else {
        setConfirmButtonStatus(false);
      }
    }
  };
  const onSelectAll = async (selected: boolean, selectedRows: IUICase[]) => {
    if (selected) {
      // 提取 dataSource 中所有行的 id 到一个 Set 中以检查唯一性
      const existingIds = new Set(
        dataSource ? dataSource.map((row) => row.id) : [],
      );
      // 过滤 selectedRows，仅保留那些 id 不在 dataSource 中的行
      const newRows = selectedRows.filter(
        (row) => row && !existingIds.has(row.id),
      );
      // 提示添加的条目数量
      if (newRows.length > 0) {
        setConfirmButtonStatus(false);
        message.success(`获取 ${newRows.length} 条数据 ! 点击确认 完成添加`);
      } else {
        setConfirmButtonStatus(true);
        message
          .info('当前所选已存在、 没有新数据被添加')
          .then(() => setSelectedRowKeys([]));
      }
    }
  };

  const rowSelection: TableRowSelection<IUICase> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    onSelect: onSelect,
    onSelectAll: onSelectAll,
  };

  const fetch_aps_add_job = async (taskId: string) => {
    const { code } = await addTaskJob({ taskId: taskId });
    if (code === 0) {
      message.success('自动化任务已准备运行');
    }
  };
  const onSubmit = async () => {
    await tasKForm.validateFields();
    const values = await tasKForm.getFieldsValue(true);
    const body = {
      ...values,
    };
    if (mode === 'add') {
      body.creator = initialState?.currentUser?.id;
      const { code, data, msg } = await newCaseTask(body);
      if (code === 0) {
        if (isAuto) {
          await fetch_aps_add_job(data);
        }
        history.push(`/ui/task/detail/taskId=${data}`);
      }
    } else {
      body.uid = taskId;
      body.updater = initialState?.currentUser?.id;
      const { code, data, msg } = await updateCaseTask(body);
      if (code === 0) {
        message.success(msg);
        setMode('detail');
        setEdit(edit + 1);
      }
    }
  };
  const columns: ProColumns<IUICase>[] = [
    {
      title: '用例编号',
      dataIndex: 'uid',
      key: 'uid',
      width: '10%',
      copyable: true,
      render: (_, record) => (
        <a
          onClick={() => {
            history.push(`/ui/case/detail/caseId=${record.id}`);
          }}
        >
          {record.uid}
        </a>
      ),
    },
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      copyable: true,
      render: (_, record) => {
        return <span>{record.title}</span>;
      },
    },
    {
      title: '环境',
      dataIndex: 'envName',
      valueType: 'text',
      render: (_) => {
        return <Tag color={'geekblue'}>{_}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      render: (_, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_LEVEL[record.level].color}>
            {CONFIG.RENDER_CASE_LEVEL[record.level].text}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.CASE_STATUS_ENUM,
      render: (_, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_STATUS[record.status].color}>
            {CONFIG.RENDER_CASE_STATUS[record.status].text}
          </Tag>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => {
        return (
          <a
            hidden={mode !== 'detail'}
            onClick={async () => await removeCase(record.id)}
          >
            移除
          </a>
        );
      },
    },
  ];
  const selectColumns: ProColumns<IUICase>[] = [
    {
      title: '所属项目',
      dataIndex: 'projectId',
      valueType: 'select',
      filters: true,
      onFilter: true,
      valueEnum: projectEnumMap,
      initialValue: selectProjectId,
      hideInTable: true,
      fieldProps: {
        onSelect: (value) => {
          setSelectProjectId(value.toString());
          setSelectPartId(null);
        },
      },
    },
    {
      title: '所属模块',
      dataIndex: 'casePartId',
      valueType: 'treeSelect',
      hideInTable: true,
      initialValue: selectProjectId,
      fieldProps: {
        value: selectPartId,
        onSelect: (value) => {
          setSelectPartId(value);
        },
        treeData: partEnumMap,
        fieldNames: {
          label: 'title',
        },
      },
    },
    {
      title: '用例编号',
      dataIndex: 'uid',
      key: 'uid',
      width: '10%',
      render: (_, record) => (
        <a
          target="_blank"
          rel="noopener noreferrer"
          key="view"
          onClick={() => {
            history.push(`/ui/case/detail/caseId=${record.id}`);
          }}
        >
          {record.uid}
        </a>
      ),
    },
    {
      title: '运行环境',
      dataIndex: 'envName',
      valueType: 'select',
      key: 'envId',
      valueEnum: { ...envOptions },
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => {
        return <span>{record.title}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.CASE_STATUS_ENUM,
      render: (_, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_STATUS[record.status].color}>
            {CONFIG.RENDER_CASE_STATUS[record.status].text}
          </Tag>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      search: false,
    },
  ];

  const tableAlertRender = () => {
    return (
      <Space size={24}>
        <span>
          已选 {selectedRowKeys.length} 项
          <a
            style={{ marginInlineStart: 8 }}
            onClick={async () => setSelectedRowKeys([])}
          >
            取消选择
          </a>
        </span>
      </Space>
    );
  };
  /**
   * 确认添加用例
   */
  const confirmAddCase = async () => {
    if (selectedRowKeys.length > 0) {
      const data = {
        taskUid: taskId!,
        caseIdList: selectedRowKeys as number[],
      };
      const { code, msg } = await addTaskCase(data);
      if (code === 0) {
        message.success(msg);
        setSelectedRowKeys([]);
        setOpen(false);
        await actionRef.current?.reload();
      }
    }
  };

  /**
   * 移除用例
   * @param id
   */
  const removeCase = async (id: number) => {
    const data = { taskId: currentTaskId!, caseId: id };
    const { code, msg } = await removeTaskCase(data);
    if (code === 0) {
      message.success(msg);
      await actionRef.current?.reload();
    }
  };

  return (
    <ProCard
      split={'horizontal'}
      style={{ height: 'auto' }}
      gutter={[16, 0]}
      bordered
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
              {currentTaskId && (
                <Button
                  type={'primary'}
                  loading={tryButtonStatus}
                  onClick={async () => {
                    setTryButtonStatus(true);
                    const { code, msg } = await handelAPSRunTask({
                      taskId: currentTaskId,
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
                  }}
                >
                  Try
                </Button>
              )}

              <Button
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setMode('update');
                }}
              >
                修改
              </Button>
            </>
          )}
        </>
      }
    >
      <MyDrawer name={'UI自动化用例'} open={open} setOpen={setOpen}>
        <ProTable
          rowSelection={rowSelection}
          headerTitle={'UI用例表'}
          columns={selectColumns}
          rowKey={'id'}
          request={fetchUICases}
          // @ts-ignore
          tableAlertOptionRender={() => {
            return (
              <>
                <span>勿跨页多选添加</span>
                <Button
                  style={{ marginLeft: 10 }}
                  onClick={confirmAddCase}
                  disabled={confirmButtonStatus}
                  type={'primary'}
                >
                  确认添加
                </Button>
              </>
            );
          }}
          tableAlertRender={tableAlertRender}
        />
      </MyDrawer>

      <ProCard title={'基本信息'}>
        <ProForm
          form={tasKForm}
          submitter={false}
          disabled={mode === 'detail'}
          layout={'horizontal'}
        >
          <ProForm.Group>
            <ProFormText
              width={'lg'}
              name="title"
              label="任务标题"
              required={true}
              rules={[{ required: true, message: '任务标题必填' }]}
            />
            <ProFormSelect
              name="level"
              label="优先级"
              width={'lg'}
              initialValue={'P1'}
              options={API_LEVEL_SELECT}
              required={true}
              rules={[{ required: true, message: '任务优先级必选' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormTextArea
              width={'lg'}
              name="desc"
              label="任务描述"
              required={true}
              rules={[{ required: true, message: '任务描述必填' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              required
              name="projectId"
              label="所属项目"
              width={'lg'}
              options={projectEnum}
              initialValue={currentProjectId}
              rules={[{ required: true, message: '所属项目必选' }]}
              fieldProps={{
                onChange: (value: number) => {
                  setCurrentProjectId(value);
                  tasKForm.setFieldsValue({ casePartId: undefined });
                },
              }}
            />
            <ProFormSelect
              required
              name="casePartId"
              label="所属模块"
              options={rootPartArr}
              rules={[{ required: true, message: '所属模块必选' }]}
              width={'lg'}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormDigit
              label={'重试次数'}
              name={'retry'}
              width={'lg'}
              required={true}
              initialValue={0}
              max={5}
              min={0}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSwitch
              name={'isAuto'}
              label={'自动化运行'}
              checkedChildren="开"
              unCheckedChildren="关"
              initialValue={isAuto}
              fieldProps={{
                onChange: (checked) => {
                  setIsAuto(checked);
                },
              }}
            />
            {isAuto ? (
              <ProFormText
                width={'lg'}
                tooltip={'m h d M (day of month)'}
                name={'cron'}
                label={'Cron表达式'}
                required={isAuto}
                placeholder={'* * * * *'}
                rules={[{ required: isAuto, message: '表达式必填' }]}
              />
            ) : null}
            <ProFormSelect
              name={'mode'}
              label={'探活'}
              width={'lg'}
              options={[
                {
                  label: '签前',
                  value: 'sale',
                },
                {
                  label: '签后',
                  value: 'trade',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSwitch
              name={'isSend'}
              label={'是否推送'}
              checkedChildren="开"
              unCheckedChildren="关"
              initialValue={isSend}
              fieldProps={{
                onChange: (checked) => {
                  setIsSend(checked);
                },
              }}
            />
            {isSend ? (
              <>
                <ProFormSelect
                  label={'推送方式'}
                  name={'sendType'}
                  width={'md'}
                  options={[
                    {
                      label: (
                        <>
                          <WechatWorkOutlined /> <span>企业微信群机器人</span>
                        </>
                      ),
                      value: 1,
                    },
                    {
                      label: (
                        <>
                          <MailOutlined /> <span>邮箱</span>
                        </>
                      ),
                      value: 2,
                      disabled: true,
                    },
                  ]}
                />
                <ProFormText.Password
                  width={'md'}
                  label={'key'}
                  name={'sendKey'}
                />
              </>
            ) : null}
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard
        hidden={mode === 'add'}
        style={{
          marginTop: '20px',
        }}
        title={'用例列表'}
      >
        <MyProTable
          toolBarRender={() => [
            <Button
              hidden={mode === 'add'}
              type={'primary'}
              onClick={async () => {
                setSelectedRowKeys([]);
                setOpen(true);
              }}
            >
              添加选择
            </Button>,
          ]}
          pagination={{
            showQuickJumper: true,
            defaultPageSize: 5,
            showSizeChanger: true,
          }}
          dataSource={dataSource}
          columns={columns}
          request={fetchTaskCases}
          rowKey={'uid'}
          actionRef={actionRef}
          search={mode === 'detail'}
        />
      </ProCard>
      {currentTaskId ? (
        <ProCard>
          <UIMultiple taskId={currentTaskId} />
        </ProCard>
      ) : null}
    </ProCard>
  );
};

export default Index;
