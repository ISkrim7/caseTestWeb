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
      });

      socket.on('data_message', (data) => {
        // Incrementally update the data
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
  );
}

export default App;
