import MyDraggable from '@/components/MyDraggable';
import CaseStep from '@/pages/CaseHub/CaseStep';
import { ProCard } from '@ant-design/pro-components';
import { useState } from 'react';

const Index = () => {
  const [caseSteps, setCaseSteps] = useState<any[]>([
    {
      id: '1',
      content: <CaseStep />,
    },
    {
      id: '2',
      content: <CaseStep />,
    },
  ]);

  const onDragEnd = (reorderedContents: any[]) => {
    console.log(reorderedContents);

    setCaseSteps(reorderedContents);
  };
  return (
    <ProCard title={'asdasdas'}>
      <MyDraggable
        items={caseSteps}
        setItems={setCaseSteps}
        dragEndFunc={onDragEnd}
      />
    </ProCard>
  );
};

export default Index;
