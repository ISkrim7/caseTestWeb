import { executeCaseByIO } from '@/api/play';
import { getDebugResultDetail } from '@/api/play/result';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { IAsserts } from '@/pages/Httpx/types';
import PlayCaseResultInfo from '@/pages/Play/PlayResult/PlayCaseResultDetail/PlayCaseResultInfo';
import { IUIResult } from '@/pages/UIPlaywright/uiTypes';
import { useModel } from '@@/exports';
import { ProTable } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Tabs, Tag, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SelfProps {
  openStatus?: boolean;
  caseId?: string;
  resultId?: string;
}

const Index: FC<SelfProps> = (props) => {
  const { openStatus, caseId, resultId } = props;
  const { initialState } = useModel('@@initialState');
  const [logMessage, setLogMessage] = useState<string[]>([]);
  const [caseResultId, setCaseResultId] = useState<string>();
  const [defaultActiveKey, setDefaultActiveKey] = useState('2');
  const [asserts, setAsserts] = useState<any[]>([]);
  const [currentResultDetail, setCurrentResultDetail] = useState<IUIResult>();
  const [tabDisabled, setTabDisabled] = useState(true);

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
        if (caseId) {
          executeCaseByIO({ caseId: caseId }).then();
        }
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

    if (openStatus && caseId) {
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
  }, [openStatus, caseId]);

  useEffect(() => {
    if (resultId) {
      setCaseResultId(resultId);
    }
  }, [resultId]);

  useEffect(() => {
    if (caseResultId) {
      setTabDisabled(false);
      getDebugResultDetail(caseResultId).then(async ({ code, data }) => {
        if (code === 0) {
          setCurrentResultDetail(data);
          if (data.running_logs) {
            setLogMessage(data.running_logs.split(''));
          }
          if (data.asserts_info) {
            setAsserts(data.asserts_info);
          }
        }
      });
    }
  }, [caseResultId]);
  const typeContent = (T: any) => {
    if (typeof T === 'object') {
      return (
        <AceCodeEditor
          gutter={false}
          showLineNumbers={false}
          value={JSON.stringify(T, null, 2)}
          readonly={true}
          height={'40px'}
        />
      );
    } else if (typeof T === 'boolean') {
      return <Tag color={T ? 'green' : 'red'}>{T.toString()}</Tag>;
    } else {
      if (T.length > 20) {
        return (
          <Tooltip title={T}>
            <span>{T.substring(0, 20) + '...'}</span>
          </Tooltip>
        );
      }
      return <span>{T}</span>;
    }
  };

  const UIAssertColumns: ProColumns<IAsserts>[] = [
    {
      title: '类型',
      valueType: 'text',
      dataIndex: 'type',
      fixed: 'left',
      width: '6%',
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '步骤',
      valueType: 'text',
      dataIndex: 'stepName',
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },

    {
      title: '断言描述',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: '预计结果',
      dataIndex: 'expect',
      key: 'expect',
      valueType: 'jsonCode',
      render: (_text, record) => {
        if (record.extraValueType === 'object') {
          return (
            <AceCodeEditor
              value={record.expect}
              readonly={true}
              height={'80px'}
              showLineNumbers={false}
            />
          );
        } else if (record.extraValueType === 'bool') {
          return (
            <Tag color={record.expect === 'true' ? 'green' : 'red'}>
              {record.expect}
            </Tag>
          );
        } else {
          return <span>{record.expect}</span>;
        }
      },
    },
    {
      title: '断言方法',
      dataIndex: 'assertOpt',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '实际结果',
      dataIndex: 'actual',
      valueType: 'textarea',
      render: (_text, record) => {
        return typeContent(record.actual);
      },
    },

    {
      title: '提取',
      dataIndex: 'extraOpt',
      key: 'extraOpt',
      width: '15%',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '语法',
      dataIndex: 'extraValue',
      key: 'extraValue',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '测试结果',
      dataIndex: 'result',
      key: 'result',
      fixed: 'right',
      render: (text) => (
        <Tag color={text ? 'green' : 'volcano'}>
          {text ? 'SUCCESS' : 'FAIL'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <Tabs tabPosition="left" size="large" defaultActiveKey={defaultActiveKey}>
        <Tabs.TabPane key="1" tab={'基本信息'} disabled={tabDisabled}>
          <PlayCaseResultInfo resultDetail={currentResultDetail} />
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab={'日志信息'}>
          <AceCodeEditor
            value={logMessage.join('')}
            height="100vh"
            readonly={true}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab={'断言信息'} disabled={tabDisabled}>
          <ProTable
            search={false}
            toolBarRender={false}
            columns={UIAssertColumns}
            dataSource={asserts}
            scroll={{ x: 1000 }}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
