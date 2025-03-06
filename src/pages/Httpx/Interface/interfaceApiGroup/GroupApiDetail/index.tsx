import { IModuleEnum } from '@/api';
import {
  getInterfaceGroup,
  insertInterfaceGroup,
  queryInterfaceGroupApis,
  reorderInterfaceGroupApis,
  tryInterfaceGroup,
  updateInterfaceGroup,
} from '@/api/inter/interGroup';
import { queryProjects } from '@/components/CommonFunc';
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
import { useParams } from '@@/exports';
import {
  ProCard,
  ProForm,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Divider, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { history } from 'umi';

const Index = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [groupForm] = Form.useForm<IInterfaceGroup>();
  const [apisContent, setApisContent] = useState<any[]>([]);
  const [currentStatus, setCurrentStatus] = useState(1);
  const [queryApis, setQueryApis] = useState<IInterfaceAPI[]>([]);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [stepApiIndex, setStepApiIndex] = useState<number>(0);

  const [projects, setProjects] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [tryResponses, setTryResponses] = useState<ITryResponseInfo[]>([]);
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [reload, setReload] = useState(0);

  const handleReload = async () => {
    setReload(reload + 1);
  };
  useEffect(() => {
    queryProjects(setProjects).then();
  }, []);

  useEffect(() => {
    if (currentProjectId) {
      fetchModulesEnum(currentProjectId, ModuleEnum.API, setModuleEnum).then();
    }
  }, [currentProjectId]);

  useEffect(() => {
    if (groupId) {
      getInterfaceGroup(groupId).then(async ({ code, data }) => {
        if (code === 0) {
          setCurrentProjectId(data.project_id);
          setCurrentModuleId(data.part_id);
          groupForm.setFieldsValue(data);
          setCurrentStatus(1);
        }
      });
      queryInterfaceGroupApis(groupId).then(async ({ code, data }) => {
        if (code === 0) {
          setQueryApis(data);
        }
      });
    } else {
      setCurrentStatus(2);
    }
  }, [reload]);

  useEffect(() => {
    if (queryApis) {
      setStepApiIndex(queryApis.length);
      setApisContent(
        queryApis.map((item, index) => ({
          id: index.toString(),
          api_Id: item.id,
          content: (
            <CollapsibleApiCard
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
  }, [queryApis]);
  const saveBaseInfo = async () => {
    const values = await groupForm.validateFields();
    if (groupId) {
      const { code, msg } = await updateInterfaceGroup({
        ...values,
        id: parseInt(groupId),
      });
      if (code === 0) {
        message.success(msg);
        setReload(reload + 1);
        setCurrentStatus(1);
      }
    } else {
      const { code, data } = await insertInterfaceGroup(values);
      if (code === 0) {
        history.push(`/interface/group/detail/groupId=${data.id}`);
      }
    }
  };
  const onDragEnd = (reorderedAPIContents: any[]) => {
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

  const AddEmptyApiForm = () => {
    const currStep = stepApiIndex + 1;
    setStepApiIndex(currStep);
    setApisContent((prev) => [
      ...prev,
      {
        id: currStep.toString(),
        content: (
          <CollapsibleApiCard
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
              onChange={(value) => {
                setCurrentProjectId(value as number);
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
