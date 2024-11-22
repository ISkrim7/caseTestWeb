import StructureProCard from '@/pages/CBS/Structure/component/StructureProCard';
import HZCount from '@/pages/CBS/Structure/Perf/HZCount';
import Inspection from '@/pages/CBS/Structure/Perf/Inspection';
import PerfMaintSetting from '@/pages/CBS/Structure/Perf/PerfMaintSetting';

const Index = () => {
  return (
    <StructureProCard>
      <Inspection />
      <HZCount />
      <PerfMaintSetting />
    </StructureProCard>
  );
};

export default Index;
