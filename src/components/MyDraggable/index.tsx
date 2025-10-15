import { useModel } from '@@/exports';
import { HolderOutlined } from '@ant-design/icons';
import { DndContext, useDroppable, type DragEndEvent } from '@dnd-kit/core';
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

const MyDraggable: FC<ISelfProps> = ({
  items,
  setItems,
  dragEndFunc,
  disabled = false,
}) => {
  const { initialState } = useModel('@@initialState');
  const currentTheme = initialState?.theme || 'light';

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: 'droppable',
    disabled,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      dragEndFunc(newItems);
    }
  };

  const getContainerStyle = (): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 10,
    borderRadius: 10,
    border: items.length === 0 ? 'none' : '1px solid #e0e0e0',
    transition: 'background-color 0.3s ease-in-out',
    background: isOver
      ? currentTheme === 'realDark'
        ? '#887b58'
        : '#d5e85d'
      : currentTheme === 'realDark'
      ? '#949494'
      : '#f6eee3',
  });

  if (disabled) {
    return (
      <div style={getContainerStyle()}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {item.content}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={setDroppableRef} style={getContainerStyle()}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DragHandle />
                {item.content}
              </div>
            </SortableRow>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default MyDraggable;
