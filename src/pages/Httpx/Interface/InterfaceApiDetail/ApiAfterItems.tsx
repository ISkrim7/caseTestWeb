import MyTabs from '@/components/MyTabs';
import InterAfterScript from '@/pages/Httpx/componets/InterAfterScript';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { SettingOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { FormInstance, TabsProps, Tooltip } from 'antd';
import { FC } from 'react';

interface SelfProps {
  interApiForm: FormInstance<IInterfaceAPI>;
  currentMode: number;
}

const ApiAfterItems: FC<SelfProps> = (props) => {
  const { interApiForm, currentMode } = props;

  const AfterItems: TabsProps['items'] = [
    {
      key: '1',
      label: <Tooltip title="依次执行 设置变量、脚本、SQL">前置操作</Tooltip>,
      icon: <SettingOutlined />,
      children: <InterAfterScript form={interApiForm} mode={currentMode} />,
    },
  ];
  return (
    <ProCard style={{ marginTop: 10 }} bodyStyle={{ padding: 0 }}>
      <MyTabs tabPosition={'left'} items={AfterItems} defaultActiveKey={'1'} />
    </ProCard>
  );
};

export default ApiAfterItems;
