import LeftPart from '@/components/LeftPart';
import GroupApiTable from '@/pages/Httpx/Interface/interfaceApiGroup/GroupApiTable';
import InterfaceApiTable from '@/pages/Httpx/Interface/InterfaceApiTable';
import InterfaceApiTableNoPart from '@/pages/Httpx/Interface/InterfaceApiTableNoPart';
import InterfaceApiUpload from '@/pages/Httpx/Interface/InterfaceApiUpload';
import { ProCard } from '@ant-design/pro-components';
import { Splitter } from 'antd';
import { useState } from 'react';

const Index = () => {
  const [currentCasePartId, setCurrentCasePartId] = useState<number>();
  const [currentProjectId, setCurrentProjectId] = useState<number>();
  const PerKey = 'InterfaceApi';
  const PerKeyNoPart = 'InterfaceApiNoPart';
  const PerGroupKey = 'InterfaceGroupApi';

  return (
    <ProCard
      bordered={true}
      style={{ height: 'auto' }}
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
            perKey={PerKey}
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            setCurrentCasePartId={setCurrentCasePartId}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          <ProCard
            bodyStyle={{ padding: 0 }}
            tabs={{
              type: 'card',
            }}
          >
            <ProCard.TabPane key="api" tab="Common API">
              <InterfaceApiTable
                currentProjectId={currentProjectId}
                currentPartId={currentCasePartId}
                perKey={PerKey}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="case" tab="Group APIs">
              <GroupApiTable
                currentProjectId={currentProjectId}
                currentPartId={currentCasePartId}
                perKey={PerGroupKey}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="not_part_api" tab="No Part APIs">
              <InterfaceApiTableNoPart
                currentProjectId={currentProjectId}
                perKey={PerKeyNoPart}
              />
            </ProCard.TabPane>
            <ProCard.TabPane key="upload" tab="Upload API">
              <InterfaceApiUpload />
            </ProCard.TabPane>
          </ProCard>
        </Splitter.Panel>
      </Splitter>
    </ProCard>
  );
};

export default Index;
