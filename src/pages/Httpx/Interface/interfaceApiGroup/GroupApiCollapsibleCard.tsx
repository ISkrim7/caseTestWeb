import { removeInterfaceGroupApis } from '@/api/inter/interGroup';
import MyDrawer from '@/components/MyDrawer';
import InterfaceApiDetail from '@/pages/Httpx/Interface/InterfaceApiDetail';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { UnorderedListOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { message, Space, Tag, Typography } from 'antd';
import { FC, useState } from 'react';

const { Text } = Typography;

interface SelfProps {
  step: number;
  groupId: string;
  interfaceApiInfo?: IInterfaceAPI;
  refresh?: () => void;
}

const GroupApiCollapsibleCard: FC<SelfProps> = ({
  step,
  interfaceApiInfo,
  groupId,
  refresh,
}) => {
  const [showAPIDetail, setShowAPIDetail] = useState(false);
  // 添加空值检查
  if (!interfaceApiInfo?.id) {
    return null; // 或者显示加载状态
  }

  const removeAssociation = async () => {
    const { code, msg } = await removeInterfaceGroupApis({
      groupId: groupId,
      apiId: interfaceApiInfo?.id,
    });
    if (code === 0) {
      message.success(msg);
      refresh?.();
    }
  };

  return (
    <>
      <ProCard
        onClick={() => {
          setShowAPIDetail(true);
        }}
        collapsible={true}
        defaultCollapsed={true}
        collapsibleIconRender={({ collapsed }) => null}
        hoverable
        title={
          <Space>
            <UnorderedListOutlined
              style={{ color: '#c3cad4', marginRight: 10, marginLeft: 10 }}
            />
            <Tag color={'green-inverse'}>Step_{step}</Tag>
            <Tag color={'cyan'}>{interfaceApiInfo?.method}</Tag>
            <Tag color={'cyan'}>{interfaceApiInfo?.name}</Tag>
            <Text type={'secondary'}>{interfaceApiInfo?.url}</Text>
          </Space>
        }
        extra={
          <Space>
            <a onClick={removeAssociation}>解除</a>
          </Space>
        }
      ></ProCard>
      <MyDrawer
        width={'75%'}
        name={''}
        open={showAPIDetail}
        setOpen={setShowAPIDetail}
      >
        {/*<InterfaceApiDetail*/}
        {/*  interfaceId={interfaceApiInfo?.id}*/}
        {/*  callback={() => {}}*/}
        {/*/>*/}
        {/* 确保传递正确的参数 */}
        <InterfaceApiDetail
          interfaceId={interfaceApiInfo.id}
          callback={() => {}}
          addFromCase={false} // 添加缺失的属性
          addFromGroup={true} // 添加缺失的属性
          refresh={() => {}} // 添加缺失的属性
        />
      </MyDrawer>
    </>
  );
};

export default GroupApiCollapsibleCard;
