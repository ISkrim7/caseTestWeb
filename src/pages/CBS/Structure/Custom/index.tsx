import DrawerAceEditor from '@/pages/CBS/component/DrawerAceEditor';
import useSocket from '@/pages/CBS/component/useSocket';
import StructureProCard from '@/pages/CBS/Structure/component/StructureProCard';
import CustomProxy from '@/pages/CBS/Structure/Custom/CustomJob/customProxy';
import InsertCustom from '@/pages/CBS/Structure/Custom/InsertCustom';

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
        <InsertCustom setDrawer={setDrawer} setRoomID={setRoomID} />
        <CustomProxy setDrawer={setDrawer} setRoomID={setRoomID} />
      </StructureProCard>
    </>
  );
};

export default Index;
