import { queryProject } from '@/api/base';
import {
  executeTask,
  getApiTaskBaseDetail,
  insertApiTask,
} from '@/api/inter/interTask';
import AssociationApis from '@/pages/Httpx/InterfaceApiCaseTask/InterfaceApiCaseTaskDetail/AssociationApis';
import AssociationCases from '@/pages/Httpx/InterfaceApiCaseTask/InterfaceApiCaseTaskDetail/AssociationCases';
import InterfaceApiTaskResultTable from '@/pages/Httpx/InterfaceApiTaskResult/InterfaceApiTaskResultTable';
import { IInterfaceAPITask } from '@/pages/Httpx/types';
import { fetchCaseParts } from '@/pages/UIPlaywright/someFetch';
import { CasePartEnum } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { useParams } from '@@/exports';
import { MailOutlined, WechatWorkOutlined } from '@ant-design/icons';
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
  const [taskForm] = Form.useForm<IInterfaceAPITask>();
  const { API_LEVEL_SELECT } = CONFIG;
  const [currentStatus, setCurrentStatus] = useState(1);
  const [editTsk, setEditTask] = useState<number>(0);
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [currentPartId, setCurrentPartId] = useState<number>();
  const [casePartEnum, setCasePartEnum] = useState<CasePartEnum[]>([]);
  const [isAuto, setIsAuto] = useState<boolean>(false);
  const [isSend, setIsSend] = useState<boolean>(false);

  useEffect(() => {
    if (taskId) {
      getApiTaskBaseDetail(taskId).then(async ({ code, data }) => {
        if (code === 0) {
          taskForm.setFieldsValue(data);
          setCurrentProjectId(data.project_id);
          setCurrentPartId(data.part_id);
          setIsSend(data.is_send as boolean);
          setIsSend(data.is_auto as boolean);
        }
      });
    } else {
      setCurrentStatus(2);
    }
    queryProject().then(({ code, data }) => {
      if (code === 0) {
        const projects = data.map((item) => ({
          label: item.title,
          value: item.id,
        }));
        setProjects(projects);
      }
    });
  }, [editTsk]);

  useEffect(() => {
    if (currentProjectId) {
      fetchCaseParts(currentProjectId, setCasePartEnum).then();
    }
  }, [currentProjectId]);
  const refresh = async () => {
    setEditTask(editTsk + 1);
  };
  const saveTaskBase = async () => {
    const values = await taskForm.validateFields();
    if (taskId) {
      //回显
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

  return (
    <ProCard
      split={'horizontal'}
      extra={<DetailExtra currentStatus={currentStatus} />}
    >
      <ProCard>
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
              name="part_id"
              label="所属模块"
              allowClear
              rules={[{ required: true, message: '所属模块必选' }]}
              fieldProps={{
                onChange: (value) => {
                  setCurrentPartId(value);
                },
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
            <ProFormTextArea
              width={'md'}
              name="desc"
              label="用例描述"
              required={true}
              rules={[{ required: true, message: '用例描述必填' }]}
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
      <ProCard>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={'API'} key="1">
            <ProCard>
              <AssociationApis currentTaskId={taskId} reload={refresh} />
            </ProCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab={'API业务流用例'} key="2">
            <ProCard>
              <AssociationCases currentTaskId={taskId} reload={refresh} />
            </ProCard>
          </Tabs.TabPane>
        </Tabs>
      </ProCard>
      <InterfaceApiTaskResultTable apiCaseTaskId={taskId} />
      <FloatButton.BackTop />
    </ProCard>
  );
};

export default Index;
