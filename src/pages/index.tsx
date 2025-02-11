import {
  fetchCurrentTaskData,
  fetchWeekData,
  fetchWeekTaskData,
} from '@/api/base/statistics';
import { Line, Pie } from '@ant-design/plots';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { Typography } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import { useEffect, useState } from 'react';

const { Statistic } = StatisticCard;
const { Title } = Typography;

interface IStatisticsWeek {
  apis: number;
  api_task: number;
  api_task_growth: number;
  apis_growth: number;
  uis: number;
  uis_growth: number;
  ui_task: number;
  ui_task_growth: number;
}

export default function IndexPage() {
  const [weekData, setWeekData] = useState<IStatisticsWeek>({
    apis: 0,
    api_task: 0,
    api_task_growth: 0,
    apis_growth: 0,
    uis: 0,
    uis_growth: 0,
    ui_task: 0,
    ui_task_growth: 0,
  });
  const [apiWeekTaskData, setApIWeekTaskData] = useState<any[]>([]);
  const [uiWeekTaskData, setUIWeekTaskData] = useState<any[]>([]);
  const [currentApiTaskData, setCurrentApiTaskData] = useState<any>();
  const [currentUITaskData, setCurrentUITaskData] = useState<any>();
  const [responsive, setResponsive] = useState(false);

  useEffect(() => {
    fetchCurrentTaskData().then(async ({ code, data }) => {
      if (code === 0) {
        setCurrentApiTaskData(data.api_task);
        setCurrentUITaskData(data.ui_task);
      }
    });
    fetchWeekData().then(async ({ code, data }) => {
      if (code === 0) {
        setWeekData(data as IStatisticsWeek);
      }
    });
    fetchWeekTaskData().then(async ({ code, data }) => {
      if (code === 0) {
        setApIWeekTaskData(data.api_tasks);
        setUIWeekTaskData(data.ui_tasks);
      }
    });
  }, []);
  const configAPI = {
    data: apiWeekTaskData,
    xField: 'date',
    yField: 'num',
    seriesField: 'name',
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };
  const configUI = {
    data: uiWeekTaskData,
    xField: 'date',
    yField: 'num',
    seriesField: 'name',
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };
  const PieAPIData = [
    {
      type: '成功',
      value: currentApiTaskData?.success_num,
    },
    {
      type: '失败',
      value: currentApiTaskData?.fail_num,
    },
  ];
  const ApiPieConfig = {
    height: 50,
    appendPadding: 2,
    data: PieAPIData,
    angleField: 'value',
    colorField: 'type',
    autoFit: true,
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const PieUIData = [
    {
      type: '成功',
      value: currentUITaskData?.success_num,
    },
    {
      type: '失败',
      value: currentUITaskData?.fail_num,
    },
  ];
  const UIPieConfig = {
    height: 50,
    appendPadding: 2,
    data: PieUIData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return (
    <ProCard split={'horizontal'}>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <ProCard
          bordered
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
                title: <Title level={5}>{'API Case'}</Title>,
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
                title: <Title level={5}>{'API Task'}</Title>,
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
                title: <Title level={5}>{'UI Case'}</Title>,
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
                title: <Title level={5}>{'UI Task'}</Title>,
                value: weekData.ui_task,
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
        <ProCard
          split={'vertical'}
          colSpan={12}
          gutter={16}
          style={{ borderRadius: 10, marginTop: 20, overflow: 'hidden' }}
        >
          <ProCard title={'API Task 构建情况'} bordered>
            <StatisticCard.Group
              boxShadow
              direction={responsive ? 'column' : 'row'}
              title={'今日构建'}
            >
              <StatisticCard
                statistic={{
                  title: '总共',
                  valueStyle: { color: 'greenyellow' },
                  value: currentApiTaskData?.total_num,
                  description: <Statistic value={currentApiTaskData?.date} />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '成功',
                  value: currentApiTaskData?.success_num,
                  valueStyle: { color: 'green' },
                  description: (
                    <Statistic
                      title="占比"
                      value={
                        currentApiTaskData?.success_num === 0
                          ? '0%'
                          : `${(
                              (currentApiTaskData?.success_num /
                                currentApiTaskData?.total_num) *
                              100
                            ).toFixed(2)}%`
                      }
                    />
                  ),
                }}
                chartPlacement="left"
              />
              <StatisticCard
                statistic={{
                  title: '失败',
                  value: currentApiTaskData?.fail_num,
                  valueStyle: { color: 'red' },
                  description: (
                    <Statistic
                      title="占比"
                      value={
                        currentApiTaskData?.fail_num === 0
                          ? '0%'
                          : `${(
                              (currentApiTaskData?.fail_num /
                                currentApiTaskData?.total_num) *
                              100
                            ).toFixed(2)}%`
                      }
                    />
                  ),
                }}
                chartPlacement="left"
              />
              <StatisticCard chart={<Pie {...ApiPieConfig} />} />
            </StatisticCard.Group>
            <StatisticCard.Group
              direction={'row'}
              style={{ marginTop: 50 }}
              // @ts-ignore
              chart={<Line {...configAPI} />}
            />
          </ProCard>
          <ProCard bordered title={'UI Task 构建情况'}>
            <StatisticCard.Group
              boxShadow
              bordered={true}
              direction={responsive ? 'column' : 'row'}
              title={'今日构建'}
            >
              <StatisticCard
                statistic={{
                  title: '总共',
                  valueStyle: { color: 'greenyellow' },
                  value: currentUITaskData?.total_num,
                  description: <Statistic value={currentUITaskData?.date} />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '成功',
                  value: currentUITaskData?.success_num,
                  valueStyle: { color: 'green' },
                  description: (
                    <Statistic
                      title="占比"
                      value={
                        currentUITaskData?.success_num === 0
                          ? '0%'
                          : `${(
                              (currentUITaskData?.success_num /
                                currentUITaskData?.total_num) *
                              100
                            ).toFixed(2)}%`
                      }
                    />
                  ),
                }}
                chartPlacement="left"
              />
              <StatisticCard
                statistic={{
                  title: '失败',
                  value: currentUITaskData?.fail_num,
                  valueStyle: { color: 'red' },
                  description: (
                    <Statistic
                      title="占比"
                      value={
                        currentUITaskData?.fail_num === 0
                          ? '0%'
                          : `${(
                              (currentUITaskData?.fail_num /
                                currentUITaskData?.total_num) *
                              100
                            ).toFixed(2)}%`
                      }
                    />
                  ),
                }}
                chartPlacement="left"
              />
              <StatisticCard chart={<Pie {...UIPieConfig} />} />
            </StatisticCard.Group>
            <StatisticCard.Group
              direction={'row'}
              style={{ marginTop: 50 }}
              // @ts-ignore
              chart={<Line {...configUI} />}
            />
          </ProCard>
        </ProCard>
      </RcResizeObserver>
    </ProCard>
  );
}
