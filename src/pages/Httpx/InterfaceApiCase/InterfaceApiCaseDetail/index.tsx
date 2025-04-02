import { IModuleEnum } from '@/api';
import {
  baseInfoApiCase,
  insertApiCase,
  queryApisByCaseId,
  reorderApis2Case,
  runApiCaseBack,
  setApiCase,
} from '@/api/inter/interCase';
import { queryEnvByProjectIdFormApi } from '@/components/CommonFunc';
import MyDraggable from '@/components/MyDraggable';
import MyDrawer from '@/components/MyDrawer';
import GroupApiChoiceTable from '@/pages/Httpx/Interface/interfaceApiGroup/GroupApiChoiceTable';
import ApiCaseBaseForm from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/ApiCaseBaseForm';
import CollapsibleApiCard from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/CollapsibleApiCard';
import InterfaceApiCaseVars from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/InterfaceApiCaseVars';
import InterfaceApiCaseResultDrawer from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultDrawer';
import InterfaceApiCaseResultTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultTable';
import InterfaceCaseChoiceApiTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceCaseChoiceApiTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useParams } from '@@/exports';
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
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
  Tabs,
  TabsProps,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { history } from 'umi';

const Index = () => {
  const { caseApiId } = useParams<{ caseApiId: string }>();
  const [baseForm] = Form.useForm();
  const topRef = useRef<HTMLElement>(null);
  const [apis, setApis] = useState<any[]>([]);
  const [step, setStep] = useState<number>(0);
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [apiModuleEnum, setAPIModuleEnum] = useState<IModuleEnum[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [currentStatus, setCurrentStatus] = useState(1);
  const [queryApis, setQueryApis] = useState<IInterfaceAPI[]>([]);
  const [editCase, setEditCase] = useState<number>(0);
  const [runOpen, setRunOpen] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [choiceGroupOpen, setChoiceGroupOpen] = useState(false);
  const [addButtonDisabled, setAddButtonDisabled] = useState<boolean>(false);
  const [apiEnvs, setApiEnvs] = useState<
    { label: string; value: number | null }[]
  >([]);
  useEffect(() => {
    if (caseApiId) {
      Promise.all([
        baseInfoApiCase(caseApiId),
        queryApisByCaseId(caseApiId),
      ]).then(([baseInfo, apisInfo]) => {
        if (baseInfo.code === 0) {
          baseForm.setFieldsValue(baseInfo.data);
          setCurrentProjectId(baseInfo.data.project_id);
          setCurrentModuleId(baseInfo.data.module_id);
        }
        if (apisInfo.code === 0) {
          setQueryApis(apisInfo.data);
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
  }, [queryApis, apiEnvs, apiModuleEnum, caseApiId]); // 确保所有相关变量在依赖数组中

  // 使用 useEffect 确保在 apis 更新后执行滚动操作
  useEffect(() => {
    if (apis.length > 0) {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [apis]); // 监听 apis 更新

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
  const DetailExtra: FC<{ currentStatus: number }> = ({ currentStatus }) => {
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
          <>
            <Button type={'primary'} onClick={() => setChoiceGroupOpen(true)}>
              Choice Group
            </Button>
            <Divider type={'vertical'} />
            <Button type={'primary'} onClick={() => setChoiceOpen(true)}>
              Choice API
            </Button>
            <Divider type={'vertical'} />
            <Button
              type={'primary'}
              disabled={addButtonDisabled}
              onClick={AddEmptyApiForm}
            >
              Add API
            </Button>
          </>
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
            <MyDraggable
              items={apis}
              setItems={setApis}
              dragEndFunc={onDragEnd}
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
      <MyDrawer name={''} open={runOpen} setOpen={setRunOpen}>
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
      {caseApiId ? <InterfaceApiCaseResultTable apiCaseId={caseApiId} /> : null}
      <FloatButton.BackTop />
    </ProCard>
  );
};

export default Index;
