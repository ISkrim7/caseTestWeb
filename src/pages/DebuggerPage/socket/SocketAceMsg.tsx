import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { Button, Input, message, Select, Space } from 'antd';
import { FC, useState } from 'react';
import { Socket } from 'socket.io-client';

interface SelfProps {
  socket: Socket | null;
}

const SocketAceMsg: FC<SelfProps> = ({ socket }) => {
  const [msgMode, setMsgMode] = useState<string>('text');
  const [socketMsg, setSocketMsg] = useState<string>();
  const [eventName, setEventName] = useState<string>('message');
  const sendSocketMsg = async () => {
    console.log(socket);
    if (!socket || !socket?.connected) {
      message.error('请先连接服务器');
      return;
    }
    if (!socketMsg) {
      message.error('请输入要发送的消息');
      return;
    }
    if (socket?.connected) {
      socket.emit(eventName, socketMsg);
    }
  };

  const onSocketMsgChange = async (value: string) => {
    setSocketMsg(value);
  };
  return (
    <div>
      <AceCodeEditor
        _mode={msgMode}
        value={socketMsg}
        onChange={onSocketMsgChange}
      />
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Select
          style={{ width: '200px' }}
          defaultValue={msgMode}
          options={[
            { label: 'Text', value: 'text' },
            { label: 'JSON', value: 'json' },
            { label: 'HTML', value: 'html' },
          ]}
          onChange={(value) => {
            setMsgMode(value);
          }}
        />
        <div style={{ marginLeft: 'auto' }}>
          <Space>
            <Input
              defaultValue={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <Button onClick={sendSocketMsg}>Send</Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default SocketAceMsg;
