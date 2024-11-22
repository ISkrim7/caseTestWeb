import { getResultByUid } from '@/api/ui';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import RespProTable from '@/pages/Interface/InterResponse/component/RespProTable';
import { IAsserts } from '@/pages/Interface/types';
import UILogs from '@/pages/Report/History/UISingle/UILogs';
import UiSingleDetail from '@/pages/Report/History/UISingle/UISingleDetail';
import { UIMultipleDetailReport } from '@/pages/Report/uiReport';
import { IUIResult } from '@/pages/UIPlaywright/uiTypes';
import { ProCard } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Tabs, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  currentUid?: string;
}

const UiResultInfo: FC<SelfProps> = ({ currentUid }) => {
  const [resultDetail, setResultDetail] = useState<
    IUIResult | UIMultipleDetailReport
  >();
  const [logs, setLogs] = useState<string>();
  const [asserts, setAsserts] = useState<any[]>([]);
  useEffect(() => {
    if (currentUid) {
      fetchUIResult(currentUid).then((data) => {
        if (data) {
          setResultDetail(data);
          setLogs(data.runningLogs);
          setAsserts(data.assertsInfo);
        }
      });
    }
  }, [currentUid]);

  const fetchUIResult = async (uid: string) => {
    const { code, data } = await getResultByUid({ uid });
    if (code === 0) {
      return data;
    }
  };

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
    <ProCard>
      <Tabs tabPosition={'left'} size={'large'}>
        <Tabs.TabPane key={'1'} tab={'基本信息'}>
          <UiSingleDetail resultDetail={resultDetail} />
        </Tabs.TabPane>
        <Tabs.TabPane key={'2'} tab={'运行日志'}>
          <UILogs logs={logs} />
        </Tabs.TabPane>
        <Tabs.TabPane key={'3'} tab={'断言信息'}>
          <RespProTable columns={UIAssertColumns} dataSource={asserts} />
        </Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default UiResultInfo;
