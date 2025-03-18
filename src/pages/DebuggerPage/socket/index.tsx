import { debugPerfInterApi } from '@/api/inter';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { useModel } from '@@/exports';
import { Line } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Button, Card } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

function App() {
  const [logMessage, setLogMessage] = useState<string[]>([]);
  const [perfData, setPerfData] = useState<any[]>([]);
  const rpsDataRef = useRef<any[]>([]);
  const data05Ref = useRef<any[]>([]);
  const data95Ref = useRef<any[]>([]);
  const { initialState } = useModel('@@initialState');
  const commonChartConfig = {
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    meta: {
      time: { alias: '时间' },
      value: { alias: '数值' },
    },
    legend: { position: 'top' },
    smooth: true,
    // animation: {
    //   appear: {
    //     animation: 'path-in',
    //     duration: 1000,
    //   },
    // },
  };

  const rpsConfig = useMemo(
    () => ({
      ...commonChartConfig,
      data: rpsDataRef.current,
    }),
    [rpsDataRef.current],
  );

  const responseConfig = useMemo(
    () => ({
      ...commonChartConfig,
      data: [...data05Ref.current, ...data95Ref.current],
    }),
    [data05Ref.current, data95Ref.current],
  );

  // @ts-ignore
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
        // if (caseApiId) {
        //   runApiCaseIo(caseApiId).then();
        // }
      });

      socket.on('data_message', (data) => {
        setLogMessage((prevMessages) => [
          ...prevMessages,
          JSON.stringify(data),
        ]);
        // Incrementally update the data
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

        rpsDataRef.current = [...rpsDataRef.current, newRpsData];
        data05Ref.current = [...data05Ref.current, newData05];
        data95Ref.current = [...data95Ref.current, newData95];
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

  // useEffect(() => {
  //   const newRpsData = perfData.map(({ current_rps }) => ({
  //     time: current_rps[0],
  //     value: current_rps[1],
  //     type: 'RPS',
  //   }));
  //   const newData05 = perfData.map(({ response_time_percentile_05 }) => ({
  //     time: response_time_percentile_05[0],
  //     value: response_time_percentile_05[1],
  //     type: '05th percentile',
  //   }));
  //   const newData95 = perfData.map(({ response_time_percentile_095 }) => ({
  //     time: response_time_percentile_095[0],
  //     value: response_time_percentile_095[1],
  //     type: '95th percentile',
  //   }));
  //
  //   rpsDataRef.current = [...rpsDataRef.current, ...newRpsData];
  //   data05Ref.current = [...data05Ref.current, ...newData05];
  //   data95Ref.current = [...data95Ref.current, ...newData95];
  // }, [perfData]);
  return (
    <ProCard split={'horizontal'}>
      <Card title="RPS" bordered={false} style={{ marginBottom: '24px' }}>
        <Line {...rpsConfig} />
      </Card>
      <Card title="响应时间" bordered={false} style={{ marginBottom: '24px' }}>
        <Line {...responseConfig} />
      </Card>
      <ProCard>
        <Button
          onClick={async () => {
            const body = {
              interfaceId: '397',
              perf_user: 5,
              perf_spawn_rate: 1,
              perf_duration: '20',
            };
            await debugPerfInterApi(body);
          }}
        >
          Click Me!
        </Button>
        <Button
          onClick={() => {
            setLogMessage([]);
          }}
        >
          Clear
        </Button>
        <AceCodeEditor
          value={logMessage.join('\n')}
          height="50vh"
          readonly={true}
        />
      </ProCard>
    </ProCard>
  );
}

export default App;
