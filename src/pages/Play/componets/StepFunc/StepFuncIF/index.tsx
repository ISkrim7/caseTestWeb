import {
  queryPlayConditionSubSteps,
  removePlayStepCondition,
  reorderPlayStepCondition,
  updatePlayStep,
} from '@/api/play/playCase';
import MyDraggable from '@/components/MyDraggable';
import MyDrawer from '@/components/MyDrawer';
import CollapsibleConditionStepsCard from '@/pages/Play/componets/StepFunc/StepFuncIF/CollapsibleConditionStepsCard';
import {
  IUICaseStepCondition,
  IUICaseSteps,
} from '@/pages/Play/componets/uiTypes';
import PlayStepDetail from '@/pages/Play/PlayStep/PlayStepDetail';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message, Popconfirm, Space, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface Self {
  currentProjectId: number;
  subStepInfo: IUICaseSteps;
  envs?: { label: string; value: number | null }[];
  callback: () => void;
}

const Index: FC<Self> = (props) => {
  const { subStepInfo, callback } = props;
  const [form] = Form.useForm<IUICaseStepCondition>();
  const [openStepDetailDrawer, setOpenStepDetailDrawer] = useState(false);
  const [condition, setCondition] = useState<IUICaseStepCondition>();
  const [currentStep, setCurrentStep] = useState<IUICaseSteps>();
  const [conditionSteps, setConditionSteps] = useState<IUICaseSteps[]>([]);
  const [conditionStepsContent, setConditionStepsContent] = useState<any[]>([]);

  useEffect(() => {
    if (subStepInfo) {
      setCondition(subStepInfo.condition);
      setCurrentStep(subStepInfo);
      form.setFieldsValue(subStepInfo.condition);
    }
  }, [subStepInfo]);

  useEffect(() => {
    if (currentStep && currentStep.condition) {
      queryPlayConditionSubSteps({ stepId: currentStep.id }).then(
        async ({ code, data }) => {
          if (code === 0) {
            setConditionSteps(data);
            setConditionStepsContent(
              data.map((item: IUICaseSteps, index) => ({
                id: index.toString(),
                condition_step_id: item.id,
                content: (
                  <CollapsibleConditionStepsCard
                    step={index + 1}
                    conditionStepInfo={item}
                    callback={callback}
                  />
                ),
              })),
            );
          }
        },
      );
    }
  }, [currentStep]);

  const saveCondition = async () => {
    const values = await form.validateFields();
    const data = {
      condition: values,
      id: subStepInfo.id,
    };
    const { code, msg } = await updatePlayStep(data as IUICaseSteps);
    if (code === 0) {
      message.success(msg);
      callback();
    }
  };

  const removeCondition = async () => {
    const { code, msg } = await removePlayStepCondition({
      stepId: subStepInfo.id,
    });
    if (code === 0) {
      setCondition(undefined);
      form.resetFields();
      message.success(msg);
      callback();
    }
  };

  const onDragEnd = (reorderedUIContents: any[]) => {
    setConditionStepsContent(reorderedUIContents);
    if (subStepInfo) {
      const reorderData = reorderedUIContents.map((item) => item.id);
      reorderPlayStepCondition({ stepIds: reorderData }).then();
    }
  };
  return (
    <ProCard split={'horizontal'}>
      <ProCard
        headerBordered={true}
        subTitle={<span>若条件符合、子步骤将在该父步骤执行完成后依次执行</span>}
        extra={
          <Space>
            <Button onClick={saveCondition} type={'primary'}>
              Save
            </Button>
            <Popconfirm
              title={'确定要添加子步骤吗？'}
              onConfirm={removeCondition}
            >
              <Button>Remove</Button>
            </Popconfirm>
          </Space>
        }
      >
        <ProForm form={form} submitter={false}>
          <ProForm.Group>
            <ProFormText
              addonBefore={<Tag color={'green'}>IF</Tag>}
              name={'key'}
              placeholder={'{{变量名}}'}
              rules={[{ required: true, message: '变量名不能为空 !' }]}
              required={true}
            />
            <ProFormSelect
              noStyle
              initialValue={1}
              name={'operator'}
              required={true}
              rules={[{ required: true, message: '条件不能为空 !' }]}
              options={[
                { label: '==', value: 1 },
                { label: '!=', value: 2 },
              ]}
            />
            <ProFormText
              name={'value'}
              rules={[{ required: true, message: '变量名不能为空 !' }]}
              required={true}
              placeholder={'{{变量名}}'}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard
        extra={
          condition && (
            <Button onClick={() => setOpenStepDetailDrawer(true)}>添加</Button>
          )
        }
      >
        {condition && (
          <MyDraggable
            dragEndFunc={onDragEnd}
            items={conditionStepsContent}
            setItems={setConditionStepsContent}
          />
        )}
      </ProCard>
      <MyDrawer
        width={'auto'}
        name={''}
        open={openStepDetailDrawer}
        setOpen={setOpenStepDetailDrawer}
      >
        <PlayStepDetail
          callBack={() => {
            setOpenStepDetailDrawer(false);
            callback();
          }}
          conditionStepId={subStepInfo.id}
        />
      </MyDrawer>
    </ProCard>
  );
};

export default Index;
