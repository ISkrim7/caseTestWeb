import { Line } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Card } from 'antd';
import { useState } from 'react';

const data = [
  {
    response_time_percentile_05: ['16:01:59', 19],
    response_time_percentile_095: ['16:01:59', 95],
    current_rps: ['16:01:59', 0],
    current_fail_per_sec: ['16:01:59', 0],
    total_avg_response_time: ['16:01:59', 28.11],
    user_count: ['16:01:59', 1],
    time: '16:01:59',
  },
  {
    response_time_percentile_05: ['16:02:00', 19],
    response_time_percentile_095: ['16:02:00', 95],
    current_rps: ['16:02:00', 7.0],
    current_fail_per_sec: ['16:02:00', 0],
    total_avg_response_time: ['16:02:00', 29.71],
    user_count: ['16:02:00', 2],
    time: '16:02:00',
  },
  {
    response_time_percentile_05: ['16:02:02', 20],
    response_time_percentile_095: ['16:02:02', 100.0],
    current_rps: ['16:02:02', 23.666666666666668],
    current_fail_per_sec: ['16:02:02', 0],
    total_avg_response_time: ['16:02:02', 32.45],
    user_count: ['16:02:02', 3],
    time: '16:02:02',
  },
  {
    response_time_percentile_05: ['16:02:04', 20],
    response_time_percentile_095: ['16:02:04', 100.0],
    current_rps: ['16:02:04', 25.2],
    current_fail_per_sec: ['16:02:04', 0],
    total_avg_response_time: ['16:02:04', 32.16],
    user_count: ['16:02:04', 4],
    time: '16:02:04',
  },
  {
    response_time_percentile_05: ['16:02:05', 19],
    response_time_percentile_095: ['16:02:05', 100.0],
    current_rps: ['16:02:05', 26.833333333333332],
    current_fail_per_sec: ['16:02:05', 0],
    total_avg_response_time: ['16:02:05', 30.37],
    user_count: ['16:02:05', 5],
    time: '16:02:05',
  },
  {
    response_time_percentile_05: ['16:02:06', 19],
    response_time_percentile_095: ['16:02:06', 100.0],
    current_rps: ['16:02:06', 27.571428571428573],
    current_fail_per_sec: ['16:02:06', 0],
    total_avg_response_time: ['16:02:06', 30.61],
    user_count: ['16:02:06', 5],
    time: '16:02:06',
  },
  {
    response_time_percentile_05: ['16:02:08', 19],
    response_time_percentile_095: ['16:02:08', 110.0],
    current_rps: ['16:02:08', 30.11111111111111],
    current_fail_per_sec: ['16:02:08', 0],
    total_avg_response_time: ['16:02:08', 31.01],
    user_count: ['16:02:08', 5],
    time: '16:02:08',
  },
  {
    response_time_percentile_05: ['16:02:09', 19],
    response_time_percentile_095: ['16:02:09', 110.0],
    current_rps: ['16:02:09', 29.8],
    current_fail_per_sec: ['16:02:09', 0],
    total_avg_response_time: ['16:02:09', 30.51],
    user_count: ['16:02:09', 5],
    time: '16:02:09',
  },
];
const Index = () => {
  const [perfData, setPerfData] = useState(data);
  // 处理数据，提取需要的字段
  const chartData = data.map((item) => ({
    time: item.time,
    p05: item.response_time_percentile_05[1],
    p95: item.response_time_percentile_095[1],
    rps: item.current_rps[1],
    failRate: item.current_fail_per_sec[1],
    avgResponseTime: item.total_avg_response_time[1],
    userCount: item.user_count[1],
  }));
  // 折线图配置
  const lineConfig = {
    data: perfData,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    meta: {
      time: { alias: '时间' },
      value: { alias: '数值' },
    },
    legend: { position: 'top' },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };
  return (
    <ProCard>
      {/* 关键指标卡片 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <Card title="当前 RPS" bordered={false}>
          {chartData.length > 0 ? chartData[chartData.length - 1].rps : 'N/A'}
        </Card>
        <Card title="平均响应时间" bordered={false}>
          {chartData.length > 0
            ? chartData[chartData.length - 1].avgResponseTime
            : 'N/A'}{' '}
          ms
        </Card>
        <Card title="并发用户数" bordered={false}>
          {chartData.length > 0
            ? chartData[chartData.length - 1].userCount
            : 'N/A'}
        </Card>
      </div>
      {/* 响应时间折线图 */}
      <Card title="响应时间" bordered={false} style={{ marginBottom: '24px' }}>
        <Line
          {...lineConfig}
          data={[
            ...chartData.map((item) => ({
              ...item,
              type: 'P05',
              value: item.p05,
            })),
            ...chartData.map((item) => ({
              ...item,
              type: 'P95',
              value: item.p95,
            })),
          ]}
        />
      </Card>
    </ProCard>
  );
};

export default Index;
