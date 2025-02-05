import LeftPart from '@/components/LeftPart';
import PlayTaskTable from '@/pages/Play/PlayTask/PlayTaskTable';
import { ProCard } from '@ant-design/pro-components';
import { Splitter } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PerKey = 'PlayTask';
  return (
    <ProCard
      bordered={true}
      style={{ height: '100vh' }}
      bodyStyle={{ height: 'auto', padding: 0 }}
    >
      <Splitter>
        <Splitter.Panel
          collapsible={true}
          defaultSize="20%"
          min="10%"
          max="30%"
          style={{ height: '100vh' }}
        >
          <LeftPart
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentCasePartId={setCurrentCasePartId}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          <PlayTaskTable
            perKey={PerKey}
            currentProjectId={currentProjectId}
            currentPartId={currentCasePartId}
          />
        </Splitter.Panel>
      </Splitter>
    </ProCard>
  );
};

export default Index;
