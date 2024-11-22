import { ICasePart } from '@/api';
import { caseCountByProjectId, queryRootCasePartByProjectId } from '@/api/aps';
import TitleName from '@/components/TitleName';
import { StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { FC, useEffect, useState } from 'react';

const { Divider, Statistic } = StatisticCard;

interface SelfProps {
  projectId: number;
}

interface IPartCaseCount {
  total: number;
  data: {
    partName: string;
    caseCount: number;
  }[];
}

const CaseTotal: FC<SelfProps> = ({ projectId }) => {
  const [responsive, setResponsive] = useState(false);
  const [partCaseCount, setPartCaseCount] = useState<IPartCaseCount>();
  const [parts, setParts] = useState<ICasePart[]>([]);

  useEffect(() => {
    if (projectId) {
      queryRootCasePartByProjectId({ projectId: projectId }).then(
        ({ code, data }) => {
          if (code === 0) {
            setParts(data);
          }
        },
      );

      caseCountByProjectId({ projectId: projectId }).then(({ code, data }) => {
        if (code === 0) {
          setPartCaseCount(data);
        }
      });
    }
  }, [projectId]);
  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      {/*// @ts-ignore*/}
      <StatisticCard.Group
        onScroll={{ x: 500 }}
        title={TitleName('模块用例统计')}
      >
        {partCaseCount?.data.map((item) => (
          <StatisticCard
            statistic={{
              title: <h2>{item.partName}</h2>,
              value: item.caseCount,
              valueStyle: { color: 'green' },
            }}
          />
        ))}
        <Divider />
        <StatisticCard
          prefix={'right'}
          statistic={{
            title: <h2>{'总计'}</h2>,
            value: partCaseCount?.total,
            valueStyle: { color: 'yellowgreen' },
          }}
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  );
};

export default CaseTotal;
