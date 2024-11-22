import { addApsWsJob } from '@/api/aps';
import { getNs } from '@/api/cbsAPI/cbs';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { useModel } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [allMessage, setAllMessage] = useState<string[]>([]);
  const [apsMessage, setApsMessage] = useState<string[]>([]);
  const { initialState } = useModel('@@initialState');
  const [ns, setNs] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (ns) {
      const socket = io('wss://aijia-test.5i5j.com/' + ns, {
        upgrade: true,
      });
      console.log(socket);
      socket.on('connect', () => {
        console.log('WebSocket connected!');
        console.log('connected', socket);
        socket.on('log', ({ msg }) => {
          console.log('==', msg);
          setAllMessage((prevMessages) => [...prevMessages, msg]);
        });
      });
      socket.on('connect_error', (err) => {
        console.error('Connect error:', err.message);
      });

      socket.on('disconnect', (reason) => {
        console.log('disconnected', socket);
        console.log('WebSocket disconnected:', reason);
      });

      return () => {
        socket.off('log');
        socket.disconnect();
      };
    }
  }, [ns]);

  const handleClick2aps = async () => {
    const ws = new WebSocket('ws://10.1.6.39:6060/aps_ws');
    ws.onmessage = function (event) {
      setApsMessage((pre) => [...pre, event.data]);
    };
    addApsWsJob({ task_id: '12321312' }).then(({ code, data, msg }) => {
      console.log(code, msg);
      setNs(data);
    });
  };
  const handleClick = async () => {
    await getNs().then(({ code, data }) => {
      if (code === 0) {
        setNs(data);
      }
    });
  };

  useEffect(() => {
    if (ns) {
      const ws = new WebSocket('ws://10.1.6.39:6060/aps_ws/' + ns);

      ws.onopen = () => {
        console.log('websocket connected');
      };

      ws.onmessage = (event) => {
        setApsMessage((pre) => [...pre, event.data]);
      };
      ws.onclose = () => {
        console.log('WebSocket closed');
      };

      setSocket(ws as any);
    }
  }, [ns]);

  return (
    <ProCard split={'horizontal'}>
      <ProCard>
        <button onClick={handleClick}>Click Me!</button>
        <button
          onClick={() => {
            setAllMessage([]);
            setNs(null);
          }}
        >
          Clear
        </button>
        <AceCodeEditor
          value={allMessage.join('')}
          height="50vh"
          readonly={true}
        />
        <h1>aps</h1>
        <button onClick={handleClick2aps}>Click Me!</button>
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
