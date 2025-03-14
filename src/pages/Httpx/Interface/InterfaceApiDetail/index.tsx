import { IModuleEnum } from '@/api';
import {
  detailInterApiById,
  insertInterApi,
  setCurl2InterApi,
  tryInterApi,
  updateInterApiById,
} from '@/api/inter';
import { addApi2Case } from '@/api/inter/interCase';
import { addInterfaceGroupApi } from '@/api/inter/interGroup';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { queryEnvByProjectIdFormApi } from '@/components/CommonFunc';
import MyDrawer from '@/components/MyDrawer';
import InterAfterScript from '@/pages/Httpx/componets/InterAfterScript';
import InterAsserts from '@/pages/Httpx/componets/InterAsserts';
import InterBeforeParams from '@/pages/Httpx/componets/InterBeforeParams';
import InterBeforeScript from '@/pages/Httpx/componets/InterBeforeScript';
import InterBeforeSql from '@/pages/Httpx/componets/InterBeforeSQL';
import InterBody from '@/pages/Httpx/componets/InterBody';
import InterDoc from '@/pages/Httpx/componets/InterDoc';
import InterExtracts from '@/pages/Httpx/componets/InterExtracts';
import InterHeader from '@/pages/Httpx/componets/InterHeader';
import InterParam from '@/pages/Httpx/componets/InterParam';
import InterPerf from '@/pages/Httpx/componets/InterPerf';
import InterfaceApiResponseDetail from '@/pages/Httpx/InterfaceApiResponse/InterfaceApiResponseDetail';
import { IInterfaceAPI, ITryResponseInfo } from '@/pages/Httpx/types';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useSelector } from '@@/exports';
import {
  ApiOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  EditOutlined,
  FormOutlined,
  PythonOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SendOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { useDispatch } from '@umijs/plugins/libs/dva';
import {
  Button,
  FloatButton,
  Form,
  message,
  Modal,
  Spin,
  Tabs,
  Tooltip,
} from 'antd';
import React, { Dispatch, FC, useCallback, useEffect, useState } from 'react';
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
  interfaceId?: number;
}

const Index: FC<SelfProps> = ({
  interfaceId,
  addFromCase = false,
  addFromGroup = false,
  projectId,
  setTitle,
  setSubCardTitle,
  moduleId,
  caseApiId,
  groupId,
  refresh,
  interfaceApiInfo,
}) => {
  const dispatch = useDispatch();

  const { interId } = useParams<{ interId: string }>();
  const { API_LEVEL_SELECT, API_STATUS_SELECT, API_REQUEST_METHOD } = CONFIG;
  const [interApiForm] = Form.useForm<IInterfaceAPI>();
  // 1详情 2新增 3 修改
  const [currentMode, setCurrentMode] = useState(1);
  const projects = useSelector(
    (state: { projects: { projects: any } }) => state.projects.projects,
  );
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [envs, setEnvs] = useState<{ label: string; value: number | null }[]>(
    [],
  );
  const [script, setScript] = useState();
  const [currentEnvId, setCurrentEnvId] = useState<number>();
  const [tryLoading, setTryLoading] = useState(false);
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [responseInfo, setResponseInfo] = useState<ITryResponseInfo[]>();
  const [currentInterAPIId, setCurrentInterAPIId] = useState<number>();
  const [headersLength, setHeadersLength] = useState<number>();
  const [queryLength, setQueryLength] = useState<number>();
  const [bodyLength, setBodyLength] = useState<number>();
  const [openDoc, setOpenDoc] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 对用例的新增与修改
   * 区别 公共新增修改 与 从用例新增与修改
   * addFromCase 从用例新增与修改
   * addFromGroup 从API GROUP新增与修改
   */
  const SaveOrUpdate = async () => {
    const v = await interApiForm.validateFields();
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

  const fetchInterfaceDetails = useCallback(
    async (id: string | number) => {
      const { code, data } = await detailInterApiById({ interfaceId: id });
      if (code === 0) {
        interApiForm.setFieldsValue(data);
        setDataLength(data);
        setCurrentProjectId(data.project_id);
      }
    },
    [interApiForm],
  );

  // 初始化接口详情和项目列表
  useEffect(() => {
    if (interId) {
      setCurrentMode(1);
      fetchInterfaceDetails(interId).then();
    } else if (interfaceId) {
      setCurrentMode(1);
      fetchInterfaceDetails(interfaceId).then();
    } else {
      setCurrentMode(2);
    }
    // queryProjects(setProjects).then()
    dispatch({ type: 'projects/fetchProjects' });
  }, [interId, interfaceId, fetchInterfaceDetails, dispatch]);

  // 根据当前项目ID获取环境和用例部分
  useEffect(() => {
    // 如果存在当前项目ID，则获取环境列表和用例部分
    if (currentProjectId) {
      queryEnvByProjectIdFormApi(currentProjectId, setEnvs, true).then();
      fetchModulesEnum(currentProjectId, ModuleEnum.API, setModuleEnum).then();
    }
  }, [currentProjectId]);

  // 根据项目ID和部分ID设置表单值
  useEffect(() => {
    if (projectId) {
      // 如果存在项目ID，则设置当前项目ID和表单的项目ID值
      setCurrentProjectId(projectId);
      interApiForm.setFieldValue('project_id', projectId);
    }
    if (moduleId) {
      // 如果存在部分ID，则设置表单的部分ID值
      interApiForm.setFieldValue('module_id', moduleId);
    }
  }, [projectId, moduleId, interApiForm]);

  // 根据接口API信息设置表单值
  useEffect(() => {
    // 如果存在接口API信息，则设置当前模式、表单值、数据长度和当前接口API ID
    if (interfaceApiInfo) {
      setCurrentMode(1); // 设置当前模式为查看模式
      interApiForm.setFieldsValue(interfaceApiInfo); // 设置表单值
      setDataLength(interfaceApiInfo); // 设置数据长度
      setCurrentInterAPIId(interfaceApiInfo.id); // 设置当前接口API ID
    }
  }, [interfaceApiInfo, interApiForm]);

  const setDataLength = (data: IInterfaceAPI) => {
    setHeadersLength(data?.headers?.length || 0);
    setQueryLength(data?.params?.length || 0);
    switch (data.body_type) {
      case 1:
        setBodyLength(1);
        break;
      case 2:
        setBodyLength(data.data?.length || 0);
        break;
      default:
        setBodyLength(0);
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

  const addonBefore = (
    <>
      <ProFormSelect
        noStyle
        name={'env_id'}
        options={envs}
        required={true}
        placeholder={'环境选择'}
        label={'Env'}
        fieldProps={{
          onChange: (value: number) => setCurrentEnvId(value),
        }}
      />
    </>
  );

  const addonAfter = (
    <>
      <ProFormSelect
        noStyle
        className={'method'}
        name={'method'}
        label={'method'}
        initialValue={'POST'}
        options={API_REQUEST_METHOD}
        required={true}
        rules={[{ required: true, message: 'method 不能为空' }]}
      />
    </>
  );

  const renderTab = (type: number) => {
    switch (type) {
      case 1:
        if (headersLength && headersLength > 0) {
          return (
            <span>
              Headers <span style={{ color: 'green' }}>({headersLength})</span>
            </span>
          );
        }
        return <span>Headers</span>;
      case 2:
        if (queryLength && queryLength > 0) {
          return (
            <span>
              Query <span style={{ color: 'green' }}>({queryLength})</span>
            </span>
          );
        }
        return <span>Query</span>;
      case 3:
        if (bodyLength && bodyLength > 0) {
          return (
            <span>
              Body <span style={{ color: 'green' }}>({bodyLength})</span>
            </span>
          );
        }
        return <span>Body</span>;
    }
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

  const onModelFinish = async () => {
    if (script) {
      const { code, data } = await setCurl2InterApi({ script: script });
      if (code === 0) {
        interApiForm.setFieldsValue(data);
        setIsModalOpen(false);
      }
    }
  };
  return (
    <ProCard
      split={'horizontal'}
      extra={<DetailExtra currentMode={currentMode} />}
    >
      <Modal
        title="导入CURL"
        open={isModalOpen}
        onOk={onModelFinish}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <span style={{ color: 'gray' }}>curl格式内容 快速导入到请求参数</span>
        <AceCodeEditor
          _mode={'text'}
          onChange={(value: any) => setScript(value)}
          value={script}
        />
      </Modal>
      <MyDrawer
        name={'API Doc'}
        width={'40%'}
        open={openDoc}
        setOpen={setOpenDoc}
      >
        <InterDoc />
      </MyDrawer>
      <ProForm
        form={interApiForm}
        disabled={currentMode === 1}
        submitter={false}
      >
        <ProCard hidden={addFromCase || addFromGroup}>
          <ProForm.Group>
            <ProFormSelect
              width={'md'}
              hidden={addFromCase}
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
              name="module_id"
              label="所属模块"
              hidden={addFromCase}
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
              name="level"
              label="优先级"
              width={'md'}
              initialValue={'P1'}
              options={API_LEVEL_SELECT}
              required={true}
              hidden={addFromCase}
              rules={[{ required: true, message: '用例优先级必选' }]}
            />
            <ProFormSelect
              name="status"
              label="用例状态"
              initialValue={'DEBUG'}
              width={'md'}
              options={API_STATUS_SELECT}
              required={true}
              hidden={addFromCase}
              rules={[{ required: true, message: '用例状态必须选' }]}
            />
          </ProForm.Group>
        </ProCard>
        <ProCard>
          <Tabs
            defaultActiveKey={'2'}
            type={'card'}
            size={'large'}
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
          >
            <Tabs.TabPane
              key={'1'}
              icon={<SettingOutlined />}
              tab={
                <Tooltip title="依次执行 设置变量、脚本、SQL">前置操作</Tooltip>
              }
            >
              <ProCard style={{ marginTop: 10 }} bodyStyle={{ padding: 0 }}>
                <Tabs tabPosition={'left'}>
                  <Tabs.TabPane
                    key={'1'}
                    icon={<UnorderedListOutlined />}
                    tab={'设置变量'}
                  >
                    <InterBeforeParams form={interApiForm} />
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key={'2'}
                    icon={<PythonOutlined />}
                    tab={'添加脚本'}
                  >
                    <InterBeforeScript form={interApiForm} />
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key={'3'}
                    icon={<CodeOutlined />}
                    tab={'添加SQL'}
                  >
                    <InterBeforeSql form={interApiForm} />
                  </Tabs.TabPane>
                </Tabs>
              </ProCard>
            </Tabs.TabPane>
            <Tabs.TabPane key={'2'} icon={<ApiOutlined />} tab={'接口基础'}>
              {currentMode === 2 && (
                <span style={{ float: 'right' }}>
                  <CodeOutlined style={{ color: 'gray' }} />
                  <Button
                    type={'link'}
                    style={{ color: 'gray' }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    CURL 快速导入
                  </Button>
                </span>
              )}
              <ProForm.Group>
                <ProFormText
                  label={'接口名称'}
                  name={'name'}
                  width={'md'}
                  required={true}
                  rules={[{ required: true, message: '步骤名称不能为空' }]}
                  fieldProps={{
                    onChange: (e) => {
                      if (setTitle) setTitle(e.target.value);
                    },
                  }}
                />
                <ProFormText
                  label={'URL'}
                  addonBefore={addonBefore}
                  name={'url'}
                  width={'md'}
                  rules={[
                    { required: true, message: '请输入请求url' },
                    {
                      pattern:
                        currentEnvId === -1
                          ? new RegExp('/^(http://|https://).+/;')
                          : new RegExp('^\\/.*'),
                      message: 'url 格式错误',
                    },
                  ]}
                  addonAfter={addonAfter}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormSelect
                  width={'sm'}
                  label={'是否重定向'}
                  name={'follow_redirects'}
                  initialValue={0}
                  options={[
                    { label: '是', value: 1 },
                    { label: '否', value: 0 },
                  ]}
                />
                <ProFormText
                  width={'sm'}
                  label={'请求超时(s)'}
                  name={'connectTimeout'}
                  initialValue={6}
                />
                <ProFormText
                  width={'sm'}
                  label={'响应超时(s)'}
                  initialValue={6}
                  name={'responseTimeout'}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormTextArea
                  label={'步骤描述'}
                  name={'description'}
                  width={'lg'}
                  required={true}
                  fieldProps={{
                    onChange: (e) => {
                      if (setSubCardTitle) setSubCardTitle(e.target.value);
                    },
                  }}
                />
              </ProForm.Group>
              <ProCard bodyStyle={{ padding: 0 }}>
                <Tabs defaultActiveKey={'1'} type="card">
                  <Tabs.TabPane key={'2'} tab={renderTab(1)}>
                    <InterHeader form={interApiForm} />
                  </Tabs.TabPane>
                  <Tabs.TabPane key={'1'} tab={renderTab(2)}>
                    <InterParam form={interApiForm} />
                  </Tabs.TabPane>
                  <Tabs.TabPane key={'3'} tab={renderTab(3)}>
                    <InterBody form={interApiForm} mode={currentMode} />
                  </Tabs.TabPane>
                </Tabs>
              </ProCard>
            </Tabs.TabPane>
            <Tabs.TabPane key={'3'} icon={<EditOutlined />} tab={'出参提取'}>
              <InterExtracts form={interApiForm} mode={currentMode} />
            </Tabs.TabPane>
            <Tabs.TabPane key={'4'} icon={<CheckCircleOutlined />} tab={'断言'}>
              <InterAsserts form={interApiForm} mode={currentMode} />
            </Tabs.TabPane>
            <Tabs.TabPane key={'5'} icon={<FormOutlined />} tab={'后置动作'}>
              <ProCard style={{ marginTop: 10 }} bodyStyle={{ padding: 0 }}>
                <Tabs tabPosition={'left'}>
                  <Tabs.TabPane
                    key={'1'}
                    icon={<PythonOutlined />}
                    tab={'添加脚本'}
                  >
                    <InterAfterScript form={interApiForm} mode={currentMode} />
                  </Tabs.TabPane>
                </Tabs>
              </ProCard>
            </Tabs.TabPane>
            {interId && (
              <Tabs.TabPane
                key={'6'}
                icon={<SettingOutlined />}
                tab={'压力测试'}
              >
                <InterPerf interfaceId={interId} />
              </Tabs.TabPane>
            )}
          </Tabs>
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
