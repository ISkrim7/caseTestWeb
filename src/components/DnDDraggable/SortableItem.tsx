import { useModel } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface SortableItemProps {
  id: number;
  children: React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentTheme = initialState?.theme || 'light';

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition || 'transform 250ms ease', // 拖拽时禁用过渡，避免闪烁
    opacity: 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    borderRadius: 8,
    zIndex: isDragging ? 9999 : 1, // 确保所有元素都有基础z-index
    boxShadow: isDragging ? '0 8px 24px rgba(0, 0, 0, 0.2)' : 'none',
    border: isDragging ? '2px solid #1890ff' : '1px solid #f0f0f0',
    backgroundColor: isDragging
      ? currentTheme === ('dark' as any)
        ? '#1f1f1f'
        : '#ffffff'
      : 'transparent',
    position: 'relative',
    margin: isDragging ? '4px 0' : '2px 0', // 减少拖拽时的间距
    transformOrigin: 'center center',
    willChange: 'transform', // 优化性能
    backfaceVisibility: 'hidden',
    height: 'auto',
    minHeight: '40px',
    width: '100%', // 确保宽度一致
    pointerEvents: 'auto', // 确保可以接收事件
  };

  return (
    <ProCard bodyStyle={{ padding: 4 }}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    </ProCard>
  );
};
