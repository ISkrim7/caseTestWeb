import { runApiCase } from '@/api/inter/interCase';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import InterfaceApiCaseResultBaseInfo from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultBaseInfo';
import InterfaceApiResultResponses from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiResultResponses';
import { useModel } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SelfProps {
  openStatus: boolean;
  caseApiId: string;
}

const InterfaceApiCaseResultDrawer: FC<SelfProps> = ({
  openStatus,
  caseApiId,
}) => {
  const [logMessage, setLogMessage] = useState<string[]>([]);
  const [caseResultId, setCaseResultId] = useState<string>();
  const [tabDisabled, setTabDisabled] = useState(true);
  const { initialState } = useModel('@@initialState');
  const [defaultActiveKey, setDefaultActiveKey] = useState('2');

  useEffect(() => {
    if (caseResultId) {
      setTabDisabled(false);
    }
  }, [caseResultId]);

  // 核心逻辑，处理socket连接相关，根据openStatus和caseApiId来建立或清理连接
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
        runApiCase(caseApiId).then();
      });

      socket.on('message', ({ code, data }) => {
        console.log('Received message:', data);
        if (code === 0) {
          setLogMessage((prevMessages) => [...prevMessages, data]);
        } else {
          setCaseResultId(data.rId);
        }
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    };

    const cleanSocket = () => {
      if (socket) {
        socket.off('connect');
        socket.off('message');
        socket.disconnect();
      }
    };

    if (openStatus && caseApiId) {
      cleanSocket();
      createSocket();
    } else {
      setDefaultActiveKey('2');
      setLogMessage([]);
      cleanSocket();
    }

    return () => {
      cleanSocket();
    };
  }, [openStatus, caseApiId]);

  return (
    <ProCard>
      <Tabs
        tabPosition={'left'}
        title={`运行结果`}
        style={{ width: '100%', height: '100vh' }}
        size={'large'}
        defaultActiveKey={defaultActiveKey}
      >
        <Tabs.TabPane tab={'基本信息'} key={'1'} disabled={tabDisabled}>
          <InterfaceApiCaseResultBaseInfo resultId={caseResultId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'请求日志'} key={'2'}>
          <AceCodeEditor
            value={logMessage.join('\n')}
            height="100vh"
            readonly={true}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'步骤详情'} key={'3'} disabled={tabDisabled}>
          <InterfaceApiResultResponses caseResultId={caseResultId} />
        </Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default InterfaceApiCaseResultDrawer;
