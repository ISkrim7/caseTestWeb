import { IModuleEnum } from '@/api';
import {
  addCaseContent,
  baseInfoApiCase,
  initAPICondition,
  insertApiCase,
  queryContentsByCaseId,
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
import InterfaceApiCaseVars from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/InterfaceApiCaseVars';
import InterfaceApiCaseResultDrawer from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultDrawer';
import InterfaceApiCaseResultTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultTable';
import InterfaceCaseChoiceApiTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceCaseChoiceApiTable';
import { IInterfaceCaseContent } from '@/pages/Httpx/types';
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
  Modal,
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
  const [caseContentElement, setCaseContentElement] = useState<any[]>([]);
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [apiModuleEnum, setAPIModuleEnum] = useState<IModuleEnum[]>([]);
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
  const [apiEnvs, setApiEnvs] = useState<
    { label: string; value: number | null }[]
  >([]);

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
        queryContentsByCaseId(caseApiId),
      ]).then(([baseInfo, contentsInfo]) => {
        if (baseInfo.code === 0) {
          baseForm.setFieldsValue(baseInfo.data);
          setCurrentProjectId(baseInfo.data.project_id);
          setCurrentModuleId(baseInfo.data.module_id);
        }
        if (contentsInfo.code === 0) {
          setCaseContents(contentsInfo.data);
        }
      });
    } else {
      setCurrentStatus(2);
    }
  }, [editCase, caseApiId]);

  useEffect(() => {
    if (currentProjectId) {
      Promise.all([
        fetchModulesEnum(currentProjectId, ModuleEnum.API_CASE, setModuleEnum),
        fetchModulesEnum(currentProjectId, ModuleEnum.API, setAPIModuleEnum),
        queryEnvByProjectIdFormApi(currentProjectId, setApiEnvs, true),
      ]).then();
    }
  }, [currentProjectId]);

  useEffect(() => {
    if (caseContents && apiModuleEnum && apiEnvs) {
      setCaseContentsStepLength(caseContents.length);
      const init = caseContents.map((item, index) => ({
        id: index.toString(),
        api_Id: item.id,
        content: (
          <CaseContentCollapsible
            apiEnvs={apiEnvs}
            apiModule={apiModuleEnum}
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
  }, [caseContents, apiEnvs, apiModuleEnum, caseApiId]);

  // 使用 useEffect 确保在 caseContentElement 更新后执行滚动操作
  useEffect(() => {
    if (caseContentElement.length > 0) {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [caseContentElement]);

  const refresh = async () => {
    setEditCase(editCase + 1);
    setChoiceOpen(false);
    setChoiceGroupOpen(false);
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
            {/* 保留返回按钮 */}
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

  const onDragEnd = (reorderedUIContents: any[]) => {
    const originalOrder = [...caseContentElement];
    setCaseContentElement(reorderedUIContents);

    Modal.confirm({
      title: '确认步骤排序',
      content: '确定要保存当前的步骤顺序吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        if (caseApiId) {
          const reorderData = reorderedUIContents.map((item) => item.api_Id);
          const { code } = await reorderCaseContents({
            case_id: caseApiId,
            content_step_order: reorderData,
          });
          if (code === 0) {
            message.success('步骤顺序已保存');
            await refresh();
          } else {
            message.error('保存失败，已恢复原顺序');
            setCaseContentElement(originalOrder);
          }
        }
      },
      onCancel: () => {
        setCaseContentElement(originalOrder);
        message.info('已取消排序更改');
      },
    });
  };

  const ApisCardExtra: FC<{ current: number }> = ({ current }) => {
    switch (current) {
      case 1:
        return (
          <Space>
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
              添加步骤
            </Dropdown.Button>
            {/* 保留独立按钮方便快速操作 */}
            <Button type={'primary'} onClick={() => setChoiceGroupOpen(true)}>
              选择组
            </Button>
            <Button type={'primary'} onClick={() => setChoiceOpen(true)}>
              选择接口
            </Button>
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
      label: `STEP (${caseContentsStepLength})`,
      children: (
        <>
          {caseContentElement.length === 0 ? (
            <Empty />
          ) : (
            <DnDDraggable
              items={caseContentElement}
              setItems={setCaseContentElement}
              orderFetch={onDragEnd}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <>
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
      <ProCard
        split={'horizontal'}
        extra={<DetailExtra currentStatus={currentStatus} />}
      >
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
    </>
  );
};

export default Index;
