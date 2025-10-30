import { IModuleEnum } from '@/api';
import {
  addCaseContent,
  baseInfoApiCase,
  initAPICondition,
  insertApiCase,
  queryApisByCaseId,
  queryContentsByCaseId,
  reorderApis2Case,
  reorderCaseContents,
  runApiCaseBack,
  setApiCase,
} from '@/api/inter/interCase';
import { queryEnvByProjectIdFormApi } from '@/components/CommonFunc';
import DnDDraggable from '@/components/DnDDraggable';
import MyDrawer from '@/components/MyDrawer';
import GroupApiChoiceTable from '@/pages/Httpx/Interface/interfaceApiGroup/GroupApiChoiceTable';
import ApiCaseBaseForm from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/ApiCaseBaseForm';
import CaseContentCollapsible from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/CaseContentCollapsible';
import CollapsibleApiCard from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/CollapsibleApiCard';
import InterfaceApiCaseVars from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/InterfaceApiCaseVars';
import InterfaceApiCaseResultDrawer from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultDrawer';
import InterfaceApiCaseResultTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultTable';
import InterfaceCaseChoiceApiTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceCaseChoiceApiTable';
import { IInterfaceAPI, IInterfaceCaseContent } from '@/pages/Httpx/types';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useParams } from '@@/exports';
import {
  AlignLeftOutlined,
  ArrowRightOutlined,
  BranchesOutlined,
  FieldTimeOutlined,
  LeftOutlined,
  PlayCircleOutlined,
  PythonOutlined,
  SelectOutlined,
  UngroupOutlined,
} from '@ant-design/icons';
import { ProCard, ProForm } from '@ant-design/pro-components';
import {
  Button,
  Divider,
  Dropdown,
  Empty,
  FloatButton,
  Form,
  MenuProps,
  message,
  Space,
  Tabs,
  TabsProps,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { history } from 'umi';

const Index = () => {
  const { caseApiId } = useParams<{ caseApiId: string }>();
  const [baseForm] = Form.useForm();
  const topRef = useRef<HTMLElement>(null);

  // 老代码状态
  const [apis, setApis] = useState<any[]>([]);
  const [step, setStep] = useState<number>(0);
  const [apiModuleEnum, setAPIModuleEnum] = useState<IModuleEnum[]>([]);
  const [queryApis, setQueryApis] = useState<IInterfaceAPI[]>([]);
  const [apiEnvs, setApiEnvs] = useState<
    { label: string; value: number | null }[]
  >([]);
  const [addButtonDisabled, setAddButtonDisabled] = useState<boolean>(false);

  // 新代码状态
  const [caseContentElement, setCaseContentElement] = useState<any[]>([]);
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [currentStatus, setCurrentStatus] = useState(1);
  const [caseContents, setCaseContents] = useState<IInterfaceCaseContent[]>([]);
  const [caseContentsStepLength, setCaseContentsStepLength] =
    useState<number>(0);
  const [editCase, setEditCase] = useState<number>(0);
  const [runOpen, setRunOpen] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [choiceGroupOpen, setChoiceGroupOpen] = useState(false);
  const [reloadResult, setReloadResult] = useState(0);

  // 初始化
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const projectId = searchParams.get('projectId');
    const moduleId = searchParams.get('moduleId');

    if (projectId) {
      const projectIdNum = parseInt(projectId);
      baseForm.setFieldValue('project_id', projectIdNum);
      setCurrentProjectId(projectIdNum);
    }
    if (moduleId) {
      baseForm.setFieldValue('module_id', parseInt(moduleId));
      setCurrentModuleId(parseInt(moduleId));
    }

    if (caseApiId) {
      Promise.all([
        baseInfoApiCase(caseApiId),
        queryApisByCaseId(caseApiId),
        queryContentsByCaseId(caseApiId),
      ]).then(([baseInfo, apisInfo, contentsInfo]) => {
        if (baseInfo.code === 0) {
          baseForm.setFieldsValue(baseInfo.data);
          setCurrentProjectId(baseInfo.data.project_id);
          setCurrentModuleId(baseInfo.data.module_id);
        }
        if (apisInfo.code === 0) {
          setQueryApis(apisInfo.data);
        }
        if (contentsInfo.code === 0) {
          setCaseContents(contentsInfo.data);
        }
      });
    } else {
      setCurrentStatus(2);
    }
  }, [editCase, caseApiId]);

  // 获取环境和模块数据
  useEffect(() => {
    if (currentProjectId) {
      Promise.all([
        fetchModulesEnum(currentProjectId, ModuleEnum.API_CASE, setModuleEnum),
        fetchModulesEnum(currentProjectId, ModuleEnum.API, setAPIModuleEnum),
        queryEnvByProjectIdFormApi(currentProjectId, setApiEnvs, true),
      ]).then();
    }
  }, [currentProjectId]);

  // 初始化API卡片（老代码功能）
  useEffect(() => {
    if (queryApis && apiModuleEnum && apiEnvs) {
      setStep(queryApis.length);
      const init = queryApis.map((item, index) => ({
        id: (index + 1).toString(),
        api_Id: item.id,
        content: (
          <CollapsibleApiCard
            apiEnvs={apiEnvs}
            apiModule={apiModuleEnum}
            moduleId={currentModuleId}
            projectId={currentProjectId}
            step={index + 1}
            collapsible={true}
            refresh={refresh}
            interfaceApiInfo={item}
            caseApiId={caseApiId}
          />
        ),
      }));
      setApis(init);
    }
  }, [queryApis, apiEnvs, apiModuleEnum, caseApiId]);

  // 初始化步骤内容（新代码功能）
  useEffect(() => {
    if (caseContents) {
      setCaseContentsStepLength(caseContents.length);
      const init = caseContents.map((item, index) => ({
        id: index,
        api_Id: item.id,
        content: (
          <CaseContentCollapsible
            moduleId={currentModuleId}
            projectId={currentProjectId}
            step={index + 1}
            collapsible={true}
            callback={refresh}
            caseContent={item}
            caseId={parseInt(caseApiId!)}
          />
        ),
      }));
      setCaseContentElement(init);
    }
  }, [caseContents]);

  // 滚动到顶部
  useEffect(() => {
    if (apis.length > 0 || caseContentElement.length > 0) {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [apis, caseContentElement]);

  const refresh = async () => {
    setEditCase(editCase + 1);
    setChoiceOpen(false);
    setChoiceGroupOpen(false);
    setAddButtonDisabled(false);
  };

  /**
   * 保存基本信息
   */
  const saveBaseInfo = async () => {
    const values = await baseForm.getFieldsValue(true);
    if (caseApiId) {
      await setApiCase(values).then(async ({ code, msg }) => {
        if (code === 0) {
          setCurrentStatus(1);
          await message.success(msg);
        }
      });
    } else {
      await insertApiCase(values).then(async ({ code, data }) => {
        if (code === 0) {
          history.push(`/interface/caseApi/detail/caseApiId=${data.id}`);
          message.success('添加成功');
        }
      });
    }
  };

  const onMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    if (caseApiId) {
      if (key === '1') {
        runApiCaseBack(caseApiId).then(async ({ code }) => {
          if (code === 0) {
            setReloadResult(reloadResult + 1);
            message.success('后台运行中。。');
          }
        });
      } else {
        setRunOpen(true);
      }
    }
  };

  const DetailExtra: FC<{ currentStatus: number }> = ({ currentStatus }) => {
    switch (currentStatus) {
      case 1:
        return (
          <div style={{ display: 'flex' }}>
            {/* 保留老代码的返回按钮 */}
            <Button
              onClick={() => history.back()}
              icon={<LeftOutlined />}
              style={{ marginRight: 10 }}
            >
              返回
            </Button>
            <Dropdown.Button
              menu={{
                items: [
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
                ],
                onClick: onMenuClick,
              }}
              icon={<PlayCircleOutlined />}
            >
              Run By
            </Dropdown.Button>
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
          <Button onClick={saveBaseInfo} type={'primary'}>
            Save
          </Button>
        );
      case 3:
        return (
          <>
            <Button onClick={saveBaseInfo} type={'primary'}>
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

  // 老代码的拖拽排序
  const onApiDragEnd = (reorderedUIContents: any[]) => {
    setApis(reorderedUIContents);
    if (caseApiId) {
      const reorderData = reorderedUIContents.map((item) => item.api_Id);
      reorderApis2Case({ caseId: caseApiId, apiIds: reorderData }).then(
        async ({ code }) => {
          if (code === 0) {
            console.log('reorder success');
            await refresh();
          }
        },
      );
    }
  };

  // 新代码的拖拽排序
  const onContentDragEnd = (reorderedUIContents: any[]) => {
    setCaseContentElement(reorderedUIContents);
    if (caseApiId) {
      const reorderData = reorderedUIContents.map((item) => item.api_Id);
      reorderCaseContents({
        case_id: caseApiId,
        content_step_order: reorderData,
      }).then(async ({ code }) => {
        if (code === 0) {
          console.log('reorder success');
          await refresh();
        }
      });
    }
  };

  // 老代码的添加空API表单
  const AddEmptyApiForm = async () => {
    setAddButtonDisabled(true);
    const currStep = step + 1;
    setStep(currStep);
    setApis((prev) => [
      ...prev,
      {
        id: currStep.toString(),
        content: (
          <CollapsibleApiCard
            apiEnvs={apiEnvs}
            top={topRef}
            step={currStep}
            collapsible={false}
            refresh={refresh}
            caseApiId={caseApiId}
            moduleId={currentModuleId}
            projectId={currentProjectId}
          />
        ),
      },
    ]);
  };

  const ApisCardExtra: FC<{ current: number }> = ({ current }) => {
    switch (current) {
      case 1:
        return (
          <Space>
            {/* 保留老代码的按钮 */}
            <Button type={'primary'} onClick={() => setChoiceGroupOpen(true)}>
              Choice Group
            </Button>
            <Button type={'primary'} onClick={() => setChoiceOpen(true)}>
              Choice API
            </Button>
            <Button
              type={'primary'}
              disabled={addButtonDisabled}
              onClick={AddEmptyApiForm}
            >
              Add API
            </Button>

            {/* 新代码的下拉菜单 */}
            <Dropdown.Button
              type={'primary'}
              menu={{
                items: [
                  {
                    key: 'choice_group',
                    label: '选择公共组',
                    icon: <UngroupOutlined style={{ color: 'blue' }} />,
                    onClick: () => setChoiceGroupOpen(true),
                  },
                  {
                    key: 'choice_api',
                    label: '选择公共接口',
                    icon: <SelectOutlined style={{ color: 'blue' }} />,
                    onClick: () => setChoiceOpen(true),
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'add_condition',
                    label: '添加条件',
                    icon: <BranchesOutlined style={{ color: 'orange' }} />,
                    onClick: async () => {
                      if (caseApiId) {
                        const { code } = await initAPICondition({
                          interface_case_id: parseInt(caseApiId),
                        });
                        if (code === 0) {
                          await refresh();
                        }
                      }
                    },
                  },
                  {
                    key: 'wait',
                    label: '等待',
                    icon: <FieldTimeOutlined style={{ color: 'orange' }} />,
                    onClick: async () => {
                      if (caseApiId) {
                        const { code } = await addCaseContent({
                          case_id: parseInt(caseApiId),
                          content_type: 6,
                        });
                        if (code === 0) {
                          await refresh();
                        }
                      }
                    },
                  },
                  {
                    key: 'add_script',
                    label: '添加脚本',
                    icon: <PythonOutlined style={{ color: 'orange' }} />,
                    onClick: async () => {
                      if (caseApiId) {
                        const { code } = await addCaseContent({
                          case_id: parseInt(caseApiId),
                          content_type: 4,
                        });
                        if (code === 0) {
                          await refresh();
                        }
                      }
                    },
                  },
                ],
              }}
              icon={<AlignLeftOutlined />}
            >
              添加
            </Dropdown.Button>
          </Space>
        );
      default:
        return null;
    }
  };

  const APIStepItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Vars',
      children: <InterfaceApiCaseVars currentCaseId={caseApiId} />,
    },
    {
      key: '2',
      label: `API (${apis.length})`,
      children: (
        <>
          {apis.length === 0 ? (
            <Empty />
          ) : (
            <DnDDraggable
              items={apis}
              setItems={setApis}
              orderFetch={onApiDragEnd}
            />
          )}
        </>
      ),
    },
    {
      key: '3',
      label: `STEP (${caseContentsStepLength})`,
      children: (
        <>
          {caseContentElement.length === 0 ? (
            <Empty />
          ) : (
            <DnDDraggable
              items={caseContentElement}
              setItems={setCaseContentElement}
              orderFetch={onContentDragEnd}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <ProCard
      split={'horizontal'}
      extra={<DetailExtra currentStatus={currentStatus} />}
    >
      <MyDrawer
        name={'测试结果'}
        width={'80%'}
        open={runOpen}
        setOpen={setRunOpen}
      >
        <InterfaceApiCaseResultDrawer
          openStatus={runOpen}
          caseApiId={caseApiId!}
        />
      </MyDrawer>
      <MyDrawer name={''} open={choiceGroupOpen} setOpen={setChoiceGroupOpen}>
        <GroupApiChoiceTable
          projectId={currentProjectId}
          refresh={refresh}
          currentCaseId={caseApiId!}
        />
      </MyDrawer>
      <MyDrawer name={''} open={choiceOpen} setOpen={setChoiceOpen}>
        <InterfaceCaseChoiceApiTable
          projectId={currentProjectId}
          currentCaseApiId={caseApiId}
          refresh={refresh}
        />
      </MyDrawer>
      <ProCard>
        <ProForm
          disabled={currentStatus === 1}
          form={baseForm}
          submitter={false}
        >
          <ApiCaseBaseForm
            setCurrentProjectId={setCurrentProjectId}
            setCurrentModuleId={setCurrentModuleId}
            moduleEnum={moduleEnum}
          />
        </ProForm>
      </ProCard>
      <ProCard extra={<ApisCardExtra current={currentStatus} />}>
        <Tabs
          defaultActiveKey={'2'}
          defaultValue={'2'}
          size={'large'}
          type={'card'}
          items={APIStepItems}
        />
      </ProCard>
      {caseApiId ? (
        <InterfaceApiCaseResultTable
          apiCaseId={caseApiId}
          reload={reloadResult}
        />
      ) : null}
      <FloatButton.BackTop />
    </ProCard>
  );
};

export default Index;
