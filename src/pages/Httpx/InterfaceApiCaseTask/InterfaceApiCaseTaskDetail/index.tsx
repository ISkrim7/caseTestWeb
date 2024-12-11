import { queryProject } from '@/api/base';
import { IInterfaceAPITask } from '@/pages/Interface/types';
import { CasePartEnum } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { useParams } from '@@/exports';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Divider, Form } from 'antd';
import { FC, useEffect, useState } from 'react';

const Index = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [taskForm] = Form.useForm<IInterfaceAPITask>();
  const { API_LEVEL_SELECT, API_STATUS_SELECT } = CONFIG;
  const [currentStatus, setCurrentStatus] = useState(1);
  const [editTsk, setEditTask] = useState<number>(0);
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [currentPartId, setCurrentPartId] = useState<number>();
  const [casePartEnum, setCasePartEnum] = useState<CasePartEnum[]>([]);

  useEffect(() => {
    if (taskId) {
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
  const saveTaskBase = async () => {};
  const DetailExtra: FC<{ currentStatus: number }> = ({ currentStatus }) => {
    switch (currentStatus) {
      case 1:
        return (
          <div style={{ display: 'flex' }}>
            <Button>Run</Button>
            <Divider type={'vertical'} />
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
        </ProForm>
      </ProCard>
    </ProCard>
  );
};

export default Index;
