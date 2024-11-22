import DrawerAceEditor from '@/pages/CBS/component/DrawerAceEditor';
import useSocket from '@/pages/CBS/component/useSocket';
import StructureProCard from '@/pages/CBS/Structure/component/StructureProCard';
import Building from '@/pages/CBS/Structure/House/Building';
import InsertHouse from '@/pages/CBS/Structure/House/InsertHouse';

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
        <InsertHouse setRoomID={setRoomID} setDrawer={setDrawer} />
        <Building setRoomID={setRoomID} setDrawer={setDrawer} />
      </StructureProCard>
    </>
  );
};

export default Index;
