import MockLinkInterface from '@/pages/Mock/LinkInterface';
import MockRuleList from '@/pages/Mock/RuleList';
import MockStatus from '@/pages/Mock/Status';
import { PageContainer } from '@ant-design/pro-components';
import { useLocation, useNavigate } from '@umijs/max';
import { Card } from 'antd';
import React from 'react';

const MockManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveKey = () => {
    if (location.pathname.includes('rules')) return 'rules';
    if (location.pathname.includes('status')) return 'status';
    return 'interfaces';
  };

  const renderContent = () => {
    switch (getActiveKey()) {
      case 'rules':
        return <MockRuleList />;
      case 'interfaces':
        const queryParams = new URLSearchParams(location.search);
        const interfaceId = queryParams.get('interfaceId') || '';
        const interfaceName = queryParams.get('interfaceName') || '';
        return (
          <MockLinkInterface
            interfaceId={interfaceId}
            interfaceName={interfaceName}
          />
        );
      case 'status':
        return <MockStatus />;
      default:
        return <MockRuleList />;
    }
  };

  return (
    <PageContainer
      title="Mock管理"
      tabList={[
        {
          tab: '状态监控',
          key: 'status',
        },
        {
          tab: '规则管理',
          key: 'rules',
        },
        {
          tab: 'Mock接口列表',
          key: 'interfaces',
        },
      ]}
      tabActiveKey={getActiveKey()}
      onTabChange={(key) => {
        if (key === 'rules') {
          navigate('/mock/rules');
        } else if (key === 'status') {
          navigate('/mock/status');
        } else {
          navigate('/mock/interfaces');
        }
      }}
    >
      <Card>{renderContent()}</Card>
    </PageContainer>
  );
};

export default MockManagement;
