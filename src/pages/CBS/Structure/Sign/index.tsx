import DrawerAceEditor from '@/pages/CBS/component/DrawerAceEditor';
import useSocket from '@/pages/CBS/component/useSocket';
import StructureProCard from '@/pages/CBS/Structure/component/StructureProCard';
import Buy from '@/pages/CBS/Structure/Sign/Buy';
import Lease from '@/pages/CBS/Structure/Sign/Lease';
import Ltc from '@/pages/CBS/Structure/Sign/Ltc';

const Index = () => {
  const { setAllLogs, setDrawer, drawer, setRoomID, allLogs } = useSocket();
  return (
    <>
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
        <Buy setRoomID={setRoomID} setDrawer={setDrawer} />
        <Lease setRoomID={setRoomID} setDrawer={setDrawer} />
        <Ltc setRoomID={setRoomID} setDrawer={setDrawer} />
      </StructureProCard>
    </>
  );
};

export default Index;
