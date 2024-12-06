import { caseAPIResultDetail } from '@/api/inter/interCase';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import InterfaceApiCaseResultBaseInfo from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceApiCaseResultBaseInfo';
import { IInterfaceCaseResult } from '@/pages/Interface/types';
import { useModel } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';
import io from 'socket.io-client';

interface SelfProps {
  openStatus: boolean;
}

const InterfaceApiCaseResultDrawer: FC<SelfProps> = ({ openStatus }) => {
  const [logMessage, setLogMessage] = useState<string[]>([]);
  const [caseReportInfo, setCaseReportInfo] = useState<IInterfaceCaseResult>();
  const [caseReportId, setCaseReportId] = useState<string>();
  const [tabDisabled, setTabDisabled] = useState(true);
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    if (!openStatus) {
      setLogMessage([]);
    }
  }, [openStatus]);

  useEffect(() => {
    if (caseReportId) {
      caseAPIResultDetail(caseReportId).then(async ({ code, data }) => {
        if (code === 0) {
          setTabDisabled(false);
          setCaseReportInfo(data);
        }
      });
    }
  }, [caseReportId]);
  useEffect(() => {
    const socket = io('ws://localhost:5050/ws', {
      query: { clientId: initialState?.currentUser?.uid },
      transports: ['websocket'],
      path: '/ws/socket.io',
    });

    socket.on('connect', () => {
      console.log('connect socket');
    });

    // 监听 server 发送的消息
    socket.on('message', ({ code, data }) => {
      console.log('Received message:', data);
      if (code === 0) {
        setLogMessage((prevMessages) => [...prevMessages, data]);
      } else {
        setCaseReportId(data.rId);
        socket.disconnect();
      }
    });

    // 清理函数，在组件卸载时清空 logMessage
    return () => {
      socket.disconnect();
      setLogMessage([]); // 清空 logMessage
    };
  }, []);
  return (
    <ProCard>
      <Tabs
        tabPosition={'left'}
        title={`运行结果`}
        style={{ width: '100%', height: '100vh' }}
        size={'large'}
        defaultActiveKey={'2'}
      >
        <Tabs.TabPane tab={'基本信息'} key={'1'} disabled={tabDisabled}>
          <InterfaceApiCaseResultBaseInfo resultBaseInfo={caseReportInfo} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'请求日志'} key={'2'}>
          <AceCodeEditor
            value={logMessage.join('\n')}
            height="100vh"
            readonly={true}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={'步骤详情'}
          key={'3'}
          disabled={tabDisabled}
        ></Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default InterfaceApiCaseResultDrawer;
