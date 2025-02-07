import {
  addStepCondition,
  orderSubSteps,
  querySubSteps,
  removeStepCondition,
  updateStepCondition,
} from '@/api/play/step';
import MyDraggable from '@/components/MyDraggable';
import MyDrawer from '@/components/MyDrawer';
import AddStep from '@/pages/Play/componets/AddStep';
import {
  IUICaseStepCondition,
  IUICaseSteps,
  IUICaseSubStep,
} from '@/pages/Play/componets/uiTypes';
import CollapsibleSubStepCard from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard/StepFunc/StepIF/CollapsibleSubStepCard';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, Popconfirm, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface ISelfProps {
  uiStepInfo?: IUICaseSteps;
  callBackFunc: () => void;
}

const Index: FC<ISelfProps> = ({ uiStepInfo, callBackFunc }) => {
  const [form] = Form.useForm<IUICaseStepCondition>();
  const [ifStepsContent, setIfStepsContent] = useState<any[]>([]);
  const [openAddSubStepDrawer, setOpenAddSubStepDrawer] = useState(false);
  const [subSteps, setSubSteps] = useState<IUICaseSubStep[]>([]);
  const [edit, setEdit] = useState(0);
  // 1详情 2新增 3 修改
  const [mode, setMode] = useState(1);
  const refrash = () => {
    setEdit(edit + 1);
  };

  useEffect(() => {
    if (uiStepInfo) {
      //详情模式
      if (uiStepInfo.condition) {
        setMode(1);
        form.setFieldsValue(uiStepInfo.condition);
        querySubSteps({ stepId: uiStepInfo.id }).then(
          async ({ code, data }) => {
            if (code === 0) {
              setSubSteps(data);
            }
          },
        );
      } else {
        //空
        setMode(2);
      }
    }
  }, [uiStepInfo, edit]);

  useEffect(() => {
    if (subSteps) {
      setIfStepsContent(
        subSteps.map((item, index) => ({
          id: index.toString(),
          sub_id: item.id,
          content: <CollapsibleSubStepCard subStep={item} />,
        })),
      );
    }
  }, [subSteps]);

  const onDragEnd = (reorderedUIContents: any[]) => {
    setIfStepsContent(reorderedUIContents);
    if (uiStepInfo) {
      const reorderData = reorderedUIContents.map((item) => item.sub_id);
      orderSubSteps({ stepId: uiStepInfo.id, subIds: reorderData }).then();
    }
  };

  const saveConditionThenOpenAddSubStep = async () => {
    const values = await form.validateFields();
    if (uiStepInfo?.id) {
      const { code } = await addStepCondition({
        ...values,
        stepId: uiStepInfo.id,
      });
      if (code === 0) {
        setMode(1);
      }
    }
  };

  const updateCondition = async () => {
    const values = await form.validateFields();
    if (values && uiStepInfo?.id) {
      const { code } = await updateStepCondition({
        ...values,
        stepId: uiStepInfo?.id,
      });
      if (code === 0) {
        setMode(1);
        callBackFunc();
        refrash();
      }
    }
  };
  const ButtonExtra: FC<{ currentMode: number }> = ({ currentMode }) => {
    switch (currentMode) {
      case 1:
        return (
          <>
            <Button
              type={'primary'}
              style={{ marginLeft: 10 }}
              onClick={() => setMode(3)}
            >
              Edit
            </Button>
            <Popconfirm
              title={'确认删除？子步骤将全部删除'}
              okText={'确认'}
              cancelText={'点错了'}
              onConfirm={async () => {
                if (uiStepInfo?.id) {
                  const { code } = await removeStepCondition({
                    stepId: uiStepInfo?.id,
                  });
                  if (code === 0) {
                    form.resetFields();
                    setMode(2);
                    refrash();
                    callBackFunc();
                  }
                }
              }}
            >
              <Button type={'primary'} style={{ marginLeft: 20 }}>
                Remove{' '}
              </Button>
            </Popconfirm>
          </>
        );
      case 2:
        return (
          <Button onClick={saveConditionThenOpenAddSubStep} type={'primary'}>
            Save
          </Button>
        );
      case 3:
        return (
          <>
            <Button onClick={updateCondition} type={'primary'}>
              Save
            </Button>
            <Button style={{ marginLeft: 5 }} onClick={() => setMode(1)}>
              Cancel
            </Button>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <ProCard split={'horizontal'}>
      <MyDrawer
        name={'Add Sub Step'}
        width={'auto'}
        open={openAddSubStepDrawer}
        setOpen={setOpenAddSubStepDrawer}
      >
        <AddStep
          stepId={uiStepInfo?.id}
          func={() => {
            setOpenAddSubStepDrawer(false);
            refrash();
            callBackFunc();
          }}
        />
      </MyDrawer>
      <ProCard
        headerBordered={true}
        title={'IF'}
        subTitle={<span>若条件符合、子步骤将在该父步骤执行完成后依次执行</span>}
        extra={<ButtonExtra currentMode={mode} />}
      >
        <ProForm form={form} disabled={mode === 1} submitter={false}>
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
              rules={[{ required: true, message: '对比不能为空 !' }]}
              required={true}
              placeholder={'{{变量名}}'}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard
        title={<Tag color={'green'}> Execute ({subSteps.length})</Tag>}
        extra={
          <>
            {mode === 1 && (
              <Button
                type={'primary'}
                onClick={() => {
                  setOpenAddSubStepDrawer(true);
                }}
              >
                add sub step
              </Button>
            )}
          </>
        }
      >
        <MyDraggable
          dragEndFunc={onDragEnd}
          items={ifStepsContent}
          setItems={setIfStepsContent}
        />
      </ProCard>
    </ProCard>
  );
};

export default Index;
