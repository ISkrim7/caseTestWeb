import { queryProject } from '@/api/base';
import {
  addUICaseBaseInfo,
  putUICaseBaseInfo,
  queryStepByCaseId,
  uiCaseDetailById,
} from '@/api/play';
import { queryUIEnvs } from '@/api/play/env';
import { reOrderStep } from '@/api/play/step';
import MyDrawer from '@/components/MyDrawer';
import AddStep from '@/pages/Play/componets/AddStep';
import CollapsibleUIStepCard from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard';
import { fetchCaseParts } from '@/pages/UIPlaywright/someFetch';
import {
  CasePartEnum,
  IUICase,
  IUICaseSteps,
  IUIEnv,
} from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { useParams } from '@@/exports';
import { PlayCircleOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Divider, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { history } from 'umi';

const Index = () => {
  const { caseId } = useParams<{ caseId: string }>();
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
  const [uiStepsLength, setUIStepsLength] = useState<number>(0);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [openAddStepDrawer, setOpenAddStepDrawer] = useState(false);
  const [refresh, setRefresh] = useState<number>(0);

  /*
  查询project && env
   */
  useEffect(() => {
    Promise.all([queryProject(), queryUIEnvs()]).then(
      ([projectRes, envRes]) => {
        if (projectRes.code === 0) {
          const pros = projectRes.data.map((item) => ({
            label: item.title,
            value: item.id,
          }));
          setProjects(pros);
        }
        if (envRes.code === 0) {
          const envs = envRes.data.map((item: IUIEnv) => ({
            label: item.name,
            value: item.id,
          }));
          setEnvs(envs);
        }
      },
    );
  }, []);

  /**
   * 修改project 对应请求casePart
   */
  useEffect(() => {
    if (currentProjectId) {
      fetchCaseParts(currentProjectId, setCasePartEnum).then();
    }
  }, [currentProjectId]);

  /**
   * 如果是caseId 传递 这个证明是case 详情页
   */
  useEffect(() => {
    if (caseId) {
      uiCaseDetailById(caseId).then(async ({ code, data }) => {
        form.setFieldsValue(data);
        setCurrentProjectId(data.project_id);
      });
      queryStepByCaseId(caseId).then(async ({ code, data }) => {
        if (code === 0 && data) {
          setLoading(false);
          setUISteps(data);
        }
      });
      setCurrentMode(1);
    } else {
      setCurrentMode(2);
      setLoading(false);
    }
  }, [refresh, caseId]);

  useEffect(() => {
    if (uiSteps) {
      setUIStepsLength(uiSteps.length);
      const init_data = uiSteps.map((item, index) => ({
        id: index.toString(),
        step_id: item.id,
        content: (
          <CollapsibleUIStepCard
            caseId={caseId!}
            callBackFunc={handelRefresh}
            collapsible={true} // 默认折叠
            uiStepInfo={item}
          />
        ),
      }));
      setUIStepsContent(init_data);
    }
  }, [refresh, uiSteps]);

  const handelRefresh = () => {
    setOpenAddStepDrawer(false);
    setRefresh(refresh + 1);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return; // 拖拽没有放置，退出
    // 重新排序 items 和 formData
    const reorderedUIContents = reorder(
      uiStepsContent,
      result.source.index,
      result.destination.index,
    );
    setUIStepsContent(reorderedUIContents);
    if (caseId) {
      const reorderData = reorderedUIContents.map((item) => item.step_id);
      console.log('====', reorderData);
      reOrderStep({ caseId: caseId, stepIds: reorderData }).then(
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

  const SaveOrUpdateCaseInfo = async () => {
    const values = form.getFieldsValue(true);
    console.log(values);
    if (caseId) {
      putUICaseBaseInfo(values).then(async ({ code, msg }) => {
        if (code === 0) {
          message.success(msg);
          setCurrentMode(1);
        }
      });
    } else {
      addUICaseBaseInfo(values).then(async ({ code, data, msg }) => {
        if (code === 0) {
          message.success(msg);
          history.push(`/ui/case/detail/caseId=${data.id}`);
        }
      });
    }
  };

  const CaseButtonExtra: FC<{ currentStatus: number }> = ({
    currentStatus,
  }) => {
    switch (currentStatus) {
      case 1:
        return (
          <div style={{ display: 'flex' }}>
            <Button icon={<PlayCircleOutlined />}>Try</Button>
            <Divider type={'vertical'} />
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
          <Button onClick={SaveOrUpdateCaseInfo} type={'primary'}>
            Save
          </Button>
        );
      case 3:
        return (
          <>
            <Button onClick={SaveOrUpdateCaseInfo} type={'primary'}>
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
  const AddStepExtra: FC<{ currentStatus: number }> = ({ currentStatus }) => {
    switch (currentStatus) {
      case 1:
        return (
          <>
            {/*<Button type={'primary'} onClick={() => setChoiceOpen(true)}>*/}
            {/*  Choice API*/}
            {/*</Button>*/}
            {/*<Divider type={'vertical'} />*/}
            <Button type={'primary'} onClick={AddUIStep}>
              Add Step
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const AddUIStep = () => {
    setOpenAddStepDrawer(true);
    const currStepIndex = stepIndex + 1;
    setStepIndex(currStepIndex);
    // setUIStepsContent((prev) => [
    //   ...prev,
    //   {
    //     id: currStepIndex.toString(),
    //     content: (
    //       <CollapsibleUIStepCard
    //         collapsible={false}
    //         callBackFunc={handelRefresh} />
    //     ),
    //   },
    // ]);
  };
  return (
    <ProCard split={'horizontal'}>
      <MyDrawer
        name={'Add Step'}
        width={'auto'}
        open={openAddStepDrawer}
        setOpen={setOpenAddStepDrawer}
      >
        <AddStep
          caseId={caseId}
          func={() => {
            handelRefresh();
          }}
        />
      </MyDrawer>
      <ProCard extra={<CaseButtonExtra currentStatus={currentMode} />}>
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
              name="project_id"
              label="所属项目"
              width={'md'}
              initialValue={currentProjectId}
              rules={[{ required: true, message: '所属项目必选' }]}
              fieldProps={{
                onChange: (value: number) => {
                  setCurrentProjectId(value);
                  form.setFieldsValue({ case_part_id: undefined });
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
            <ProFormSelect
              required
              showSearch={true}
              options={envs}
              name="env_id"
              label="运行环境"
              width={'md'}
              rules={[{ required: true, message: '运行环境必填' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormTextArea
              width={'md'}
              name="description"
              label="用例描述"
              required={true}
              rules={[{ required: true, message: '用例描述必填' }]}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard extra={<AddStepExtra currentStatus={currentMode} />}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  // Adjust this to control the look of the droppable area
                  // background: snapshot.isDraggingOver ? '#f4f5f7' : '#fff',
                  padding: '8px',
                  borderRadius: '8px',
                }}
              >
                {uiStepsContent.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ProCard>
    </ProCard>
  );
};

export default Index;
