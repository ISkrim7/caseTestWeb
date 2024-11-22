import DrawerAceEditor from '@/pages/CBS/component/DrawerAceEditor';
import useSocket from '@/pages/CBS/component/useSocket';
import StructureProCard from '@/pages/CBS/Structure/component/StructureProCard';
import Key from '@/pages/CBS/Structure/House/HouseJob/Key';
import Proxy from '@/pages/CBS/Structure/House/HouseJob/Proxy';
import Shoot from '@/pages/CBS/Structure/House/HouseJob/Shoot';

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
        <Key setDrawer={setDrawer} setRoomID={setRoomID} />
        <Proxy setDrawer={setDrawer} setRoomID={setRoomID} />
        <Shoot setDrawer={setDrawer} setRoomID={setRoomID} />
      </StructureProCard>
    </>
  );
};

export default Index;
