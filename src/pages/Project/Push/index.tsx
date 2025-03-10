import { pagePushConfig } from '@/api/base/pushConfig';
import MyProTable from '@/components/Table/MyProTable';
import PushModal from '@/pages/Project/Push/PushModal';
import { pageData } from '@/utils/somefunc';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useCallback, useRef } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>();

  const pageConfig = useCallback(async (values: any) => {
    const { code, data } = await pagePushConfig(values);
    return pageData(code, data);
  }, []);
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
      title: 'Value',
      dataIndex: 'push_value',
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
        request={pageConfig}
        columns={columns}
        rowKey={'uid'}
      />
    </ProCard>
  );
};

export default Index;
