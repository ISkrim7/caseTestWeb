import { executeCaseByIO } from '@/api/play';
import { getDebugResultDetail } from '@/api/play/result';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import MyTabs from '@/components/MyTabs';
import { IAsserts } from '@/pages/Httpx/types';
import { IUIResult } from '@/pages/Play/componets/uiTypes';
import PlayCaseResultInfo from '@/pages/Play/PlayResult/PlayCaseResultDetail/PlayCaseResultInfo';
import { useModel } from '@@/exports';
import {
  InfoCircleOutlined,
  MessageOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { TabsProps, Tag, Tooltip } from 'antd';
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
      socket = io('ws://localhost:5050/ui_namespace', {
        query: {
          clientId: initialState?.currentUser?.uid,
          EIO: 4,
        },
        upgrade: false, // 禁止降级
        transports: ['websocket'],
        path: '/socket.io',
      });

      socket.on('connect', () => {
        console.log('connect socket');
        if (caseId) {
          executeCaseByIO({ caseId: caseId }).then();
        }
      });

      socket.on('ui_message', ({ code, data }) => {
        console.log('Received message:', code, data);
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
            setLogMessage(data.running_logs.split('\n'));
          } else {
            setLogMessage([]);
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
              value={record.actual}
              readonly={true}
              height={'80px'}
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
  const items: TabsProps['items'] = [
    {
      label: '基本信息',
      key: '1',
      icon: <InfoCircleOutlined />,
      children: <PlayCaseResultInfo resultDetail={currentResultDetail} />,
    },
    {
      label: '请求日志',
      key: '2',
      icon: <MessageOutlined />,
      children: (
        <AceCodeEditor
          value={logMessage.join('\n')}
          height="100vh"
          _mode="json"
          readonly={true}
        />
      ),
    },
    {
      label: '断言详情',
      key: '3',
      icon: <OrderedListOutlined />,
      children: (
        <ProTable
          search={false}
          toolBarRender={false}
          columns={UIAssertColumns}
          dataSource={asserts}
          scroll={{ x: 1000 }}
        />
      ),
    },
  ];

  return (
    <ProCard>
      <MyTabs
        items={items}
        tabPosition={'top'}
        defaultActiveKey={defaultActiveKey}
      />
    </ProCard>
  );
};

export default Index;
