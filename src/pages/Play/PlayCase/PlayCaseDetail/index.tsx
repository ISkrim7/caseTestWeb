import { queryProject } from '@/api/base';
import { reorderApis2Case } from '@/api/inter/interCase';
import { queryStepByCaseId, uiCaseDetailById } from '@/api/play';
import { queryUIEnvs } from '@/api/play/env';
import CollapsibleUIStepCard from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard';
import { fetchCaseParts } from '@/pages/UIPlaywright/someFetch';
import {
  CasePartEnum,
  IUICase,
  IUICaseSteps,
  IUIEnv,
} from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { useModel, useParams } from '@@/exports';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

const Index = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { initialState } = useModel('@@initialState');
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [form] = Form.useForm<IUICase>();
  // 1详情 2新增 3 修改
  const [currentMode, setCurrentMode] = useState(1);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [envs, setEnvs] = useState<{ label: string; value: number | null }[]>(
    [],
  );
  const [currentEnvId, setCurrentEnvId] = useState<number>();
  const [tryLoading, setTryLoading] = useState(false);
  const [casePartEnum, setCasePartEnum] = useState<CasePartEnum[]>([]);
  const { API_LEVEL_SELECT, API_STATUS_SELECT } = CONFIG;
  const [loading, setLoading] = useState(true);
  const [uiStepsContent, setUIStepsContent] = useState<any[]>([]);
  const [uiSteps, setUISteps] = useState<IUICaseSteps[]>([]);
  const [uiStepsLength, setUIStepsLegnth] = useState<number>(0);
  useEffect(() => {
    if (caseId) {
      setCurrentMode(1);
      uiCaseDetailById({ id: caseId }).then(async ({ code, data, msg }) => {
        if (code === 0 && data) {
          form.setFieldsValue(data);
          setCurrentProjectId(data.projectId);
        } else {
          message.error(msg);
        }
      });
      queryStepByCaseId({ id: caseId }).then(async ({ code, data, msg }) => {
        if (code === 0 && data) {
          setLoading(false);
          setUISteps(data);
        } else {
          message.error(msg);
        }
      });
    } else {
      setCurrentMode(2);
      setLoading(false);
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
    queryUIEnvs().then(async ({ code, data }) => {
      if (code === 0) {
        const envs = data.map((item: IUIEnv) => ({
          label: item.name,
          value: item.id,
        }));
        setEnvs(envs);
      }
    });
  }, []);
  useEffect(() => {
    if (currentProjectId) {
      fetchCaseParts(currentProjectId, setCasePartEnum).then();
    }
  }, [currentProjectId]);

  useEffect(() => {
    if (uiSteps) {
      setUIStepsLegnth(uiSteps.length);
      const init_data = uiSteps.map((item, index) => ({
        id: index.toString(),
        step_id: item.id,
        content: <CollapsibleUIStepCard />,
      }));
      setUIStepsContent(init_data);
    }
  }, [uiSteps]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return; // 拖拽没有放置，退出
    // 重新排序 items 和 formData
    const reorderedApis = reorder(
      uiStepsContent,
      result.source.index,
      result.destination.index,
    );
    setUIStepsContent(reorderedApis);
    if (caseId) {
      const reorderData = reorderedApis.map((item) => item.api_Id);
      reorderApis2Case({ caseId: caseId, apiIds: reorderData }).then(
        async ({ code }) => {
          if (code === 0) {
            console.log('reorder success');
          }
        },
      );
    }
  };

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <ProCard split={'horizontal'}>
      <ProCard>
        <ProForm
          disabled={currentMode === 1}
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
              options={projects}
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
              options={envs}
              name="envId"
              label="运行环境"
              width={'md'}
              rules={[{ required: true, message: '运行环境必填' }]}
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
        <DragDropContext onDragEnd={onDragEnd}></DragDropContext>
      </ProCard>
    </ProCard>
  );
};

export default Index;
