import React from 'react';

export interface DraggableItem {
  id: number;
  content: React.ReactNode;
  // 如果确定不需要其他属性，可以这样写
  [key: string]: any; // 禁止其他属性
}
