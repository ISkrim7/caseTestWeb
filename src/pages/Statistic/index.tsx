import StructureProCard from '@/pages/CBS/Structure/component/StructureProCard';
import DayStatistic from '@/pages/Statistic/DayStatistic';
import MonthStatistic from '@/pages/Statistic/MonthStatistic';
import YearStatistic from '@/pages/Statistic/YearStatistic';

const Index = () => {
  return (
    <div>
      <StructureProCard>
        <DayStatistic />
        <MonthStatistic />
        <YearStatistic />
      </StructureProCard>
    </div>
  );
};

export default Index;
