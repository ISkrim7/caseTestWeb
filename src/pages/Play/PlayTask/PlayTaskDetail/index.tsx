import { IUITask } from '@/pages/Play/componets/uiTypes';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { history, useParams } from '@@/exports';
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

import { IModuleEnum } from '@/api';
import { queryPushConfig } from '@/api/base/pushConfig';
import {
  getTaskById,
  handelExecuteTask,
  newUITask,
  updateUITask,
} from '@/api/play/task';
import { queryProjects } from '@/components/CommonFunc';
import AssociationUICases from '@/pages/Play/PlayTask/PlayTaskDetail/AssociationUICases';
import { fetchModulesEnum } from '@/utils/somefunc';

const Index = () => {
  const { taskId } = useParams<{ taskId: string }>();

  const { API_LEVEL_SELECT, API_STATUS_SELECT } = CONFIG;
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [tasKForm] = Form.useForm<IUITask>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [isAuto, setIsAuto] = useState(false);
  // 1详情 2新增 3 修改
  const [currentMode, setCurrentMode] = useState(1);

  /*
  查询project
   */
  useEffect(() => {
    queryProjects(setProjects).then();
  }, []);
  useEffect(() => {
    if (currentProjectId) {
      fetchModulesEnum(
        currentProjectId,
        ModuleEnum.UI_TASK,
        setModuleEnum,
      ).then();
    }
  }, [currentProjectId]);
  useEffect(() => {
    if (taskId) {
      setCurrentMode(1);
      getTaskById({ taskId: taskId }).then(async ({ code, data }) => {
        if (code === 0) {
          tasKForm.setFieldsValue(data);
          setCurrentProjectId(data.project_id);
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
                  tasKForm.setFieldsValue({ module_id: undefined });
                },
              }}
            />
            <ProFormTreeSelect
              required
              name="module_id"
              label="所属模块"
              allowClear
              rules={[{ required: true, message: '所属模块必选' }]}
              fieldProps={{
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
