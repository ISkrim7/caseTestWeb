import { IEnv } from '@/api';
import { queryEnvBy, queryProject } from '@/api/base';
import {
  detailInterApiById,
  insertInterApi,
  tryInterApi,
  updateInterApiById,
} from '@/api/inter';
import { addApi2Case } from '@/api/inter/interCase';
import { addInterfaceGroupApi } from '@/api/inter/interGroup';
import InterAfterScript from '@/pages/Httpx/componets/InterAfterScript';
import InterAsserts from '@/pages/Httpx/componets/InterAsserts';
import InterBeforeParams from '@/pages/Httpx/componets/InterBeforeParams';
import InterBeforeScript from '@/pages/Httpx/componets/InterBeforeScript';
import InterBody from '@/pages/Httpx/componets/InterBody';
import InterExtracts from '@/pages/Httpx/componets/InterExtracts';
import InterHeader from '@/pages/Httpx/componets/InterHeader';
import InterParam from '@/pages/Httpx/componets/InterParam';
import InterfaceApiResponseDetail from '@/pages/Httpx/InterfaceApiResponse/InterfaceApiResponseDetail';
import { IInterfaceAPI, ITryResponseInfo } from '@/pages/Httpx/types';
import { fetchCaseParts } from '@/pages/Play/componets/someFetch';
import { CasePartEnum } from '@/pages/Play/componets/uiTypes';
import { CONFIG } from '@/utils/config';
import {
  ApiOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FormOutlined,
  PythonOutlined,
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
import { Button, Form, message, Spin, Tabs } from 'antd';
import React, { Dispatch, FC, useEffect, useState } from 'react';
import { history, useParams } from 'umi';

interface SelfProps {
  addFromCase: boolean;
  addFromGroup: boolean;
  projectId?: number;
  partId?: number;
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
  partId,
  caseApiId,
  groupId,
  refresh,
  interfaceApiInfo,
}) => {
  const { interId } = useParams<{ interId: string }>();
  const { API_LEVEL_SELECT, API_STATUS_SELECT, API_REQUEST_METHOD } = CONFIG;
  const [interApiForm] = Form.useForm<IInterfaceAPI>();
  // 1详情 2新增 3 修改
  const [currentMode, setCurrentMode] = useState(1);
  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [envs, setEnvs] = useState<{ label: string; value: number | null }[]>(
    [],
  );
  const [currentEnvId, setCurrentEnvId] = useState<number>();
  const [tryLoading, setTryLoading] = useState(false);
  const [casePartEnum, setCasePartEnum] = useState<CasePartEnum[]>([]);
  const [responseInfo, setResponseInfo] = useState<ITryResponseInfo[]>();
  const [currentInterAPIId, setCurrentInterAPIId] = useState<number>();
  const [headersLength, setHeadersLength] = useState<number>();
  const [queryLength, setQueryLength] = useState<number>();
  const [bodyLength, setBodyLength] = useState<number>();

  // 初始化接口详情和项目列表
  useEffect(() => {
    // 如果存在接口ID，则获取接口详细信息
    if (interId) {
      setCurrentMode(1); // 设置当前模式为查看模式
      detailInterApiById({ interfaceId: interId }).then(({ code, data }) => {
        if (code === 0) {
          // 请求成功
          interApiForm.setFieldsValue(data); // 设置表单值
          setDataLength(data); // 设置数据长度
          setCurrentProjectId(data.project_id); // 设置当前项目ID
        }
      });
    } else if (interfaceId) {
      setCurrentMode(1); // 设置当前模式为查看模式
      detailInterApiById({ interfaceId: interfaceId }).then(
        ({ code, data }) => {
          if (code === 0) {
            // 请求成功
            interApiForm.setFieldsValue(data); // 设置表单值
            setDataLength(data); // 设置数据长度
            setCurrentProjectId(data.project_id); // 设置当前项目ID
          }
        },
      );
    } else {
      setCurrentMode(2); // 如果不存在接口ID，则设置当前模式为编辑模式
    }
    // 获取项目列表
    queryProject().then(({ code, data }) => {
      if (code === 0) {
        // 请求成功
        const projects = data.map((item) => ({
          label: item.title,
          value: item.id,
        }));
        setProjects(projects); // 设置项目列表
      }
    });
  }, []);

  // 根据当前项目ID获取环境和用例部分
  useEffect(() => {
    // 如果存在当前项目ID，则获取环境列表和用例部分
    if (currentProjectId) {
      queryEnvBy({ project_id: currentProjectId } as IEnv).then(
        ({ code, data }) => {
          if (code === 0) {
            // 请求成功
            const envs = data.map((item) => ({
              label: item.name,
              value: item.id,
            }));
            const noEnv = { label: '自定义', value: -1 };
            setEnvs([noEnv, ...envs]); // 设置环境列表
          }
        },
      );
      fetchCaseParts(currentProjectId, setCasePartEnum).then(); // 获取用例部分
    }
  }, [currentProjectId]);

  // 根据项目ID和部分ID设置表单值
  useEffect(() => {
    // 如果存在项目ID，则设置当前项目ID和表单的项目ID值
    if (projectId) {
      setCurrentProjectId(projectId);
      interApiForm.setFieldValue('project_id', projectId);
    }
    // 如果存在部分ID，则设置表单的部分ID值
    if (partId) {
      interApiForm.setFieldValue('part_id', partId);
    }
  }, [projectId, partId]);

  // 根据接口API信息设置表单值
  useEffect(() => {
    // 如果存在接口API信息，则设置当前模式、表单值、数据长度和当前接口API ID
    if (interfaceApiInfo) {
      setCurrentMode(1); // 设置当前模式为查看模式
      interApiForm.setFieldsValue(interfaceApiInfo); // 设置表单值
      setDataLength(interfaceApiInfo); // 设置数据长度
      setCurrentInterAPIId(interfaceApiInfo.id); // 设置当前接口API ID
    }
  }, [interfaceApiInfo]);

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
        // 记录日志或添加注释，解释为什么设置为 0
        console.warn('Unexpected body_type value:', data.body_type);
        setBodyLength(0);
    }
  };
  const TryClick = async () => {
    setTryLoading(true);
    const interfaceId = interId || currentInterAPIId;
    if (!interfaceId) {
      // 处理边界条件，提供明确的反馈
      console.error('No valid interface ID provided');
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
        initialValue={'GET'}
        options={API_REQUEST_METHOD}
        required={true}
        rules={[{ required: true, message: 'method 不能为空' }]}
      />
      <Button
        loading={tryLoading}
        disabled={currentMode !== 1}
        type={'primary'}
        onClick={TryClick}
        style={{ borderRadius: '10px', marginLeft: 40 }}
      >
        Try
      </Button>
    </>
  );

  /**
   * 对用例的新增与修改
   * 区别 公共新增修改 与 从用例新增与修改
   * addFromCase 从用例新增与修改
   * addFromGroup 从API GROUP新增与修改
   */
  const SaveOrUpdate = async () => {
    const values = interApiForm.getFieldsValue(true);

    // 从用例中新增私有的API
    values.is_common = addFromCase ? 0 : 1;
    values.is_common = addFromGroup ? 0 : 1;
    if (interId !== undefined || values.id !== undefined) {
      //修改
      await updateInterApiById(values).then(({ code, msg }) => {
        if (code === 0) {
          message.success(msg);
          setCurrentMode(1);
        }
      });
    } else {
      //新增
      await insertInterApi(values).then(async ({ code, data, msg }) => {
        if (code === 0) {
          message.success(msg);
          setCurrentMode(1);
          // 添加到Case中
          if (caseApiId && data) {
            await addApi2Case({ caseId: caseApiId, apiId: data.id }).then(
              async () => {
                refresh();
              },
            );
          } else if (groupId && data) {
            addInterfaceGroupApi({ groupId: groupId, apiId: data.id }).then(
              async () => {
                refresh();
              },
            );
          } else {
            history.push(`/interface/interApi/detail/interId=${data.id}`);
          }
        }
      });
    }
  };

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
              Save
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <Button onClick={SaveOrUpdate} type={'primary'}>
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
      split={'horizontal'}
      extra={<DetailExtra currentMode={currentMode} />}
    >
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
              name="part_id"
              label="所属模块"
              hidden={addFromCase}
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
          <Tabs defaultActiveKey={'2'} size={'large'}>
            <Tabs.TabPane key={'1'} icon={<SettingOutlined />} tab={'前置操作'}>
              <ProCard style={{ marginTop: 10 }} bodyStyle={{ padding: 0 }}>
                <Tabs tabPosition={'left'}>
                  <Tabs.TabPane
                    key={'1'}
                    icon={<UnorderedListOutlined />}
                    tab={'设置变量'}
                  >
                    <InterBeforeParams form={interApiForm} mode={currentMode} />
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key={'2'}
                    icon={<PythonOutlined />}
                    tab={'添加脚本'}
                  >
                    <InterBeforeScript form={interApiForm} mode={currentMode} />
                  </Tabs.TabPane>
                </Tabs>
              </ProCard>
            </Tabs.TabPane>
            <Tabs.TabPane key={'2'} icon={<ApiOutlined />} tab={'接口基础'}>
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
                    <InterParam form={interApiForm} mode={currentMode} />
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
    </ProCard>
  );
};

export default Index;
