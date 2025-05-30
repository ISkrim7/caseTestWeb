import MyTabs from '@/components/MyTabs';
import InterAfterScript from '@/pages/Httpx/componets/InterAfterScript';
import InterAfterSql from '@/pages/Httpx/componets/InterAfterSql'; // 新增
import { IInterfaceAPI } from '@/pages/Httpx/types';
import {
  DatabaseOutlined,
  EditOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
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
      label: <Tooltip title="依次执行 设置变量、脚本、SQL">后置脚本</Tooltip>,
      icon: <EditOutlined />,
      children: <InterAfterScript form={interApiForm} mode={currentMode} />,
    },
    {
      key: '2',
      label: <Tooltip title="只适用于业务场景中,调试不生效">等待</Tooltip>,
      icon: <FieldTimeOutlined />,
      children: null,
    },
    // 新增SQL标签页
    {
      key: '3',
      label: <Tooltip title="执行数据库操作并提取变量">后置SQL</Tooltip>,
      icon: <DatabaseOutlined />,
      children: <InterAfterSql form={interApiForm} />,
    },
  ];
  return (
    <ProCard
      bodyStyle={{
        padding: 0,
      }}
    >
      <MyTabs tabPosition={'left'} items={AfterItems} defaultActiveKey={'1'} />
    </ProCard>
  );
};

export default ApiAfterItems;
