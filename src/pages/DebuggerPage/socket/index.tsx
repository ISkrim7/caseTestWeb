import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { useModel } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [apsMessage, setApsMessage] = useState<string[]>([]);
  const { initialState } = useModel('@@initialState');
  const [clientId, setClientId] = useState<any>(null);
  const [value, setValue] = useState<string>();

  // @ts-ignore
  useEffect(() => {
    const socket = io('ws://localhost:5050/ws', {
      query: { clientId: initialState?.currentUser?.uid },
      transports: ['websocket'],
      path: '/ws/socket.io',
    });

    // 获取客户端ID (假设返回的 clientId 会作为查询参数进行传递)
    socket.on('connect', () => {
      setClientId(socket.id);
    });

    // 监听 server 发送的消息
    socket.on('message', (data) => {
      console.log('Received message:', data);
      setApsMessage((prevMessages) => [...prevMessages, data.data]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <ProCard split={'horizontal'}>
      <ProCard>
        <h1>aps</h1>
        <button>Click Me!</button>
        <button
          onClick={() => {
            setApsMessage([]);
          }}
        >
          Clear
        </button>
        <AceCodeEditor
          value={apsMessage.join('\n')}
          height="50vh"
          readonly={true}
        />
      </ProCard>
    </ProCard>
  );
}

export default App;
