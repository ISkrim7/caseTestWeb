import { addApsWsJob } from '@/api/aps';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { useModel } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';

function App() {
  const [apsMessage, setApsMessage] = useState<string[]>([]);
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:5050/cah_ws');
    ws.onmessage = function (event) {
      setApsMessage((pre) => [...pre, event.data]);
    };
  }, []);

  const click = async () => {
    await addApsWsJob({ task_id: 'task_id' });
  };

  return (
    <ProCard split={'horizontal'}>
      <ProCard>
        <h1>aps</h1>
        <button onClick={click}>Click Me!</button>
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
