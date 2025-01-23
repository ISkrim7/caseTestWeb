import MyDrawer from '@/components/MyDrawer';
import AddStep from '@/pages/Play/componets/AddStep';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

interface ISelfProps {
  stepId?: number;
  callBackFunc: () => void;
}

const Index: FC<ISelfProps> = ({ stepId, callBackFunc }) => {
  const [ifStepsContent, setIfStepsContent] = useState<any[]>([]);
  const [openAddSubStepDrawer, setOpenAddSubStepDrawer] = useState(false);

  useEffect(() => {
    if (stepId) {
      //set  ifcontent
    } else {
    }
  }, [stepId]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return; // 拖拽没有放置，退出
    // 重新排序 items 和 formData
    const reorderedUIContents = reorder(
      ifStepsContent,
      result.source.index,
      result.destination.index,
    );
    setIfStepsContent(reorderedUIContents);
    if (stepId) {
      const reorderData = reorderedUIContents.map((item) => item.step_id);
      console.log('====', reorderData);
    }
  };
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
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
          func={() => {
            callBackFunc();
          }}
        />
      </MyDrawer>
      <ProCard>
        <ProForm submitter={false}>
          <ProForm.Group>
            <ProFormText
              width={'md'}
              addonBefore={<Tag color={'green'}>IF</Tag>}
              name={'key'}
              placeholder={'{{变量名}}'}
            />
            <ProFormSelect
              width={'sm'}
              noStyle
              initialValue={1}
              name={'operator'}
              options={[
                { label: '==', value: 1 },
                { label: '!=', value: 2 },
              ]}
            />
            <ProFormText
              name={'value'}
              width={'md'}
              placeholder={'{{变量名}}'}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <ProCard
        extra={
          <Button
            type={'primary'}
            onClick={() => setOpenAddSubStepDrawer(true)}
          >
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
