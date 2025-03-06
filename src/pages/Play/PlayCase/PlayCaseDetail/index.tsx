import { IModuleEnum } from '@/api';
import {
  addUICaseBaseInfo,
  executeCaseByBack,
  putUICaseBaseInfo,
  queryStepByCaseId,
  uiCaseDetailById,
} from '@/api/play';
import { reOrderStep } from '@/api/play/step';
import {
  queryEnvByProjectIdFormApi,
  queryProjects,
} from '@/components/CommonFunc';
import MyDraggable from '@/components/MyDraggable';
import MyDrawer from '@/components/MyDrawer';
import AddStep from '@/pages/Play/componets/AddStep';
import { IUICase, IUICaseSteps } from '@/pages/Play/componets/uiTypes';
import CollapsibleUIStepCard from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard';
import PlayCaseVars from '@/pages/Play/PlayCase/PlayCaseDetail/PlayCaseVars';
import PlayCommonChoiceTable from '@/pages/Play/PlayCase/PlayCaseDetail/PlayCommonChoiceTable';
import PlayCaseResultDetail from '@/pages/Play/PlayResult/PlayCaseResultDetail';
import PlayCaseResultTable from '@/pages/Play/PlayResult/PlayCaseResultTable';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum, queryUIEnvList } from '@/utils/somefunc';
import { useParams } from '@@/exports';
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import {
  Button,
  Divider,
  Dropdown,
  FloatButton,
  Form,
  MenuProps,
  message,
  Tabs,
} from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
interface IUIStepContent {
  id: string;
  step_id: number;
  content: React.ReactNode;
}
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
  const [apiEnvs, setApiEnvs] = useState<
    { label: string; value: number | null }[]
  >([]);
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const { API_LEVEL_SELECT, API_STATUS_SELECT } = CONFIG;
  const [uiStepsContent, setUIStepsContent] = useState<IUIStepContent[]>([]);
  const [uiSteps, setUISteps] = useState<IUICaseSteps[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [openAddStepDrawer, setOpenAddStepDrawer] = useState(false);
  const [openChoiceStepDrawer, setOpenChoiceStepDrawer] = useState(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [runOpen, setRunOpen] = useState(false);
  const [varsNum, setVarsNum] = useState(0);

  /*
  查询project && env
   */
  useEffect(() => {
    Promise.all([queryProjects(setProjects), queryUIEnvList(setEnvs)]).then();
  }, []);

  useEffect(() => {
    if (currentProjectId) {
      // 获取模块枚举和环境数据
      Promise.all([
        fetchModulesEnum(currentProjectId, ModuleEnum.UI_CASE, setModuleEnum),
        queryEnvByProjectIdFormApi(currentProjectId, setApiEnvs, true),
      ]).then();
    }
  }, [currentProjectId]);
  /**
   * 如果是caseId 传递 这个证明是case 详情页
   */
  useEffect(() => {
    if (caseId) {
      // 获取 case 详情
      uiCaseDetailById(caseId).then(async ({ code, data }) => {
        if (code === 0) {
          form.setFieldsValue(data);
          setCurrentProjectId(data.project_id);
        }
      });
      // 获取步骤数据
      queryStepByCaseId(caseId).then(async ({ code, data }) => {
        if (code === 0 && data) {
          setUISteps(data);
        }
      });
      setCurrentMode(1);
    } else {
      setCurrentMode(2);
    }
  }, [refresh, caseId]);

  //set case steps content
  useEffect(() => {
    if (uiSteps && uiSteps.length > 0) {
      setUIStepsContent(
        uiSteps.map((item, index) => ({
          id: index.toString(),
          step_id: item.id,
          content: (
            <CollapsibleUIStepCard
              apiEnv={apiEnvs}
              caseId={caseId!}
              currentProjectId={currentProjectId}
              callBackFunc={handelRefresh}
              collapsible={true} // 默认折叠
              uiStepInfo={item}
            />
          ),
        })),
      );
    }
  }, [refresh, uiSteps, apiEnvs]);
  const onDragEnd = async (reorderedUIContents: any[]) => {
    if (caseId) {
      const reorderData = reorderedUIContents.map((item) => item.step_id);
      reOrderStep({ caseId: caseId, stepIds: reorderData }).then();
    }
  };
  const handelRefresh = useCallback(() => {
    setOpenAddStepDrawer(false);
    setOpenChoiceStepDrawer(false);
    setRefresh(refresh + 1);
  }, []);

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
  const onMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    if (caseId) {
      if (key === '1') {
        executeCaseByBack({ caseId: caseId }).then(async ({ code }) => {
          if (code === 0) {
            message.success('后台运行中。。');
          }
        });
      } else {
        setRunOpen(true);
      }
    }
  };
  const items = [
    {
      key: '1',
      label: '后台运行',
      icon: <ArrowRightOutlined />,
    },
    {
      key: '2',
      label: '实时日志运行',
      icon: <ArrowRightOutlined />,
    },
  ];
  const CaseButtonExtra: FC<{ currentStatus: number }> = ({
    currentStatus,
  }) => {
    switch (currentStatus) {
      case 1:
        return (
          <div style={{ display: 'flex' }}>
            <Dropdown.Button
              menu={{ items, onClick: onMenuClick }}
              icon={<PlayCircleOutlined />}
            >
              Run By
            </Dropdown.Button>
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
            <Button
              type={'primary'}
              onClick={() => setOpenChoiceStepDrawer(true)}
            >
              Choice Step
            </Button>
            <Divider type={'vertical'} />
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
  };
  return (
    <ProCard split={'horizontal'}>
      <MyDrawer
        name={'Add Step'}
        width={'auto'}
        open={openAddStepDrawer}
        setOpen={setOpenAddStepDrawer}
      >
        <AddStep caseId={caseId} func={handelRefresh} />
      </MyDrawer>
      <MyDrawer
        name={'Choice Api'}
        open={openChoiceStepDrawer}
        setOpen={setOpenChoiceStepDrawer}
      >
        <PlayCommonChoiceTable caseId={caseId} callBackFunc={handelRefresh} />
      </MyDrawer>
      <MyDrawer name={'UI Case Logs'} open={runOpen} setOpen={setRunOpen}>
        <PlayCaseResultDetail caseId={caseId} openStatus={runOpen} />
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
                  form.setFieldsValue({ module_id: undefined });
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
        <Tabs size={'large'} type={'card'} defaultActiveKey={'2'}>
          <Tabs.TabPane
            tab={
              <span>
                Vars (<span style={{ color: 'green' }}>{varsNum}</span>)
              </span>
            }
            key={'1'}
          >
            <PlayCaseVars currentCaseId={caseId!} setVarsNum={setVarsNum} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                Steps (
                <span style={{ color: 'green' }}>{uiStepsContent.length}</span>)
              </span>
            }
            key={'2'}
          >
            <ProCard>
              <MyDraggable
                items={uiStepsContent}
                setItems={setUIStepsContent}
                dragEndFunc={onDragEnd}
              />
            </ProCard>
          </Tabs.TabPane>
        </Tabs>
      </ProCard>

      {caseId ? <PlayCaseResultTable caseId={parseInt(caseId)} /> : null}
      <FloatButton.BackTop />
    </ProCard>
  );
};

export default Index;
