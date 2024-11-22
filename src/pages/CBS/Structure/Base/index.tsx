import Modify from '@/pages/CBS/Structure/Base/Modify';
import UserLeave from '@/pages/CBS/Structure/Base/UserLeave';
import UserWhite from '@/pages/CBS/Structure/Base/UserWhite';
import StructureProCard from '@/pages/CBS/Structure/component/StructureProCard';

const Index = () => {
  return (
    <StructureProCard>
      <Modify />
      <UserLeave />
      <UserWhite />
    </StructureProCard>
  );
};

export default Index;
