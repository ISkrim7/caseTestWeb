import { IModuleEnum } from '@/api';
import {
  playStepDetailById,
  queryPlayGroupSubSteps,
  reOrderSubSteps,
  updatePlayStep,
} from '@/api/play/playCase';
import { queryEnvByProjectIdFormApi } from '@/components/CommonFunc';
import MyDraggable from '@/components/MyDraggable';
import MyDrawer from '@/components/MyDrawer';
import { IUICaseSteps, IUIStepGroup } from '@/pages/Play/componets/uiTypes';
import PlayStepDetail from '@/pages/Play/PlayStep/PlayStepDetail';
import PlayStepGroupCollapsible from '@/pages/Play/PlayStep/PlayStepGroup/PlayStepGroupCollapsible';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum } from '@/utils/somefunc';
import { useModel, useParams } from '@@/exports';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, Empty, Form, message } from 'antd';
import { useEffect, useState } from 'react';

const PlayStepGroupDetail = () => {
  // aka step id
  const { groupId } = useParams<{ groupId: string }>();
  const [form] = Form.useForm<IUIStepGroup>();
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const [currentModuleId, setCurrentModuleId] = useState<number>();
  const [subSteps, setSubSteps] = useState<IUICaseSteps[]>([]);
  const [subStepsContent, setSubStepsContent] = useState<any[]>([]);
  const [openAddSubStep, setOpenAddSubStep] = useState(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [envs, setEnvs] = useState<{ label: string; value: number | null }[]>(
    [],
  );

  /**
   * 根据项目
   * 查询所有环境
   * 模块枚举
   */
  useEffect(() => {
    if (currentProjectId) {
      Promise.all([
        queryEnvByProjectIdFormApi(currentProjectId, setEnvs, true),
        fetchModulesEnum(currentProjectId, ModuleEnum.UI_STEP, setModuleEnum),
      ]).then();
    }
  }, [currentProjectId]);

  /**
   * 通过组ID
   * 查询组下的所有子步骤
   * 查询组信息
   */
  useEffect(() => {
    if (groupId) {
      Promise.all([
        playStepDetailById(groupId),
        queryPlayGroupSubSteps(parseInt(groupId)),
      ]).then(async ([detail, steps]) => {
        if (detail.code === 0) {
          const { data } = detail;
          setCurrentProjectId(data.project_id);
          setCurrentModuleId(data.module_id);
          form.setFieldsValue(data);
        }
        if (steps.code === 0) {
          setSubSteps(steps.data);
        }
      });
    }
  }, [groupId, refresh]);

  useEffect(() => {
    if (subSteps && subSteps.length > 0) {
      setSubStepsContent(
        subSteps.map((item, index) => ({
          id: (index + 1).toString(),
          step_id: item.id,
          content: (
            <PlayStepGroupCollapsible
              envs={envs}
              step={index + 1}
              currentProjectId={currentProjectId}
              subStepInfo={item}
              callBackFunc={handelRefresh}
              groupId={parseInt(groupId!)}
              collapsible={true}
            />
          ),
        })),
      );
    }
  }, [subSteps, refresh, envs]);

  const handelRefresh = async () => {
    setRefresh(refresh + 1);
    setOpenAddSubStep(false);
  };
  const onDragEnd = async (reorderedUIContents: any[]) => {
    if (groupId) {
      const reorderData = reorderedUIContents.map((item) => item.step_id);
      reOrderSubSteps({
        groupId: parseInt(groupId),
        stepIdList: reorderData,
      }).then(async () => {
        await handelRefresh();
      });
    }
  };

  const CardExtra = (
    <>
      {groupId && (
        <Button
          onClick={() => {
            setOpenAddSubStep(true);
          }}
          type="primary"
        >
          Add Sub Step
        </Button>
      )}
    </>
  );

  const BaseCardExtra = (
    <>
      {groupId && (
        <Button
          onClick={async () => {
            try {
              const values = await form.validateFields();
              values.id = parseInt(groupId);
              // @ts-ignore
              const { code, msg } = await updatePlayStep(values);
              if (code === 0) {
                message.success(msg);
                await handelRefresh();
              }
            } catch (e) {
              return;
            }
          }}
          type="primary"
        >
          Save
        </Button>
      )}
    </>
  );
  return (
    <ProCard split={'horizontal'}>
      <MyDrawer
        name={'Step'}
        width={'auto'}
        open={openAddSubStep}
        setOpen={setOpenAddSubStep}
      >
        <PlayStepDetail
          callBack={handelRefresh}
          caseModuleId={currentModuleId}
          caseProjectId={currentProjectId}
          groupId={parseInt(groupId!)}
        />
      </MyDrawer>
      <ProCard extra={BaseCardExtra}>
        <ProForm form={form} submitter={false}>
          <ProForm.Group>
            <ProFormSelect
              required
              options={projects}
              name="project_id"
              label="所属项目"
              width="md"
              rules={[{ required: true, message: '所属项目必选' }]}
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
              required
              width="md"
              name="name"
              label="组名"
              placeholder="Please enter a name"
              rules={[{ required: true, message: '请输入组名' }]}
            />

            <ProFormTextArea
              label="描述"
              required
              width="md"
              name="description"
              rules={[{ required: true, message: '请输入描述' }]}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard extra={CardExtra}>
        {subSteps.length > 0 ? (
          <MyDraggable
            items={subStepsContent}
            setItems={setSubStepsContent}
            dragEndFunc={onDragEnd}
          />
        ) : (
          <Empty description={'暂无子步骤'} />
        )}
      </ProCard>
    </ProCard>
  );
};

export default PlayStepGroupDetail;
