import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const B = ({ index, onFormChange }) => {
  const [f] = Form.useForm();
  return (
    <ProCard>
      <ProForm
        form={f}
        onFinish={() => {
          const data = f.getFieldValue('name');
          onFormChange(index, data);
        }}
      >
        <ProFormText name={'name'} label={'name'} />
      </ProForm>
    </ProCard>
  );
};

const App = () => {
  const [items, setItems] = useState<any[]>([]);
  const [length, setLength] = useState(0); // 使用 useState 管理 length
  // 保存每个表单的值
  const [formData, setFormData] = useState({});

  const onFormChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      [index]: value, // 根据 index 保存每个组件的表单数据
    }));
  };
  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; // 拖拽没有放置，退出

    // 重新排序 items 和 formData
    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index,
    );
    setItems(reorderedItems);

    const reorderedFormData = reorder(
      Object.entries(formData),
      result.source.index,
      result.destination.index,
    );
    const updatedFormData = Object.fromEntries(reorderedFormData);
    setFormData(updatedFormData);
  };

  useEffect(() => {
    const item = {
      id: length,
      content: <B index={length} onFormChange={onFormChange} />,
    };
    setItems([item]);
  }, []);
  const add = () => {
    const newLength = length + 1; // 增加 length
    setLength(newLength); // 更新 length
    setItems((prevState) => [
      ...prevState,
      {
        id: newLength,
        content: <B index={newLength} onFormChange={onFormChange} />,
      },
    ]);
  };
  const get = () => {
    console.log(formData); // 打印所有表单的数据，已按照拖拽顺序更新
  };
  return (
    <>
      <Button onClick={add}>add</Button>
      <Button onClick={get}>get</Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="vertical">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              // style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
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
    </>
  );
};

export default App;
