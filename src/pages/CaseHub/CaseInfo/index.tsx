import DnDDraggable from '@/components/DnDDraggable';
import CaseStep from '@/pages/CaseHub/CaseStep';
import { ProCard } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';

const Index = () => {
  const [caseSteps, setCaseSteps] = useState<any[]>([
    {
      id: '1',
      caseStepId: 1,
      content: <CaseStep />,
    },
  ]);

  useEffect(() => {
    if (caseSteps) {
      const reorderData = caseSteps.map((item) => item.caseStepId);
      console.log(reorderData);
    }
  }, [caseSteps]);

  return (
    <ProCard title={'caseInfo'}>
      <DnDDraggable items={caseSteps} setItems={setCaseSteps} />
    </ProCard>
  );
};

export default Index;
