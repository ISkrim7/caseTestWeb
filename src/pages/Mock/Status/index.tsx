import { getMockStatus, toggleMockService } from '@/api/mock';
import { Pie } from '@ant-design/charts';
import { useRequest } from 'ahooks';
import { Card, Col, message, Row, Statistic, Switch } from 'antd';
import React from 'react';

const MockStatus: React.FC = () => {
  const { data: statusResponse, run: refreshStatus } =
    useRequest(getMockStatus);
  const status = statusResponse?.data ?? {
    enabled: false,
    totalRequests: 0,
    activeRules: 0,
  };
  const { run: toggleMock } = useRequest(toggleMockService, {
    manual: true,
    onSuccess: () => refreshStatus(),
  });

  const data = [
    { type: '活跃规则', value: status.activeRules },
    { type: '总请求数', value: status.totalRequests },
  ];

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Mock服务状态"
              value={status?.enabled ? '已启用' : '已禁用'}
            />
            <Switch
              checked={status?.enabled}
              onChange={(checked) => {
                toggleMock(checked);
                message.success(`Mock服务已${checked ? '启用' : '禁用'}`);
              }}
              style={{ marginTop: 16 }}
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="活跃规则数" value={status?.activeRules || 0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="总请求数" value={status?.totalRequests || 0} />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }}>
        <Pie {...config} />
      </Card>
    </div>
  );
};

export default MockStatus;
