import { CasePartEnum, IUITask } from '@/pages/Play/componets/uiTypes';
import { CONFIG } from '@/utils/config';
import { history, useParams } from '@@/exports';
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
import { Button, Empty, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';

import { queryProject } from '@/api/base';
import {
  getTaskById,
  handelExecuteTask,
  newUITask,
  updateUITask,
} from '@/api/play/task';
import { fetchCaseParts } from '@/pages/Play/componets/someFetch';
import AssociationUICases from '@/pages/Play/PlayTask/PlayTaskDetail/AssociationUICases';

const Index = () => {
  const { taskId } = useParams<{ taskId: string }>();

  const { API_LEVEL_SELECT, API_STATUS_SELECT } = CONFIG;
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [tasKForm] = Form.useForm<IUITask>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [casePartEnum, setCasePartEnum] = useState<CasePartEnum[]>([]);
  const [isSend, setIsSend] = useState(false);
  const [isAuto, setIsAuto] = useState(false);
  // 1详情 2新增 3 修改
  const [currentMode, setCurrentMode] = useState(1);
  const [edit, setEdit] = useState(0);

  /*
  查询project
   */
  useEffect(() => {
    Promise.all([queryProject()]).then(([projectRes]) => {
      if (projectRes.code === 0) {
        const pros = projectRes.data.map((item) => ({
          label: item.title,
          value: item.id,
        }));
        setProjects(pros);
      }
    });
  }, []);
  useEffect(() => {
    if (currentProjectId) {
      fetchCaseParts(currentProjectId, setCasePartEnum).then();
    }
  }, [currentProjectId]);
  useEffect(() => {
    if (taskId) {
      setCurrentMode(1);
      getTaskById({ taskId: taskId }).then(async ({ code, data }) => {
        if (code === 0) {
          tasKForm.setFieldsValue(data);
          setCurrentProjectId(data.project_id);
          setIsSend(data.is_send);
          setIsAuto(data.is_auto);
        }
      });
    } else {
      setCurrentMode(2);
    }
  }, [taskId]);

  const runTask = async () => {
    if (taskId) {
      const { code, msg } = await handelExecuteTask({ taskId: taskId });
      if (code === 0) {
        message.success(msg);
      }
    }
  };

  const saveTaskBase = async () => {
    await tasKForm.validateFields();
    const values = await tasKForm.getFieldsValue(true);
    console.log(values);
    if (taskId) {
      const { code, msg } = await updateUITask(values);
      if (code === 0) {
        setCurrentMode(1);
        message.success(msg);
      }
    } else {
      const { code, data } = await newUITask(values);
      if (code === 0) {
        history.push(`/ui/task/detail/taskId=${data.id}`);
        message.success('添加成功');
      }
    }
  };

  const TaskButtonExtra: FC<{ currentStatus: number }> = ({
    currentStatus,
  }) => {
    switch (currentStatus) {
      case 1:
        return (
          <div style={{ display: 'flex' }}>
            <Button onClick={runTask}>Run</Button>
            <Button
              type={'primary'}
              style={{ marginLeft: 10 }}
              onClick={() => setCurrentMode(3)}
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
            <Button style={{ marginLeft: 5 }} onClick={() => setCurrentMode(1)}>
              Cancel
            </Button>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <ProCard split={'horizontal'}>
      <ProCard
        title={'基本信息'}
        extra={<TaskButtonExtra currentStatus={currentMode} />}
      >
        <ProForm
          form={tasKForm}
          submitter={false}
          disabled={currentMode === 1}
          layout={'horizontal'}
        >
          <ProForm.Group>
            <ProFormText
              width={'md'}
              name="title"
              label="任务标题"
              required={true}
              rules={[{ required: true, message: '任务标题必填' }]}
            />
            <ProFormSelect
              name="level"
              label="优先级"
              width={'md'}
              initialValue={'P1'}
              options={API_LEVEL_SELECT}
              required={true}
              rules={[{ required: true, message: '任务优先级必选' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              required
              options={projects}
              name="project_id"
              label="所属项目"
              width={'md'}
              initialValue={currentProjectId}
              rules={[{ required: true, message: '所属项目必选' }]}
              fieldProps={{
                onChange: (value: number) => {
                  setCurrentProjectId(value);
                  tasKForm.setFieldsValue({ case_part_id: undefined });
                },
              }}
            />
            <ProFormTreeSelect
              required
              name="case_part_id"
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
            <ProFormTextArea
              width={'md'}
              name="description"
              label="任务描述"
              required={true}
              rules={[{ required: true, message: '任务描述必填' }]}
            />
          </ProForm.Group>

          <ProForm.Group>
            <ProFormDigit
              label={'重试次数'}
              name={'retry'}
              width={'md'}
              required={true}
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
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSwitch
              name={'is_send'}
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
                  name={'send_type'}
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
                  name={'send_key'}
                />
              </>
            ) : null}
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard title={'Cases'} style={{ marginTop: 20 }}>
        {taskId ? (
          <AssociationUICases currentTaskId={taskId} />
        ) : (
          <Empty description={'需要先添加基本信息'} />
        )}
      </ProCard>
    </ProCard>
  );
};

export default Index;
