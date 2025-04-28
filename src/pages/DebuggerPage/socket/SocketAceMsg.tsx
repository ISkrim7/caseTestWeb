import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-html.js';
import 'ace-builds/src-noconflict/mode-json.js';
import 'ace-builds/src-noconflict/theme-twilight';
import { Button, Input, message, Select, Space } from 'antd';
import { FC, useState } from 'react';
import AceEditor from 'react-ace';
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
      <AceEditor
        style={{ borderRadius: 10 }}
        theme="twilight"
        mode={msgMode}
        readOnly={false}
        height={'40vh'}
        width={'100%'}
        value={socketMsg}
        fontSize={14}
        onChange={onSocketMsgChange}
        showGutter={true} //是否显示行号
        showPrintMargin={true}
        wrapEnabled={true} // 是否启用代码自动换行
        highlightActiveLine={true}
        editorProps={{
          $blockScrolling: true,
          $highlightPending: true,
          $highlightTagPending: true,
          $enableMultiselect: true,
        }}
        setOptions={{
          showLineNumbers: true,
          highlightActiveLine: true,
          cursorStyle: 'smooth',
          highlightSelectedWord: true,
          tabSize: 4,
          behavioursEnabled: true,
          readOnly: false,
          enableLiveAutocompletion: false,
          autoScrollEditorIntoView: true,
          useWorker: true,
          useSoftTabs: true,
        }}
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
