import { IModuleEnum } from '@/api';
import { queryPushConfig } from '@/api/base/pushConfig';
import {
  getPlayTaskByTaskId,
  handelExecutePlayTask,
  insertPlayTask,
  updatePlayTask,
} from '@/api/play/playTask';
import { IUITask } from '@/pages/Play/componets/uiTypes';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useModel } from '@@/exports';
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
import { Button, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { history } from 'umi';

interface Props {
  taskId?: string;
}

const PlayTaskBasicInfoForm: FC<Props> = ({ taskId }) => {
  const [tasKForm] = Form.useForm<IUITask>();

  const { API_LEVEL_SELECT } = CONFIG;
  const { initialState } = useModel('@@initialState');
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  // 0 新增  1 详情 2 修改
  const [currentMode, setCurrentMode] = useState(0);
  const projects = initialState?.projects || [];
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [isAuto, setIsAuto] = useState(false);

  useEffect(() => {
    if (taskId) {
      console.log('===', taskId);
      setCurrentMode(1);
      getPlayTaskByTaskId(taskId).then(async ({ code, data }) => {
        if (code === 0) {
          tasKForm.setFieldsValue(data);
          setIsAuto(data.is_auto);
          setCurrentProjectId(data.project_id);
        }
      });
    } else {
      setCurrentMode(0);
    }
  }, [taskId]);

  useEffect(() => {
    if (currentProjectId) {
      fetchModulesEnum(
        currentProjectId,
        ModuleEnum.UI_TASK,
        setModuleEnum,
      ).then();
    }
  }, [currentProjectId]);
  const runTask = async () => {
    if (taskId) {
      const { code, msg } = await handelExecutePlayTask({ taskId: taskId });
      if (code === 0) {
        message.success(msg);
      }
    }
  };
  const saveTaskBase = async () => {
    await tasKForm.validateFields();
    const values = await tasKForm.getFieldsValue(true);
    if (taskId) {
      const { code, msg } = await updatePlayTask(values);
      if (code === 0) {
        setCurrentMode(1);
        message.success(msg);
      }
    } else {
      const { code, data } = await insertPlayTask(values);
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
              onClick={() => setCurrentMode(2)}
            >
              Edit
            </Button>
          </div>
        );
      case 0:
        return (
          <Button onClick={saveTaskBase} type={'primary'}>
            Save
          </Button>
        );
      case 2:
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
    <ProCard
      title={'基本信息'}
      extra={<TaskButtonExtra currentStatus={currentMode} />}
    >
      <ProForm form={tasKForm} disabled={currentMode === 1} submitter={false}>
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
          <ProFormSelect
            required
            options={projects}
            name="project_id"
            label="所属项目"
            allowClear
            width={'lg'}
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
          <ProFormTextArea
            width={'lg'}
            name="description"
            label="任务描述"
            required={true}
            rules={[{ required: true, message: '任务描述必填' }]}
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
  );
};

export default PlayTaskBasicInfoForm;
