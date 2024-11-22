import { IQueryPartTree, ISearch } from '@/api';
import {
  addInterfaceTask,
  casePartTree,
  getInterfaceTaskDetail,
  pageApiCase,
  queryInterfacesByTaskId,
  updateInterfaceTask,
} from '@/api/interface';
import { queryProject } from '@/api/project';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import { IInterface, IInterfaceTask } from '@/pages/Interface/types';
import Multiple from '@/pages/Report/History/Multiple';
import { CONFIG } from '@/utils/config';
import { history } from '@@/core/history';
import { MailOutlined, WechatWorkOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProColumns,
  ProForm,
  ProFormGroup,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Form, message, Tag } from 'antd';
import parser from 'cron-parser';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'umi';

interface CasePartEnum {
  title: string;
  value: number;
  children?: CasePartEnum[];
}

const Index: FC = () => {
  const { taskId, projectId } = useParams<{
    taskId: string;
    projectId: string;
    casePartId: string;
  }>();
  const [cornDate, setCronDate] = useState<string | null>(null);
  const [form] = Form.useForm<IInterfaceTask>();
  const { API_LEVEL_SELECT } = CONFIG;
  const [open, setOpen] = useState(false);
  const [interfaceDataSource, setInterfaceDataSource] = useState<IInterface[]>(
    [],
  );
  const [mode, setMode] = useState<string>();
  const [detailId, setDetailId] = useState<number>();
  const [isSend, setIsSend] = useState(false);
  const [projectEnum, setProjectEnum] =
    useState<{ label: string; value: number }[]>();
  const [casePartEnum, setCasePartEnum] = useState<CasePartEnum[]>();
  const [currentProjectId, setCurrentProjectId] = useState<number>(
    parseInt(projectId!),
  );
  useEffect(() => {
    fetchProjects().then((data) => {
      if (data) {
        const proEnum = data.map((item) => {
          return { label: item.name, value: item.id };
        });
        setProjectEnum(proEnum);
      }
    });
  }, []);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      const { code, data } = await getInterfaceTaskDetail({ uid: taskId! });
      if (code === 0) {
        return data;
      }
    };
    if (taskId) {
      setMode('detail');
      fetchTaskDetail().then((data) => {
        if (data) {
          setDetailId(data.id);
          setCurrentProjectId(data.projectId);
          setIsSend(data.isSend);
          form.setFieldsValue(data);
        }
      });
    } else {
      setMode('add');
    }
  }, [taskId]);

  useEffect(() => {
    const fetchApisDataByTaskId = async () => {
      const { code, data } = await queryInterfacesByTaskId({
        taskId: detailId!,
      });
      if (code === 0) {
        return data;
      }
    };
    if (detailId) {
      fetchApisDataByTaskId().then((value) => {
        if (value) {
          setInterfaceDataSource(value);
        }
      });
    }
  }, [detailId]);

  useEffect(() => {
    if (currentProjectId) {
      // form.setFieldsValue({casePartId: undefined});
      fetchCaseParts().then();
    }
  }, [currentProjectId]);

  const fetchCaseParts = async () => {
    const loopData = (data: IQueryPartTree[]): CasePartEnum[] => {
      return data.map((item) => {
        if (item.children) {
          return {
            title: item.partName,
            value: item.id,
            children: loopData(item.children),
          };
        }
        return { title: item.partName, value: item.id };
      });
    };

    const { code, data } = await casePartTree({ projectID: currentProjectId });
    if (code === 0) {
      const newData = loopData(data);
      setCasePartEnum(newData);
    }
  };
  const fetchProjects = async () => {
    const { code, data } = await queryProject();
    if (code === 0) {
      return data;
    }
  };

  const onSubmit = async () => {
    await form.validateFields();
    const values: IInterfaceTask = form.getFieldsValue(true);
    values.interfaces = interfaceDataSource.map((item) => item.id);
    if (mode === 'add') {
      const { code, data, msg } = await addInterfaceTask(values);
      if (code === 0) {
        message.success(msg);
        history.push(`/interface/task/detail/taskId=${data}`);
      }
    } else if (mode === 'update') {
      const { code, msg } = await updateInterfaceTask(values);
      if (code === 0) {
        setMode('detail');
        message.success(msg);
      }
    }
  };

  const onSelect = (record: any, selected: boolean) => {
    const selectRow: IInterface = { ...record };
    if (selected) {
      if (
        interfaceDataSource?.some((item: IInterface) => item.uid === record.uid)
      ) {
        const message_str = `用例  ${record.title} 已经存在！`;
        message.warning(message_str).then();
        return;
      }
      const mergedValues: IInterface[] = interfaceDataSource
        ? [...interfaceDataSource, selectRow]
        : [selectRow];
      setInterfaceDataSource(mergedValues);
    }
  };
  const fetchApisData = async (search: ISearch) => {
    const { code, data } = await pageApiCase(search);
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
  const columns: ProColumns<IInterface>[] = [
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
      width: '10%',
      render: (_, record) => (
        <a
          onClick={() => {
            history.push(
              `/interface/caseApi/detail/projectID=${record.projectID}&casePartID=${record.casePartID}&uid=${record.uid}`,
            );
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
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              history.push(
                `/interface/caseApi/detail/projectID=${record.projectID}&casePartID=${record.casePartID}&uid=${record.uid}`,
              );
            }}
          >
            {record.title}
          </a>
        );
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
            hidden={mode === 'detail'}
            onClick={() => {
              console.log(record);
              const newDataSource = interfaceDataSource.filter(
                (item) => item.uid !== record.uid,
              );
              setInterfaceDataSource(newDataSource);
            }}
          >
            删除
          </a>
        );
      },
    },
  ];
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
            <Button onClick={onSubmit} type={'primary'}>
              Submit
            </Button>
          ) : (
            <Button
              onClick={() => {
                setMode('update');
              }}
            >
              修改
            </Button>
          )}
        </>
      }
    >
      <MyDrawer name={'API接口'} open={open} setOpen={setOpen}>
        <MyProTable
          rowSelection={{
            onSelect: onSelect,
          }}
          headerTitle={'API接口表'}
          columns={columns}
          rowKey={'uid'}
          request={fetchApisData}
        />
      </MyDrawer>
      <ProForm
        form={form}
        submitter={false}
        readonly={mode === 'detail'}
        layout={'horizontal'}
      >
        <ProCard title={'基本信息'}>
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
            <ProFormText
              width={'lg'}
              tooltip={cornDate}
              name={'cron'}
              label={'Corn表达式'}
              required={true}
              rules={[
                { required: true, message: '表达式必填' },
                () => ({
                  validator(_, value) {
                    if (value === '') {
                      setCronDate(null);
                      return;
                    }
                    try {
                      const date = parser.parseExpression(value);
                      setCronDate(
                        `下次运行时间: ${moment(
                          new Date(date.next().toDate()),
                        ).format('YYYY-MM-DD HH:mm:ss')}`,
                      );
                      return Promise.resolve();
                    } catch (e) {
                      return Promise.reject(
                        new Error('请输入正确的cron表达式'),
                      );
                    }
                  },
                }),
              ]}
              fieldProps={{
                onChange: (e) => {
                  const { value: inputValue } = e.target;
                  console.log('==', inputValue);
                },
              }}
            />
          </ProForm.Group>
          {mode !== 'detail' ? (
            <ProForm.Group>
              <ProFormSelect
                required
                options={projectEnum}
                name="projectId"
                label="所属项目"
                width={'lg'}
                rules={[{ required: true, message: '所属项目必选' }]}
                fieldProps={{
                  onChange: (value: number) => {
                    setCurrentProjectId(value);
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
                }}
                width={'lg'}
              />
            </ProForm.Group>
          ) : null}

          <ProFormGroup>
            <ProFormSwitch
              name={'isSend'}
              label={'是否推送'}
              checkedChildren="ON"
              unCheckedChildren="OFF"
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
                <ProFormText width={'md'} label={'key'} name={'sendKey'} />
              </>
            ) : null}
          </ProFormGroup>
        </ProCard>
        <ProCard
          bodyStyle={{ padding: 0 }}
          style={{
            marginTop: '20px',
          }}
          headerBordered
        >
          <MyProTable
            headerTitle={'任务用例'}
            height={'auto'}
            dataSource={interfaceDataSource}
            toolBarRender={() => [
              <Button
                hidden={mode === 'detail'}
                type={'primary'}
                onClick={() => setOpen(true)}
              >
                添加选择
              </Button>,
            ]}
            rowKey={'uid'}
            search={false}
            columns={columns}
          />
        </ProCard>
        {detailId ? (
          <ProCard>
            <Multiple taskId={detailId} />
          </ProCard>
        ) : null}
      </ProForm>
    </ProCard>
  );
};

export default Index;
