import { IModuleEnum } from '@/api';
import { queryPushConfig } from '@/api/base/pushConfig';
import {
  executeTask,
  getApiTaskBaseDetail,
  insertApiTask,
  updateApiTaskBaseInfo,
} from '@/api/inter/interTask';
import AssociationApis from '@/pages/Httpx/InterfaceApiCaseTask/InterfaceApiCaseTaskDetail/AssociationApis';
import AssociationCases from '@/pages/Httpx/InterfaceApiCaseTask/InterfaceApiCaseTaskDetail/AssociationCases';
import InterfaceApiTaskResultTable from '@/pages/Httpx/InterfaceApiTaskResult/InterfaceApiTaskResultTable';
import { IInterfaceAPITask } from '@/pages/Httpx/types';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useModel, useParams } from '@@/exports';
import { LeftOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, FloatButton, Form, message, Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';
import { history } from 'umi';

const Index = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];
  const [taskForm] = Form.useForm<IInterfaceAPITask>();
  const { API_LEVEL_SELECT } = CONFIG;
  const [currentStatus, setCurrentStatus] = useState(1);
  const [editTsk, setEditTask] = useState<number>(0);

  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [isAuto, setIsAuto] = useState<boolean>(false);

  useEffect(() => {
    if (taskId) {
      getApiTaskBaseDetail(taskId).then(async ({ code, data }) => {
        if (code === 0) {
          taskForm.setFieldsValue(data);
          setCurrentProjectId(data.project_id);
          setCurrentModuleId(data.module_id);
          setIsAuto(data.is_auto as boolean);
        }
      });
    } else {
      setCurrentStatus(2);
    }
  }, [editTsk]);

  useEffect(() => {
    if (currentProjectId) {
      fetchModulesEnum(
        currentProjectId,
        ModuleEnum.API_TASK,
        setModuleEnum,
      ).then();
    }
  }, [currentProjectId]);
  const refresh = () => {
    setEditTask(editTsk + 1);
  };
  const saveTaskBase = async () => {
    await taskForm.validateFields();
    const values = await taskForm.getFieldsValue(true);
    if (taskId) {
      //回显
      const { code, msg } = await updateApiTaskBaseInfo(values);
      if (code === 0) {
        setCurrentStatus(1);
        message.success(msg);
      }
    } else {
      //新增
      const { code, data } = await insertApiTask(values);
      if (code === 0) {
        history.push(`/interface/task/detail/taskId=${data.id}`);
        message.success('添加成功');
      }
    }
  };

  const runTask = async () => {
    if (taskId) {
      const { code, msg } = await executeTask(taskId);
      if (code === 0) {
        message.success(msg);
      }
    }
  };
  const DetailExtra: FC<{ currentStatus: number }> = ({ currentStatus }) => {
    switch (currentStatus) {
      case 1:
        return (
          <div style={{ display: 'flex' }}>
            {/* 新增返回按钮 */}
            <Button
              onClick={() => history.back()}
              icon={<LeftOutlined />}
              style={{ marginRight: 10 }}
            >
              返回
            </Button>
            <Button onClick={runTask}>Run</Button>
            <Button
              type={'primary'}
              style={{ marginLeft: 10 }}
              onClick={() => setCurrentStatus(3)}
            >
              Edit
            </Button>
          </div>
        );
      case 2:
        return (
          <Button onClick={saveTaskBase} type={'primary'}>
            Save
          </Button>
        );
      case 3:
        return (
          <>
            <Button onClick={saveTaskBase} type={'primary'}>
              Save
            </Button>
            <Button
              style={{ marginLeft: 5 }}
              onClick={() => setCurrentStatus(1)}
            >
              Cancel
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const TabItem = [
    {
      key: '1',
      label: '关联接口',
      children: (
        <AssociationApis
          currentTaskId={taskId}
          currentProjectId={currentProjectId}
        />
      ),
    },
    {
      key: '2',
      label: '关联用例',
      children: (
        <AssociationCases
          currentTaskId={taskId}
          reload={refresh}
          currentProjectId={currentProjectId}
        />
      ),
    },
  ];

  return (
    <ProCard split={'horizontal'}>
      <ProCard
        boxShadow
        headerBordered
        subTitle={''}
        title={'项目基本信息'}
        extra={<DetailExtra currentStatus={currentStatus} />}
      >
        <ProForm
          layout={'horizontal'}
          disabled={currentStatus === 1}
          form={taskForm}
          submitter={false}
        >
          <ProForm.Group>
            <ProFormSelect
              width={'md'}
              options={projects}
              label={'所属项目'}
              name={'project_id'}
              required={true}
              onChange={(value) => {
                setCurrentProjectId(value as number);
              }}
            />
            <ProFormTreeSelect
              required
              name="module_id"
              label="所属模块"
              allowClear
              rules={[{ required: true, message: '所属模块必选' }]}
              fieldProps={{
                onChange: (value) => {
                  setCurrentModuleId(value);
                },
                value: currentModuleId,
                treeData: moduleEnum,
                fieldNames: {
                  label: 'title',
                },
                filterTreeNode: true,
              }}
              width={'md'}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              width={'md'}
              name="title"
              label="任务标题"
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
          </ProForm.Group>
          <ProForm.Group>
            <ProFormDigit
              label={'重试次数'}
              name={'retry'}
              width={'md'}
              required={true}
              // hidden={true}
              initialValue={0}
              max={5}
              min={0}
            />
            <ProFormDigit
              tooltip={'设置大于0后日志可能会混乱'}
              label={'并行执行'}
              name={'parallel'}
              required={true}
              width={'md'}
              // hidden={true}
              initialValue={0}
              max={5}
              min={0}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSwitch
              name={'is_auto'}
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
                width={'md'}
                tooltip={'m h d M (day of month)'}
                name={'cron'}
                label={'Cron表达式'}
                required={isAuto}
                placeholder={'* * * * *'}
                rules={[{ required: isAuto, message: '表达式必填' }]}
              />
            ) : null}
            <ProFormSelect
              label={'推送方式'}
              name={'push_id'}
              width={'md'}
              request={async () => {
                const { code, data } = await queryPushConfig();
                if (code === 0 && data.length > 0) {
                  return data.map((item) => {
                    return { label: item.push_name, value: item.id };
                  });
                }
                return [];
              }}
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
      {taskId ? (
        <>
          <ProCard
            title={'关联接口与用例'}
            headerBordered
            boxShadow
            style={{ marginTop: 20, padding: 0 }}
          >
            <Tabs defaultActiveKey="2" size={'large'}>
              <Tabs.TabPane tab={'单API用例表'} key="1">
                <ProCard>
                  <AssociationApis
                    currentTaskId={taskId}
                    currentProjectId={currentProjectId}
                  />
                </ProCard>
              </Tabs.TabPane>
              <Tabs.TabPane tab={'业务流用例表'} key="2">
                <ProCard>
                  <AssociationCases
                    currentTaskId={taskId}
                    reload={refresh}
                    currentProjectId={currentProjectId}
                  />
                </ProCard>
              </Tabs.TabPane>
            </Tabs>
          </ProCard>
          <ProCard
            title={'调试历史'}
            headerBordered
            boxShadow
            style={{ marginTop: 20 }}
          >
            <InterfaceApiTaskResultTable apiCaseTaskId={taskId} />
          </ProCard>
        </>
      ) : null}

      <FloatButton.BackTop />
    </ProCard>
  );
};

export default Index;
