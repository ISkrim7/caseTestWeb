import DrawerAceEditor from '@/pages/CBS/component/DrawerAceEditor';
import useSocket from '@/pages/CBS/component/useSocket';
import StructureProCard from '@/pages/CBS/Structure/component/StructureProCard';
import Agreement from '@/pages/CBS/Structure/Sign/SignJob/Agreement';
import Collected from '@/pages/CBS/Structure/Sign/SignJob/Finance/Collected';
import Finance from '@/pages/CBS/Structure/Sign/SignJob/Finance/Finance';

const Index = () => {
  const { setAllLogs, setDrawer, drawer, setRoomID, allLogs } = useSocket();
  return (
    <div>
      <DrawerAceEditor
        visible={drawer}
        onClose={() => {
          setDrawer(false);
          setAllLogs([]);

          setRoomID(null);
        }}
        allLogs={allLogs.join('')}
      />
      <StructureProCard>
        <Finance setDrawer={setDrawer} setRoomID={setRoomID} />
        <Collected setDrawer={setDrawer} setRoomID={setRoomID} />
        <Agreement setDrawer={setDrawer} setRoomID={setRoomID} />
      </StructureProCard>
    </div>
  );
};

export default Index;
