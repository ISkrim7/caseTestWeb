import { useModel } from '@@/exports';
import React, { FC } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

interface ISelfProps {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  dragEndFunc: (data: any[]) => void;
  disabled?: boolean;
}

const Index: FC<ISelfProps> = (props) => {
  const { items, setItems, dragEndFunc, disabled = false } = props;

  const { initialState, setInitialState } = useModel('@@initialState');
  const currentTheme = initialState?.theme || 'light'; // 统一使用 theme 拼写
  // 直接使用 currentTheme 决定 UI
  const editorTheme = currentTheme === 'realDark' ? 'twilight' : 'ambiance';
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
  // const DragDropWrapper = disabled ? React.Fragment : DragDropContext;

  return (
    // @ts-ignore
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="vertical">
        {(provided, snapshot) => (
          <div
            key={`${editorTheme}-${items}`} // 关键修复：添加key强制重新渲染
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              background: snapshot.isDraggingOver
                ? currentTheme === 'realDark'
                  ? '#887b58'
                  : '#d5e85d'
                : currentTheme === 'realDark'
                ? '#949494'
                : '#f6eee3',
              padding: '10px',
              borderRadius: '10px',
              border: items.length === 0 ? 0 : '1px solid #e0e0e0',
              // transition: 'background-color 0.2s ease',
              transition: 'background-color 0.3s ease-in-out',
            }}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    key={item.id}
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
