import DrawerAceEditor from '@/pages/CBS/component/DrawerAceEditor';
import useSocket from '@/pages/CBS/component/useSocket';
import Agreement from '@/pages/CBS/Structure/Approve/Agreement';
import Finance from '@/pages/CBS/Structure/Approve/Finance';
import PerfAdJust from '@/pages/CBS/Structure/Approve/Perf/perfAdJust';
import PerfCompany from '@/pages/CBS/Structure/Approve/Perf/perfCompany';
import SignApprove from '@/pages/CBS/Structure/Approve/SignApprove';
import StructureProCard from '@/pages/CBS/Structure/component/StructureProCard';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';

const Index = () => {
  const { setAllLogs, setDrawer, drawer, setRoomID, allLogs } = useSocket();

  return (
    <ProCard style={{ height: '100hv', width: 'auto' }}>
      <DrawerAceEditor
        visible={drawer}
        onClose={() => {
          setDrawer(false);
          setAllLogs([]);
          setRoomID(null);
        }}
        allLogs={allLogs.join('')}
      />
      <Tabs tabPosition={'left'} size={'large'}>
        <Tabs.TabPane key={'1'} tab={'公司平台补业绩'}>
          <StructureProCard>
            <PerfCompany setDrawer={setDrawer} setRoomID={setRoomID} />
          </StructureProCard>
        </Tabs.TabPane>
        <Tabs.TabPane key={'2'} tab={'业绩调整申请单'}>
          <StructureProCard>
            <PerfAdJust setDrawer={setDrawer} setRoomID={setRoomID} />
          </StructureProCard>
        </Tabs.TabPane>

        <Tabs.TabPane key={'3'} tab={'财务审批'}>
          <StructureProCard>
            <Finance setDrawer={setDrawer} setRoomID={setRoomID} />
          </StructureProCard>
        </Tabs.TabPane>

        <Tabs.TabPane key={'4'} tab={'协议审批'}>
          <StructureProCard>
            <Agreement setDrawer={setDrawer} setRoomID={setRoomID} />
          </StructureProCard>
        </Tabs.TabPane>
        <Tabs.TabPane key={'5'} tab={'签约正式合同审批'}>
          <StructureProCard>
            <SignApprove setDrawer={setDrawer} setRoomID={setRoomID} />
          </StructureProCard>
        </Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default Index;
