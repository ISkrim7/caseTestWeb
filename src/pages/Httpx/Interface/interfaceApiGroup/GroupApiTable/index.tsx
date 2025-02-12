import { ActionType } from '@ant-design/pro-components';
import { FC, useRef } from 'react';

interface SelfProps {
  currentProjectId?: number;
  currentPartId?: number;
  perKey: string;
}
const Index: FC<SelfProps> = ({ currentPartId, currentProjectId, perKey }) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  return <div></div>;
};

export default Index;
