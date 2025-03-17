import { debugPerfInterApi } from '@/api/inter';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { useModel } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

function App() {
  const [logMessage, setLogMessage] = useState<string[]>([]);
  const { initialState } = useModel('@@initialState');

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
        console.log('Received message:', data);
        setLogMessage((prevMessages) => [...prevMessages, data]);
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
      <ProCard>
        <Button
          onClick={async () => {
            const body = {
              interfaceId: '397',
              perf_user: 1,
              perf_spawn_rate: 1,
              perf_duration: '1',
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
