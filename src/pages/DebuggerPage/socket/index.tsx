import MyTabs from '@/components/MyTabs';
import SocketAceMsg from '@/pages/DebuggerPage/socket/SocketAceMsg';
import SocketEvent from '@/pages/DebuggerPage/socket/SocketEvent';
import { useModel } from '@@/exports';
import { MessageOutlined, PushpinOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Connection } from '@icon-park/react';
import { Button, Input, message, TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [socketUrl, setSocketUrl] = useState<string>();
  const [socketMsg, setSocketMsg] = useState<string>();

  useEffect(() => {
    return () => {
      if (socket) {
        socket.offAny();
        socket.disconnect();
      }
    };
  }, [socket]);

  const onConnect = async () => {
    if (socket && socket.connected) {
      socket.disconnect();
      setSocket(null);
      message.success('已断开连接');
      return;
    }

    if (!socketUrl) {
      message.error('请输入有效的 Socket URL');
      return;
    }
    const newSocket = io(socketUrl, {
      query: {
        EIO: 4,
      },
      transports: ['websocket'], // 禁用 polling
      upgrade: false, // 禁止降级尝试
      reconnection: false, // 禁用自动重试
    });
    newSocket.on('connect', () => {
      message.success('Connected to server');
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.log('连接失败:', error);
      message.error(`连接失败: ${error.message}`);
      setSocket(null);
    });
  };

  const socketItems: TabsProps['items'] = [
    {
      key: '1',
      label: '发送消息',
      icon: <MessageOutlined />,
      children: <SocketAceMsg socket={socket} />,
    },
    {
      key: '2',
      label: '事件',
      icon: <PushpinOutlined />,
      children: <SocketEvent socket={socket} />,
    },
  ];
  return (
    <ProCard split="horizontal">
      <ProCard>
        <Input.Search
          addonBefore={<Connection theme="outline" />}
          enterButton={
            <Button type={'primary'} onClick={onConnect}>
              {socket?.connected ? '断开连接' : '连接'}
            </Button>
          }
          onChange={(e) => {
            setSocketUrl(e.target.value);
          }}
        />
      </ProCard>
      <ProCard>
        <MyTabs defaultActiveKey={'1'} items={socketItems} />
      </ProCard>
    </ProCard>
  );
}

export default App;
