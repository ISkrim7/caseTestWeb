import { HolderOutlined } from '@ant-design/icons';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from 'antd';
import React, { FC, useContext, useMemo } from 'react';

interface ISelfProps {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  dragEndFunc: (data: any[]) => void;
  disabled?: boolean;
}

const RowContext = React.createContext<{
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: any;
}>({});
//const Index: FC<ISelfProps> = (props) => {
//const { items, setItems, dragEndFunc, disabled = false } = props;

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const SortableRow: FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    position: 'relative',
    ...(isDragging ? { zIndex: 9999 } : {}),
  };

  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <div ref={setNodeRef} style={style} {...attributes}>
        {children}
      </div>
    </RowContext.Provider>
  );
};

const MyDraggable: FC<ISelfProps> = ({ items, setItems, dragEndFunc }) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      dragEndFunc(newItems);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DragHandle />
                {item.content}
              </div>
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>

    // return (
    //   // @ts-ignore
    //   <DragDropContext onDragEnd={onDragEnd}>
    //     <Droppable droppableId="droppable" direction="vertical">
    //       {(provided, snapshot) => (
    //         <div
    //           key={`${editorTheme}-${items}`} // 关键修复：添加key强制重新渲染
    //           ref={provided.innerRef}
    //           {...provided.droppableProps}
    //           style={{
    //             background: snapshot.isDraggingOver
    //               ? currentTheme === 'realDark'
    //                 ? '#887b58'
    //                 : '#d5e85d'
    //               : currentTheme === 'realDark'
    //                 ? '#949494'
    //                 : '#f6eee3',
    //             padding: '10px',
    //             borderRadius: '10px',
    //             border: items.length === 0 ? 0 : '1px solid #e0e0e0',
    //             // transition: 'background-color 0.2s ease',
    //             transition: 'background-color 0.3s ease-in-out',
    //           }}
    //         >
    //           {items.map((item, index) => (
    //             <Draggable key={item.id} draggableId={item.id} index={index}>
    //               {(provided) => (
    //                 <div
    //                   key={item.id}
    //                   ref={provided.innerRef}
    //                   {...provided.draggableProps}
    //                   {...provided.dragHandleProps}
    //                   style={{
    //                     ...provided.draggableProps.style,
    //                   }}
    //                 >
    //                   {item.content}
    //                 </div>
    //               )}
    //             </Draggable>
    //           ))}
    //           {provided.placeholder}
    //         </div>
    //       )}
    //     </Droppable>
    //   </DragDropContext>
  );
};

export default Index;
