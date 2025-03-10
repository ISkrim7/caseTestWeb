import MyProTable from '@/components/Table/MyProTable';
import PushModal from '@/pages/Project/Push/PushModal';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useRef } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发’
  const columns: ProColumns[] = [
    {
      title: 'Type',
      dataIndex: 'push_type',
      valueType: 'select',
      valueEnum: {
        1: { text: 'Email', value: 1 },
        2: { text: 'DingTalk', value: 2 },
        3: { text: 'WeChat', value: 3 },
        4: { text: 'WeWork', value: 4 },
      },
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: 'Key',
      dataIndex: 'push_key',
    },
    {
      title: 'Opt',
      valueType: 'option',
    },
  ];
  return (
    <ProCard>
      <MyProTable
        toolBarRender={() => [<PushModal />]}
        actionRef={actionRef}
        columns={columns}
        rowKey={'uid'}
      />
    </ProCard>
  );
};

export default Index;
