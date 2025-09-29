import { IModuleEnum } from '@/api';
import {
  getInterfaceGroup,
  insertInterfaceGroup,
  queryInterfaceGroupApis,
  reorderInterfaceGroupApis,
  tryInterfaceGroup,
  updateInterfaceGroup,
} from '@/api/inter/interGroup';
import { queryEnvByProjectIdFormApi } from '@/components/CommonFunc';
import MyDraggable from '@/components/MyDraggable';
import MyDrawer from '@/components/MyDrawer';
import CollapsibleApiCard from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/CollapsibleApiCard';
import InterfaceCaseChoiceApiTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceCaseChoiceApiTable';
import InterfaceApiResponseDetail from '@/pages/Httpx/InterfaceApiResponse/InterfaceApiResponseDetail';
import {
  IInterfaceAPI,
  IInterfaceGroup,
  ITryResponseInfo,
} from '@/pages/Httpx/types';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useLocation, useModel, useParams } from '@@/exports';
import { LeftOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Divider, Form, message, Modal } from 'antd';
import { FC, useEffect, useState } from 'react';
import { history } from 'umi';

const Index = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [groupForm] = Form.useForm<IInterfaceGroup>();
  const [apisContent, setApisContent] = useState<any[]>([]);
  const [currentStatus, setCurrentStatus] = useState(1);
  const [queryApis, setQueryApis] = useState<IInterfaceAPI[]>([]);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [stepApiIndex, setStepApiIndex] = useState<number>(0);
  const { initialState } = useModel('@@initialState');
  const [projects, setProjects] = useState(() => {
    return (
      initialState?.projects?.map((project) => ({
        label: project.label || '',
        value: project.value || 0,
      })) || []
    );
  });

  useEffect(() => {
    if (!projects.length && initialState?.refreshProjects) {
      initialState.refreshProjects().then((newProjects) => {
        setProjects(
          newProjects.map((project) => ({
            label: project.label || '',
            value: project.value || 0,
          })),
        );
      });
    }
  }, []);
  const [tryResponses, setTryResponses] = useState<ITryResponseInfo[]>([]);
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number | undefined>(
    query.get('projectId') ? Number(query.get('projectId')) : undefined,
  );
  const [currentModuleId, setCurrentModuleId] = useState<number | undefined>(
    query.get('moduleId') ? Number(query.get('moduleId')) : undefined,
  );
  const [reload, setReload] = useState(0);
  const [apiEnvs, setApiEnvs] = useState<
    { label: string; value: number | null }[]
  >([]);
  const handleReload = async () => {
    setReload(reload + 1);
  };

  useEffect(() => {
    if (currentProjectId) {
      Promise.all([
        fetchModulesEnum(currentProjectId, ModuleEnum.API, setModuleEnum),
        queryEnvByProjectIdFormApi(currentProjectId, setApiEnvs, true),
      ]).then();
    }
  }, [currentProjectId]);

  useEffect(() => {
    console.log('URL参数:', {
      projectId: query.get('projectId'),
      moduleId: query.get('moduleId'),
    });

    if (groupId) {
      getInterfaceGroup(groupId).then(async ({ code, data }) => {
        if (code === 0) {
          // 优先使用URL参数中的值，其次使用接口返回的值
          const projectId = query.get('projectId')
            ? Number(query.get('projectId'))
            : data.project_id;
          const moduleId = query.get('moduleId')
            ? Number(query.get('moduleId'))
            : data.module_id;

          console.log('设置表单值:', {
            project_id: projectId,
            module_id: moduleId,
          });

          groupForm.setFieldsValue({
            ...data,
            project_id: projectId,
            module_id: moduleId,
          });
          setCurrentProjectId(projectId);
          setCurrentModuleId(moduleId);
          setCurrentStatus(1);
        }
      });
      queryInterfaceGroupApis(groupId).then(async ({ code, data }) => {
        if (code === 0) {
          setQueryApis(data);
        }
      });
    } else {
      // 新增场景下也设置project_id和module_id
      const projectId = query.get('projectId')
        ? Number(query.get('projectId'))
        : undefined;
      const moduleId = query.get('moduleId')
        ? Number(query.get('moduleId'))
        : undefined;

      if (projectId) {
        setCurrentProjectId(projectId);
        groupForm.setFieldsValue({ project_id: projectId });
      }
      if (moduleId) {
        setCurrentModuleId(moduleId);
        groupForm.setFieldsValue({ module_id: moduleId });
      }
      setCurrentStatus(2);
    }
  }, [reload, groupId]);

  useEffect(() => {
    if (queryApis && moduleEnum && apiEnvs) {
      setStepApiIndex(queryApis.length);
      setApisContent(
        queryApis.map((item, index) => ({
          id: (index + 1).toString(),
          api_Id: item.id,
          content: (
            <CollapsibleApiCard
              step={index + 1}
              apiEnvs={apiEnvs}
              apiModule={moduleEnum}
              collapsible={true}
              refresh={handleReload}
              interfaceApiInfo={item}
              groupId={groupId}
              moduleId={currentModuleId}
              projectId={currentProjectId}
            />
          ),
        })),
      );
    }
  }, [queryApis, moduleEnum, apiEnvs]);
  const saveBaseInfo = async () => {
    const values = await groupForm.validateFields();
    if (groupId) {
      if (currentProjectId === undefined) {
        message.error('请先选择项目');
        return;
      }
      const { code, msg } = await updateInterfaceGroup({
        ...values,
        id: parseInt(groupId),
        project_id: currentProjectId,
        module_id: currentModuleId,
      });
      if (code === 0) {
        message.success(msg);
        setReload(reload + 1);
        setCurrentStatus(1);
      }
    } else {
      if (currentProjectId === undefined) {
        message.error('请先选择项目');
        return;
      }
      const { code, data } = await insertInterfaceGroup({
        ...values,
        project_id: currentProjectId,
        module_id: currentModuleId,
      });
      if (code === 0) {
        history.push({
          pathname: `/interface/group/detail/groupId=${data.id}`,
          search: `?projectId=${currentProjectId?.toString()}&moduleId=${currentModuleId?.toString()}`,
        });
        // 确保跳转后立即设置表单值
        groupForm.setFieldsValue({
          project_id: currentProjectId,
          module_id: currentModuleId,
        });
      }
    }
  };
  const onDragEnd1 = (reorderedAPIContents: any[]) => {
    setApisContent(reorderedAPIContents);
    if (groupId) {
      const reorderData = reorderedAPIContents.map((item) => item.api_Id);
      reorderInterfaceGroupApis({ groupId: groupId, apiIds: reorderData }).then(
        async ({ code }) => {
          if (code === 0) {
            console.log('reorder success');
          }
        },
      );
    }
  };

  const [originalApisContent, setOriginalApisContent] = useState<any[]>([]);
  useEffect(() => {
    if (queryApis && moduleEnum && apiEnvs) {
      setStepApiIndex(queryApis.length);
      setApisContent(
        queryApis.map((item, index) => ({
          id: (index + 1).toString(),
          api_Id: item.id,
          content: (
            <CollapsibleApiCard
              step={index + 1}
              apiEnvs={apiEnvs}
              apiModule={moduleEnum}
              collapsible={true}
              refresh={handleReload}
              interfaceApiInfo={item}
              groupId={groupId}
              moduleId={currentModuleId}
              projectId={currentProjectId}
            />
          ),
        })),
      );
      setOriginalApisContent([...apisContent]); // 保存原始顺序
    }
  }, [queryApis, moduleEnum, apiEnvs]);
  const onDragEnd = async (reorderedAPIContents: any[]) => {
    Modal.confirm({
      title: '确认排序',
      content: '您确定要应用当前的API排序吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setApisContent(reorderedAPIContents);
        if (groupId) {
          const reorderData = reorderedAPIContents.map((item) => item.api_Id);
          const { code } = await reorderInterfaceGroupApis({
            groupId,
            apiIds: reorderData,
          });
          if (code === 0) {
            message.success('排序成功');
          } else {
            message.error('排序失败');
            // 恢复原始排序的逻辑
            setApisContent([...originalApisContent]);
          }
        }
      },
      onCancel: () => {
        // 恢复原始排序的逻辑
        setApisContent([...originalApisContent]);
      },
    });
  };

  const AddEmptyApiForm = () => {
    const currStep = stepApiIndex + 1;
    setStepApiIndex(currStep);
    setApisContent((prev) => [
      ...prev,
      {
        id: currStep.toString(),
        content: (
          <CollapsibleApiCard
            apiEnvs={apiEnvs}
            step={currStep}
            collapsible={false}
            refresh={handleReload}
            projectId={currentProjectId}
            moduleId={currentModuleId}
            groupId={groupId}
          />
        ),
      },
    ]);
  };

  const TryGroup = async () => {
    if (groupId) {
      const { code, data, msg } = await tryInterfaceGroup(groupId);
      if (code === 0) {
        console.log(data);
        message.success(msg);
        setTryResponses(data);
      }
    }
  };

  const DetailExtra: FC<{ currentStatus: number }> = ({ currentStatus }) => {
    switch (currentStatus) {
      case 1:
        return (
          <div style={{ display: 'flex' }}>
            {/* 新增返回按钮 */}
            <Button
              onClick={() => history.back()}
              icon={<LeftOutlined />}
              style={{ marginRight: 10 }}
            >
              返回
            </Button>
            <Button onClick={TryGroup}>Try</Button>
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

  const ApisCardExtra: FC<{ current: number }> = ({ current }) => {
    switch (current) {
      case 1:
        return (
          <>
            <Button type={'primary'} onClick={() => setChoiceOpen(true)}>
              Choice API
            </Button>
            <Divider type={'vertical'} />
            <Button type={'primary'} onClick={AddEmptyApiForm}>
              Add API
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ProCard split={'horizontal'}>
      <MyDrawer name={''} open={choiceOpen} setOpen={setChoiceOpen}>
        <InterfaceCaseChoiceApiTable
          currentGroupId={groupId}
          refresh={handleReload}
        />
      </MyDrawer>
      <ProCard
        extra={<DetailExtra currentStatus={currentStatus}></DetailExtra>}
      >
        <ProForm
          disabled={currentStatus === 1}
          layout={'vertical'}
          submitter={false}
          form={groupForm}
        >
          <ProFormGroup title={'基础信息'}>
            <ProFormSelect
              width={'md'}
              options={projects}
              label={'所属项目'}
              name={'project_id'}
              required={true}
              fieldProps={{
                showSearch: true,
                optionFilterProp: 'label',
                filterOption: (input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
              onChange={(value) => {
                if (value !== undefined) {
                  setCurrentProjectId(Number(value));
                  // 清空模块ID当项目变化时
                  setCurrentModuleId(undefined);
                  groupForm.setFieldsValue({ module_id: undefined });
                }
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

            <ProFormText
              width={'md'}
              name={'name'}
              label={'组名'}
              required={true}
              rules={[{ required: true, message: '组名必填' }]}
            />
            <ProFormTextArea
              width={'md'}
              name={'description'}
              label={'描述'}
              required={true}
              rules={[{ required: true, message: '组描述必填' }]}
            />
          </ProFormGroup>
        </ProForm>
      </ProCard>
      <ProCard extra={<ApisCardExtra current={currentStatus} />}>
        <MyDraggable
          items={apisContent}
          setItems={setApisContent}
          dragEndFunc={onDragEnd}
        />
      </ProCard>
      {tryResponses && <InterfaceApiResponseDetail responses={tryResponses} />}
    </ProCard>
  );
};

export default Index;
