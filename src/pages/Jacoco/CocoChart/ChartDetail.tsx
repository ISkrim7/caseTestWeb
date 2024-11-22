import { IChart } from '@/pages/Jacoco/CocoChart/IChart';
import {
  ProCard,
  ProDescriptions,
  StatisticCard,
} from '@ant-design/pro-components';
import { FC } from 'react';

interface SelfProps {
  currentChart?: IChart;
}

const ChartDetail: FC<SelfProps> = ({ currentChart }) => {
  const coverageColor = (coverage?: string) => {
    if (coverage && parseFloat(coverage) > 40) {
      return '#52c41a'; // 绿色
    } else {
      return '#ff4d4f'; // 红色
    }
  };

  return (
    <>
      <ProCard split={'horizontal'}>
        <ProCard bordered={true} size={'small'}>
          <StatisticCard
            size={'small'}
            title="类"
            statistic={{
              value: currentChart?.class_coverage,
              valueStyle: {
                color: coverageColor(currentChart?.class_coverage),
              },
              description: (
                <>
                  <ProDescriptions layout={'horizontal'}>
                    <ProDescriptions.Item label="总数">
                      {currentChart?.classes}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="已覆盖">
                      {currentChart?.class_covered}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="未覆盖">
                      {currentChart?.class_missed}
                    </ProDescriptions.Item>
                  </ProDescriptions>
                </>
              ),
            }}
          />
          <StatisticCard
            title="圈复杂度"
            size={'small'}
            statistic={{
              value: currentChart?.cxty_coverage,
              valueStyle: { color: coverageColor(currentChart?.cxty_coverage) },
              description: (
                <>
                  <ProDescriptions layout={'horizontal'}>
                    <ProDescriptions.Item label="总数">
                      {currentChart?.cxty}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="已覆盖">
                      {currentChart?.cxty_covered}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="未覆盖">
                      {currentChart?.cxty_missed}
                    </ProDescriptions.Item>
                  </ProDescriptions>
                </>
              ),
            }}
          />
          <StatisticCard
            title="方法"
            size={'small'}
            statistic={{
              value: currentChart?.method_coverage,
              valueStyle: {
                color: coverageColor(currentChart?.method_coverage),
              },
              description: (
                <>
                  <ProDescriptions layout={'horizontal'}>
                    <ProDescriptions.Item label="总数">
                      {currentChart?.methods}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="已覆盖">
                      {currentChart?.method_covered}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="未覆盖">
                      {currentChart?.method_missed}
                    </ProDescriptions.Item>
                  </ProDescriptions>
                </>
              ),
            }}
          />
        </ProCard>
        <ProCard bordered={true} size={'small'}>
          <StatisticCard
            title="字节指令"
            size={'small'}
            statistic={{
              value: currentChart?.instruction_coverage,
              valueStyle: {
                color: coverageColor(currentChart?.instruction_coverage),
              },
              description: (
                <>
                  <ProDescriptions layout={'horizontal'}>
                    <ProDescriptions.Item label="总数">
                      {currentChart?.instructions}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="已覆盖">
                      {currentChart?.instruction_covered}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="未覆盖">
                      {currentChart?.instruction_missed}
                    </ProDescriptions.Item>
                  </ProDescriptions>
                </>
              ),
            }}
          />
          <StatisticCard
            title="代码行"
            size={'small'}
            statistic={{
              value: currentChart?.line_coverage,
              valueStyle: { color: coverageColor(currentChart?.line_coverage) },
              description: (
                <>
                  <ProDescriptions layout={'horizontal'}>
                    <ProDescriptions.Item label="总数">
                      {currentChart?.lines}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="已覆盖">
                      {currentChart?.line_covered}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="未覆盖">
                      {currentChart?.line_missed}
                    </ProDescriptions.Item>
                  </ProDescriptions>
                </>
              ),
            }}
          />
          <StatisticCard
            title="分支"
            size={'small'}
            statistic={{
              value: currentChart?.branch_coverage,
              valueStyle: {
                color: coverageColor(currentChart?.branch_coverage),
              },
              description: (
                <>
                  <ProDescriptions layout={'horizontal'}>
                    <ProDescriptions.Item label="总数">
                      {currentChart?.branches}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="已覆盖">
                      {currentChart?.branch_covered}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="未覆盖">
                      {currentChart?.branch_missed}
                    </ProDescriptions.Item>
                  </ProDescriptions>
                </>
              ),
            }}
          />
        </ProCard>
      </ProCard>
    </>
  );
};

export default ChartDetail;
