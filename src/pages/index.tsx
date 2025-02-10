import { IProject } from '@/api';
import { queryProject } from '@/api/base';
import { fetchWeekData } from '@/api/base/statistics';
import { useModel } from '@@/exports';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { useEffect, useState } from 'react';
const { Statistic } = StatisticCard;

interface IStatisticsWeek {
  apis: number;
  api_task: number;
  api_task_growth: number;
  apis_growth: number;
  uis: number;
  uis_growth: number;
  ui_task_growth: number;
}

export default function IndexPage() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [projectList, setProjectList] = useState<IProject[]>([]);
  const [weekData, setWeekData] = useState<IStatisticsWeek>([]);
  const [responsive, setResponsive] = useState(false);

  useEffect(() => {
    queryProject().then(({ code, data }) => {
      if (code === 0) {
        setProjectList([...data, ...data]);
      }
    });
    fetchWeekData().then(({ code, data }) => {
      if (code === 0) {
        setWeekData(data);
      }
    });
  }, []);

  return (
    <ProCard split={'horizontal'}>
      <ProCard>
        <h1>welcome {initialState?.currentUser?.username}</h1>
      </ProCard>
      <ProCard split={'vertical'}>
        {projectList.map((item) => {
          return (
            <StatisticCard
              statistic={{
                title: item.title,
                value: 1,
                icon: (
                  <img
                    style={{
                      display: 'block',
                      width: 42,
                      height: 42,
                      borderRadius: 4,
                    }}
                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                    alt="icon"
                  />
                ),
              }}
            />
          );
        })}
      </ProCard>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <ProCard
          headerBordered
          style={{ borderRadius: 10 }}
          split={responsive ? 'horizontal' : 'vertical'}
        >
          <StatisticCard.Group
            title={'本周新增'}
            direction={responsive ? 'column' : 'row'}
            colSpan={10}
          >
            <StatisticCard
              statistic={{
                title: 'API Case',
                value: weekData.apis,
                description: (
                  <Statistic
                    title="周同比"
                    value={`${weekData.apis?.toString()} %`}
                    trend={weekData.apis_growth >= 0 ? 'up' : 'down'}
                  />
                ),
              }}
            />
            <StatisticCard
              statistic={{
                title: 'UI Task',
                value: weekData.api_task,
                description: (
                  <Statistic
                    title="周同比"
                    value={`${weekData.api_task_growth?.toString()} %`}
                    trend={weekData.api_task_growth >= 0 ? 'up' : 'down'}
                  />
                ),
              }}
            />
            <StatisticCard
              statistic={{
                title: 'UI Case',
                value: weekData.uis,
                description: (
                  <Statistic
                    title="周同比"
                    value={`${weekData.uis_growth?.toString()} %`}
                    trend={weekData.uis_growth >= 0 ? 'up' : 'down'}
                  />
                ),
              }}
            />
            <StatisticCard
              statistic={{
                title: 'UI Task',
                value: weekData.api_task,
                description: (
                  <Statistic
                    title="周同比"
                    value={`${weekData.ui_task_growth?.toString()} %`}
                    trend={weekData.ui_task_growth >= 0 ? 'up' : 'down'}
                  />
                ),
              }}
            />
          </StatisticCard.Group>
        </ProCard>
      </RcResizeObserver>
    </ProCard>
  );
}
