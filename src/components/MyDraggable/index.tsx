import React, { FC } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

interface ISelfProps {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  dragEndFunc: (data: any[]) => void;
}

const Index: FC<ISelfProps> = (props) => {
  const { items, setItems, dragEndFunc } = props;

  const onDragEnd = (result: any) => {
    if (!result.destination) return; // 拖拽没有放置，退出
    // 重新排序 items 和 formData
    const reorderedUIContents = reorder(
      items,
      result.source.index,
      result.destination.index,
    );
    setItems(reorderedUIContents);
    dragEndFunc(reorderedUIContents);
  };

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="vertical">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              background: snapshot.isDraggingOver ? '#f4f5f7' : '#fff',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              transition: 'background-color 0.2s ease',
            }}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                    }}
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
  );
};

export default Index;
