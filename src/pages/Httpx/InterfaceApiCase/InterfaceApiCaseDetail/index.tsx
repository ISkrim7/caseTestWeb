import { IModuleEnum } from '@/api';
import {
  baseInfoApiCase,
  insertApiCase,
  queryApisByCaseId,
  reorderApis2Case,
  runApiCaseBack,
  setApiCase,
} from '@/api/inter/interCase';
import MyDraggable from '@/components/MyDraggable';
import MyDrawer from '@/components/MyDrawer';
import GroupApiChoiceTable from '@/pages/Httpx/Interface/interfaceApiGroup/GroupApiChoiceTable';
import CollapsibleApiCard from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/CollapsibleApiCard';
import InterfaceApiCaseVars from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/InterfaceApiCaseVars';
import InterfaceApiCaseResultDrawer from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultDrawer';
import InterfaceApiCaseResultTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultTable';
import InterfaceCaseChoiceApiTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceCaseChoiceApiTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useModel, useParams } from '@@/exports';
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
  Empty,
  FloatButton,
  Form,
  MenuProps,
  message,
  Tabs,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { history } from 'umi';

const Index = () => {
  const { caseApiId } = useParams<{ caseApiId: string }>();
  const { API_LEVEL_SELECT, API_STATUS_SELECT, API_CASE_ERROR_STOP_OPT } =
    CONFIG;
  const [baseForm] = Form.useForm();
  const topRef = useRef<HTMLElement>(null);
  const [apis, setApis] = useState<any[]>([]);
  const [step, setStep] = useState<number>(0);
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [currentStatus, setCurrentStatus] = useState(1);
  const [queryApis, setQueryApis] = useState<IInterfaceAPI[]>([]);
  const [editCase, setEditCase] = useState<number>(0);
  const [runOpen, setRunOpen] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [choiceGroupOpen, setChoiceGroupOpen] = useState(false);
  const [addButtonDisabled, setAddButtonDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (caseApiId) {
      baseInfoApiCase(caseApiId).then(({ code, data }) => {
        if (code === 0) {
          baseForm.setFieldsValue(data);
          setCurrentProjectId(data.project_id);
          setCurrentModuleId(data.module_id);
        }
      });

      queryApisByCaseId(caseApiId).then(({ code, data }) => {
        if (code === 0) {
          setQueryApis(data);
        }
      });
    } else {
      setCurrentStatus(2);
    }
  }, [editCase]);

  useEffect(() => {
    if (currentProjectId) {
      fetchModulesEnum(
        currentProjectId,
        ModuleEnum.API_CASE,
        setModuleEnum,
      ).then();
    }
  }, [currentProjectId]);

  useEffect(() => {
    if (queryApis) {
      setStep(queryApis.length);
      const init = queryApis.map((item, index) => ({
        id: (index + 1).toString(),
        api_Id: item.id,
        content: (
          <CollapsibleApiCard
            step={index + 1}
            collapsible={true}
            refresh={refresh}
            interfaceApiInfo={item}
            caseApiId={caseApiId}
            moduleId={currentModuleId}
            projectId={currentProjectId}
          />
        ),
      }));
      setApis(init);
    }
  }, [queryApis]);

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
        <GroupApiChoiceTable refresh={refresh} currentCaseId={caseApiId!} />
      </MyDrawer>
      <MyDrawer name={''} open={choiceOpen} setOpen={setChoiceOpen}>
        <InterfaceCaseChoiceApiTable
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
          <ProForm.Group>
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
          </ProForm.Group>
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
            <ProFormTextArea
              width={'md'}
              name="desc"
              label="用例描述"
              required={true}
              rules={[{ required: true, message: '用例描述必填' }]}
            />
            <ProFormSelect
              width={'md'}
              name="error_stop"
              label="错误停止"
              initialValue={0}
              required={true}
              options={API_CASE_ERROR_STOP_OPT}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard extra={<ApisCardExtra current={currentStatus} />}>
        <Tabs
          defaultActiveKey={'2'}
          defaultValue={'2'}
          size={'large'}
          type={'card'}
        >
          <Tabs.TabPane key={'1'} tab={'Vars'}>
            <InterfaceApiCaseVars currentCaseId={caseApiId} />
          </Tabs.TabPane>
          <Tabs.TabPane key={'2'} tab={`API (${apis.length})`}>
            {apis.length === 0 ? (
              <Empty />
            ) : (
              <MyDraggable
                items={apis}
                setItems={setApis}
                dragEndFunc={onDragEnd}
              />
            )}
          </Tabs.TabPane>
        </Tabs>
      </ProCard>
      {caseApiId ? <InterfaceApiCaseResultTable apiCaseId={caseApiId} /> : null}
      <FloatButton.BackTop />
    </ProCard>
  );
};

export default Index;
