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
}

const RowContext = React.createContext<{
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: any;
}>({});

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
  );
};

export default MyDraggable;
