import {
  addStepCondition,
  orderSubSteps,
  querySubSteps,
} from '@/api/play/step';
import MyDrawer from '@/components/MyDrawer';
import AddStep from '@/pages/Play/componets/AddStep';
import CollapsibleSubStepCard from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard/StepFunc/StepIF/CollapsibleSubStepCard';
import {
  IUICaseStepCondition,
  IUICaseSteps,
  IUICaseSubStep,
} from '@/pages/UIPlaywright/uiTypes';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

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

  const refrash = () => {
    setEdit(edit + 1);
  };
  useEffect(() => {
    if (uiStepInfo) {
      form.setFieldsValue(uiStepInfo.condition);
      querySubSteps({ stepId: uiStepInfo.id }).then(async ({ code, data }) => {
        if (code === 0) {
          setSubSteps(data);
        }
      });
    } else {
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

  const onDragEnd = (result: any) => {
    if (!result.destination) return; // 拖拽没有放置，退出
    // 重新排序 items 和 formData
    const reorderedUIContents = reorder(
      ifStepsContent,
      result.source.index,
      result.destination.index,
    );
    setIfStepsContent(reorderedUIContents);
    if (uiStepInfo) {
      const reorderData = reorderedUIContents.map((item) => item.sub_id);
      console.log('====', reorderData);
      orderSubSteps({ stepId: uiStepInfo.id, subIds: reorderData }).then();
    }
  };
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const saveConditionThenOpenAddSubStep = async () => {
    const values = await form.validateFields();
    if (uiStepInfo?.id) {
      const { code } = await addStepCondition({
        ...values,
        stepId: uiStepInfo.id,
      });
      if (code === 0) {
        setOpenAddSubStepDrawer(true);
      }
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
            // callBackFunc();
          }}
        />
      </MyDrawer>
      <ProCard
        headerBordered={true}
        title={'IF'}
        subTitle={<span>若条件符合、子步骤将在该父步骤执行完成后依次执行</span>}
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
          <Button type={'primary'} onClick={saveConditionThenOpenAddSubStep}>
            add sub step
          </Button>
        }
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                }}
              >
                {ifStepsContent.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ProCard>
    </ProCard>
  );
};

export default Index;
