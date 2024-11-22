import { getApiResponse, getGroupDetail } from '@/api/interface';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import MyDrawer from '@/components/MyDrawer';
import InterfaceResultBaseInfo from '@/pages/Interface/InterResponse/component/InterfaceResultBaseInfo';
import TryResponse from '@/pages/Interface/InterResponse/TryResponse';
import { InterfaceResponse } from '@/pages/Interface/types';
import { socketUrl } from '@/utils/config';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SelfProps {
  roomId?: string;
  open: boolean;
  setOpen: any;
  resultUid?: string;
  isGroup?: boolean;
}

const Index: FC<SelfProps> = ({
  roomId,
  open,
  setOpen,
  resultUid,
  isGroup,
}) => {
  const [responseInfo, setResponseInfo] = useState<InterfaceResponse>();
  const [activeKey, setActiveKey] = useState('1');
  const socketRef = useRef<Socket | null>(null);
  const [log, setLogData] = useState<string[]>([]);
  const [allLogs, setAllLogs] = useState<string[]>([]); // 新增一个状态变量 allLogs 来保存所有的日志内容
  const [infoDisband, setInfoDisBand] = useState(true);
  const [responseUid, setResponseUid] = useState();

  useEffect(() => {
    if (resultUid) {
      setActiveKey('1');
      if (!isGroup) {
        getResponse(resultUid).then((data) => {
          setInfoDisBand(false);
          setResponseInfo(data);
        });
      } else {
        getGroupResponse(resultUid).then((data) => {
          setInfoDisBand(false);
          setResponseInfo(data);
        });
      }
    }
  }, [resultUid]);

  useEffect(() => {
    if (responseUid) {
      setActiveKey('1');
      getResponse(responseUid).then((data) => {
        setInfoDisBand(false);
        setResponseInfo(data);
      });
    }
  }, [responseUid]);

  useEffect(() => {
    setAllLogs((prevLogs) => [...prevLogs, ...log]); // 在变化时将 log 合并到 allLogs 中
  }, [log]);

  useEffect(() => {
    if (roomId) {
      socketRef.current = io(socketUrl, {
        query: { room: roomId },
      });
      const socket = socketRef.current;
      socket.on('connect', function () {
        console.log(`Connected to room ${roomId}`);
        socket.on('log', ({ code, msg }) => {
          if (code === 0) {
            console.log(msg);
            setLogData([...log, msg]);
          } else if (code === 1) {
            console.log('over', msg);
            setResponseUid(msg);
            socket?.disconnect();
          } else {
            socket.on('api discontent', () => {
              console.log(`disconnect to room ${roomId}`);
            });
            socket.disconnect();
          }
        });

        socket.on('api', ({ code, msg }) => {
          if (code === 0) {
            console.log(msg);
            setLogData([...log, msg]);
          } else if (code === 1) {
            console.log('over', msg);
            setResponseUid(msg);
            socket?.disconnect();
          } else {
            socket.on('api discontent', () => {
              console.log(`disconnect to room ${roomId}`);
            });
            socket.disconnect();
          }
        });
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [roomId]);
  const getResponse = async (resultUid: string) => {
    const { code, data } = await getApiResponse({ uid: resultUid });
    if (code === 0) {
      return data;
    }
  };

  const getGroupResponse = async (resultUid: string) => {
    const { code, data } = await getGroupDetail({ uid: resultUid });
    if (code === 0) {
      return data;
    }
  };

  const onClose = () => {
    if (!isGroup) {
      setAllLogs([]);

      setResponseInfo(undefined);
      setActiveKey('1');
      setInfoDisBand(true);
    }
    setOpen(false);
  };
  return (
    <MyDrawer
      name={'测试结果'}
      open={open}
      setOpen={setOpen}
      onClose={onClose}
      width={'75%'}
    >
      <Tabs
        tabPosition={'left'}
        title={`运行结果`}
        style={{ width: '100%', height: '100vh' }}
        size={'large'}
        defaultActiveKey={activeKey}
        onChange={(key) => setActiveKey(key)}
      >
        <Tabs.TabPane key={'1'} tab={'请求日志'}>
          <ProCard bodyStyle={{ padding: 0 }} bordered>
            {roomId ? (
              <AceCodeEditor
                _mode={'json'}
                value={allLogs.join('')}
                height={'100vh'}
                readonly={true}
              />
            ) : (
              <AceCodeEditor
                _mode={'json'}
                value={responseInfo?.interfaceLog}
                height={'100vh'}
                readonly={true}
              />
            )}
          </ProCard>
        </Tabs.TabPane>
        <Tabs.TabPane key={'2'} tab={'基本信息'} disabled={infoDisband}>
          <InterfaceResultBaseInfo responseInfo={responseInfo!} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'步骤详情'} key={'3'} disabled={infoDisband}>
          <TryResponse responseInfos={responseInfo?.resultInfo!} />
        </Tabs.TabPane>
      </Tabs>
    </MyDrawer>
  );
};

export default Index;
