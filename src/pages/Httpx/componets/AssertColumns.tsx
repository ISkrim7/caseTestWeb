import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { IAsserts } from '@/pages/Interface/types';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Tag } from 'antd';

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
const AssertColumns: ProColumns<IAsserts>[] = [
  {
    title: '断言描述',
    dataIndex: 'desc',
    valueType: 'text',
    render: (text) => <Tag color={'blue'}>{text}</Tag>,
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
      <Tag color={text ? 'green' : 'volcano'}>{text ? 'SUCCESS' : 'FAIL'}</Tag>
    ),
  },
];

export default AssertColumns;
