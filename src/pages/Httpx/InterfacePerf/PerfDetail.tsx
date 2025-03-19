import { useModel, useParams } from '@@/exports';
import { Line, LineConfig } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const { Title } = Typography;
const PerfDetail = () => {
  const { perfId } = useParams<{ perfId: string }>();
  const { initialState } = useModel('@@initialState');
  const [rpsData, setRpsData] = useState<any[]>([]);
  const [currentRps, setCurrentRps] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [requestNums, setRequestNums] = useState<number>(0);
  const [totalAvgResponseTime, setTotalAvgResponseTime] = useState<number>(0);
  const [MaxResponseTime, setMaxResponseTime] = useState<number>(0);
  const [data05, setData05] = useState<any[]>([]);
  const [data95, setData95] = useState<any[]>([]);
  const [requestFailNum, setRequestFailNum] = useState<number>(0);

  const commonChartConfig: LineConfig = {
    data: [],
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
  const rpsConfig = useMemo(
    () => ({
      ...commonChartConfig,
      data: rpsData,
    }),
    [rpsData],
  );

  const responseConfig = useMemo(
    () => ({
      ...commonChartConfig,
      data: [...data05, ...data95],
    }),
    [data05, data95],
  );

  useEffect(() => {
    let socket: Socket | undefined;
    const createSocket = () => {
      socket = io('ws://localhost:5050/ws', {
        query: { clientId: initialState?.currentUser?.uid },
        transports: ['websocket'],
        path: '/ws/socket.io',
      });

      socket.on('connect', () => {
        console.log('connect socket');
      });

      socket.on('data_message', (data) => {
        // Incrementally update the data
        setCurrentRps(data.total_rps);
        setUserCount(data.user_count);
        setRequestNums(data.request_num);
        setRequestFailNum(data.request_fail_num);
        setTotalAvgResponseTime(data.total_avg_response_time[1]);
        setMaxResponseTime(data.max_response);
        const newRpsData = {
          time: data.current_rps[0],
          value: data.current_rps[1],
          type: 'RPS',
        };
        const newData05 = {
          time: data.response_time_percentile_05[0],
          value: data.response_time_percentile_05[1],
          type: '05th percentile',
        };
        const newData95 = {
          time: data.response_time_percentile_095[0],
          value: data.response_time_percentile_095[1],
          type: '95th percentile',
        };

        // 使用函数式更新，确保每次更新都是基于最新状态
        setRpsData((prev) => [...prev, newRpsData]);
        setData05((prev) => [...prev, newData05]);
        setData95((prev) => [...prev, newData95]);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    };
    createSocket();
    const cleanSocket = () => {
      if (socket) {
        socket.off('push_message');
        socket.off('message');
        socket.disconnect();
      }
    };
    return () => {
      cleanSocket();
    };
  }, []);

  return (
    <ProCard split={'horizontal'}>
      <ProCard split={'vertical'}>
        <ProCard split={'vertical'}>
          <ProCard split={'horizontal'}>
            <ProCard layout={'center'}>
              <Space direction={'vertical'}>
                <Title level={5}>Request Num</Title>
                <Title
                  level={2}
                  style={{
                    color: '#c21ce7',
                    marginTop: 20,
                    textAlign: 'center',
                  }}
                >
                  {requestNums}
                </Title>
              </Space>
            </ProCard>
            <ProCard layout={'center'}>
              <Space direction={'vertical'}>
                <Title level={5}>Request Fail Num</Title>
                <Title
                  level={2}
                  style={{
                    color: 'green',
                    marginTop: 20,
                    textAlign: 'center',
                  }}
                >
                  {requestFailNum}
                </Title>
              </Space>
            </ProCard>
            <ProCard layout={'center'}>
              <Space direction={'vertical'}>
                <Title level={5}>Max Response Time (ms)</Title>
                <Title
                  level={2}
                  style={{
                    color: 'green',
                    marginTop: 20,
                    textAlign: 'center',
                  }}
                >
                  {MaxResponseTime}
                </Title>
              </Space>
            </ProCard>
          </ProCard>
          <ProCard split={'horizontal'}>
            <ProCard layout={'center'}>
              <Space direction={'vertical'}>
                <Title level={5}>User Count</Title>
                <Title
                  level={2}
                  style={{
                    color: '#c21ce7',
                    marginTop: 20,
                    textAlign: 'center',
                  }}
                >
                  {userCount}
                </Title>
              </Space>
            </ProCard>
            <ProCard layout={'center'}>
              <Space direction={'vertical'}>
                <Title level={5}>RPS</Title>
                <Title
                  level={2}
                  style={{
                    color: 'green',
                    marginTop: 20,
                    textAlign: 'center',
                  }}
                >
                  {currentRps}
                </Title>
              </Space>
            </ProCard>
            <ProCard layout={'center'}>
              <Space direction={'vertical'}>
                <Title level={5}>Avg Response Time (ms)</Title>
                <Title
                  level={2}
                  style={{
                    color: 'green',
                    marginTop: 20,
                    textAlign: 'center',
                  }}
                >
                  {totalAvgResponseTime}
                </Title>
              </Space>
            </ProCard>
          </ProCard>
        </ProCard>
        <ProCard title={'RPS'}>
          <Line {...rpsConfig} />
        </ProCard>
      </ProCard>
      <ProCard bordered style={{ marginTop: 20 }} title={'Response Time'}>
        <Line {...responseConfig} />
      </ProCard>
    </ProCard>
  );
};

export default PerfDetail;
