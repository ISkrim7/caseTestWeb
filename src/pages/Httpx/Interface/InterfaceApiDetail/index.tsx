import { IModuleEnum } from '@/api';
import {
  detailInterApiById,
  insertInterApi,
  tryInterApi,
  updateInterApiById,
} from '@/api/inter';
import { addApi2Case } from '@/api/inter/interCase';
import { addInterfaceGroupApi } from '@/api/inter/interGroup';
import { queryEnvByProjectIdFormApi } from '@/components/CommonFunc';
import MyDrawer from '@/components/MyDrawer';
import MyTabs from '@/components/MyTabs';
import InterAssertList from '@/pages/Httpx/componets/InterAssertList';
import InterDoc from '@/pages/Httpx/componets/InterDoc';
import InterExtracts from '@/pages/Httpx/componets/InterExtracts';
import InterPerf from '@/pages/Httpx/componets/InterPerf';
import ApiAfterItems from '@/pages/Httpx/Interface/InterfaceApiDetail/ApiAfterItems';
import ApiBaseForm from '@/pages/Httpx/Interface/InterfaceApiDetail/ApiBaseForm';
import ApiBeforeItems from '@/pages/Httpx/Interface/InterfaceApiDetail/ApiBeforeItems';
import ApiDetailForm from '@/pages/Httpx/Interface/InterfaceApiDetail/ApiDetailForm';
import InterfaceApiResponseDetail from '@/pages/Httpx/InterfaceApiResponse/InterfaceApiResponseDetail';
import { IInterfaceAPI, ITryResponseInfo } from '@/pages/Httpx/types';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import {
  ApiOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FormOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SendOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ProCard, ProForm } from '@ant-design/pro-components';
import {
  Button,
  FloatButton,
  Form,
  message,
  Spin,
  TabsProps,
  Tooltip,
} from 'antd';
import React, { Dispatch, FC, useEffect, useState } from 'react';
import { history, useParams } from 'umi';

interface SelfProps {
  addFromCase: boolean;
  addFromGroup: boolean;
  projectId?: number;
  moduleId?: number;
  setTitle?: Dispatch<React.SetStateAction<string>>;
  setSubCardTitle?: Dispatch<React.SetStateAction<string>>;
  caseApiId?: string;
  groupId?: string;
  interfaceApiInfo?: IInterfaceAPI;
  refresh: () => void;
  apiEnvs?: { label: string; value: number | null }[];
  apiModule?: IModuleEnum[];
}

const Index: FC<SelfProps> = ({
  addFromCase = false,
  addFromGroup = false,
  setTitle,
  setSubCardTitle,
  caseApiId,
  groupId,
  projectId,
  moduleId,
  refresh,
  interfaceApiInfo,
  apiEnvs,
  apiModule,
}) => {
  const { interId } = useParams<{ interId: string }>();
  const [interApiForm] = Form.useForm<IInterfaceAPI>();
  // 1详情 2新增 3 修改
  const [currentMode, setCurrentMode] = useState(1);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [envs, setEnvs] = useState<{ label: string; value: number | null }[]>(
    apiEnvs || [],
  );
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [tryLoading, setTryLoading] = useState(false);
  const [responseInfo, setResponseInfo] = useState<ITryResponseInfo[]>();
  const [currentInterAPIId, setCurrentInterAPIId] = useState<number>();
  const [openDoc, setOpenDoc] = useState(false);

  // 初始化接口详情和项目列表
  useEffect(() => {
    if (interId) {
      setCurrentMode(1);
      fetchInterfaceDetails(interId).then();
    } else {
      setCurrentMode(2);
    }
  }, [interId]);

  // 根据当前项目ID获取环境和用例部分
  useEffect(() => {
    if (apiEnvs && apiModule) {
      setEnvs(apiEnvs);
      setModuleEnum(apiModule);
    }
    if (currentProjectId && !apiEnvs && !apiModule) {
      queryEnvByProjectIdFormApi(currentProjectId, setEnvs, true).then();
      fetchModulesEnum(currentProjectId, ModuleEnum.API, setModuleEnum).then();
    }
  }, [currentProjectId, apiEnvs, apiModule]);

  // 根据接口API信息 form Case 设置表单值
  useEffect(() => {
    // 如果存在接口API信息，则设置当前模式、表单值、数据长度和当前接口API ID
    if (interfaceApiInfo) {
      setCurrentMode(1); // 设置当前模式为查看模式
      interApiForm.setFieldsValue(interfaceApiInfo); // 设置表单值
      setCurrentInterAPIId(interfaceApiInfo.id); // 设置当前接口API ID
      setCurrentProjectId(interfaceApiInfo.project_id);
    }
    if (projectId && moduleId) {
      interApiForm.setFieldValue('project_id', projectId);
      interApiForm.setFieldValue('module_id', moduleId);
    }
  }, [interfaceApiInfo, projectId, moduleId]);

  /**
   * 对用例的新增与修改
   * 区别 公共新增修改 与 从用例新增与修改
   * addFromCase 从用例新增与修改
   * addFromGroup 从API GROUP新增与修改
   */
  const SaveOrUpdate = async () => {
    await interApiForm.validateFields();
    const values = interApiForm.getFieldsValue(true);
    // 从用例中新增私有的API
    values.is_common = addFromCase || addFromGroup ? 0 : 1;
    let successHandler = ({
      code,
      msg,
    }: {
      code: number;
      msg: string;
      data: any;
    }) => {
      if (code === 0) {
        message.success(msg);
        setCurrentMode(1);
        return true;
      }
      return false;
    };
    if (interId !== undefined || values.id !== undefined) {
      //修改
      const { code, msg, data } = await updateInterApiById(values);
      if (successHandler({ code, msg, data })) {
        return;
      }
    } else {
      //新增
      const { code, msg, data } = await insertInterApi(values);
      if (!successHandler({ code, msg, data })) {
        return;
      }
      // 添加到Case中
      if (caseApiId && data) {
        await addApi2Case({ caseId: caseApiId, apiId: data.id });
        refresh();
      } else if (groupId && data) {
        await addInterfaceGroupApi({ groupId: groupId, apiId: data.id });
        refresh();
      } else {
        history.push(`/interface/interApi/detail/interId=${data.id}`);
      }
    }
  };

  const fetchInterfaceDetails = async (id: string | number) => {
    const { code, data } = await detailInterApiById({ interfaceId: id });
    if (code === 0) {
      interApiForm.setFieldsValue(data);
      setCurrentProjectId(data.project_id);
    }
  };
  const TryClick = async () => {
    setTryLoading(true);
    const interfaceId = interId || currentInterAPIId;
    if (!interfaceId) {
      setTryLoading(false);
      return;
    }
    tryInterApi({ interfaceId: interfaceId }).then(({ code, data }) => {
      if (code === 0) {
        setResponseInfo(data);
        setTryLoading(false);
      }
    });
  };

  const DetailExtra: FC<{ currentMode: number }> = ({ currentMode }) => {
    switch (currentMode) {
      //用例详情下 group详情下、公共api不展示编辑按钮
      case 1:
        return (
          <>
            {interId ||
            ((caseApiId !== undefined || groupId !== undefined) &&
              interfaceApiInfo?.is_common === 0) ? (
              <>
                <Button
                  type={'primary'}
                  style={{ marginLeft: 10 }}
                  onClick={() => setCurrentMode(3)}
                >
                  <EditOutlined />
                  Edit
                </Button>
              </>
            ) : null}
          </>
        );
      case 2:
        return (
          <>
            {caseApiId && (
              <Button onClick={refresh} type={'primary'}>
                Cancel
              </Button>
            )}
            <Button
              onClick={SaveOrUpdate}
              style={{ marginLeft: 10 }}
              type={'primary'}
            >
              <SaveOutlined />
              Save
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <Button onClick={SaveOrUpdate} type={'primary'}>
              <SaveOutlined />
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

  const TabItems: TabsProps['items'] = [
    {
      key: '1',
      label: <Tooltip title="依次执行 设置变量、脚本、SQL">前置操作</Tooltip>,
      icon: <SettingOutlined />,
      children: <ApiBeforeItems interApiForm={interApiForm} />,
    },
    {
      key: '2',
      label: '接口基础',
      icon: <ApiOutlined />,
      children: (
        <ApiDetailForm
          interApiForm={interApiForm}
          envs={envs}
          setTitle={setTitle}
          interfaceApiInfo={
            interApiForm.getFieldsValue(true) || interfaceApiInfo
          }
          setSubCardTitle={setSubCardTitle}
          currentMode={currentMode}
        />
      ),
    },
    {
      key: '3',
      label: '出参提取',
      icon: <EditOutlined />,
      children: <InterExtracts form={interApiForm} mode={currentMode} />,
    },
    {
      key: '4',
      label: '断言',
      icon: <CheckCircleOutlined />,
      children: <InterAssertList form={interApiForm} />,
    },
    {
      key: '5',
      label: '后置动作',
      icon: <FormOutlined />,
      children: (
        <ApiAfterItems interApiForm={interApiForm} currentMode={currentMode} />
      ),
    },
    ...(interId
      ? [
          {
            key: '6',
            label: '压力测试',
            icon: <SettingOutlined />,
            children: <InterPerf interfaceId={interId} />,
          },
        ]
      : []),
  ];

  return (
    <ProCard
      bordered
      split={'horizontal'}
      extra={<DetailExtra currentMode={currentMode} />}
    >
      <MyDrawer
        name={'API Doc'}
        width={'40%'}
        open={openDoc}
        setOpen={setOpenDoc}
      >
        <InterDoc />
      </MyDrawer>
      <ProForm form={interApiForm} submitter={false}>
        <ApiBaseForm
          addFromCase={addFromCase}
          addFromGroup={addFromGroup}
          currentMode={currentMode}
          setCurrentProjectId={setCurrentProjectId}
          moduleEnum={moduleEnum}
        />
        <ProCard>
          <MyTabs
            defaultActiveKey={'2'}
            items={TabItems}
            tabBarExtraContent={
              <Button
                size={'middle'}
                loading={tryLoading}
                type={'primary'}
                color={'danger'}
                disabled={currentMode !== 1}
                onClick={TryClick}
              >
                <SendOutlined />
                Try
              </Button>
            }
          />
        </ProCard>
      </ProForm>
      <ProCard>
        <Spin tip={'接口请求中。。'} size={'large'} spinning={tryLoading}>
          {responseInfo ? (
            <InterfaceApiResponseDetail responses={responseInfo} />
          ) : null}
        </Spin>
      </ProCard>
      <FloatButton
        icon={<QuestionCircleOutlined />}
        type="primary"
        onClick={() => setOpenDoc(true)}
        style={{ insetInlineEnd: 24 }}
      />
    </ProCard>
  );
};

export default Index;
