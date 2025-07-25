import { Card, Col, Row, Space, Steps, Typography } from 'antd';
import React from 'react';
import { useLocation } from 'umi';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

interface MockLinkInterfaceProps {
  interfaceId?: string;
  interfaceName?: string;
}

const MockLinkInterface: React.FC<MockLinkInterfaceProps> = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const interfaceId = queryParams.get('interfaceId');

  return (
    <div style={{ padding: 24 }}>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={3}>Mock & 接口测试集成指南</Title>
        <Paragraph>
          平台将Mock功能与接口测试集成，支持一键从接口测试创建Mock规则，或从Mock跳转到对应接口测试。
        </Paragraph>
        {/*{interfaceId && (*/}
        {/*  <Button*/}
        {/*    type="primary"*/}
        {/*    onClick={() => history.push(`/httpx/interface/detail?id=${interfaceId}`)}*/}
        {/*    style={{ marginTop: 16 }}*/}
        {/*  >*/}
        {/*    返回接口测试详情*/}
        {/*  </Button>*/}
        {/*)}*/}
      </Card>

      <Row gutter={24}>
        <Col span={12}>
          <Card title="快速入门" bordered={false} style={{ marginBottom: 24 }}>
            <Steps direction="vertical" current={-1}>
              <Step
                title="从接口测试创建Mock"
                description={
                  <Space direction="vertical">
                    <Text>1. 在接口测试详情页-Mock管理点击"创建Mock"按钮</Text>
                    <Text>2. 系统自动填充接口信息</Text>
                    <Text>3. 自定义响应内容和状态码</Text>
                    {/*<Button*/}
                    {/*  type="primary"*/}
                    {/*  onClick={() => history.push('/httpx/interface')}*/}
                    {/*  style={{ marginTop: 8 }}*/}
                    {/*>*/}
                    {/*  去接口测试*/}
                    {/*</Button>*/}
                  </Space>
                }
              />
              <Step
                title="独立创建Mock"
                description={
                  <Space direction="vertical">
                    <Text>1. 独立创建要mock的接口</Text>
                    <Text>2. 填写规则名称、请求方法和路径等</Text>
                    <Text>3. 设置响应内容和状态码</Text>
                  </Space>
                }
              />
              <Step
                title="管理Mock规则"
                description={
                  <Space direction="vertical">
                    <Text>1. 在规则列表中可以启用/禁用规则</Text>
                    <Text>2. 可以支持传入Mock请求头</Text>
                    <Text>3. 支持浏览器非登录状态公共接口访问</Text>
                  </Space>
                }
              />
            </Steps>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最佳实践" bordered={false}>
            <Title level={5}>场景一：接口测试与Mock联动</Title>
            <Paragraph>
              在接口测试中直接创建Mock规则，测试完成后可一键切换到Mock环境，
              实现测试与开发的平滑过渡。
            </Paragraph>

            <Title level={5}>场景二：测试用例自动化Mock</Title>
            <Paragraph>
              将接口测试用例自动转换为Mock规则，方便重复测试和异常场景模拟。
            </Paragraph>

            <Title level={5}>场景三：团队协作</Title>
            <Paragraph>
              开发人员创建的Mock规则可直接用于测试人员的接口测试，
              确保团队使用统一的接口规范。
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Card title="常见问题" bordered={false} style={{ marginTop: 24 }}>
        <Typography>
          <Title level={5}>Q: Mock规则优先级如何确定？</Title>
          <Paragraph>
            系统会确保全局开关状态与其他配置项匹配的原则，匹配路径和方法完全一致的规则，
            确保启用对应的全局Mock开关/需要Mock请求头/浏览器友好模式按钮。
          </Paragraph>

          <Title level={5}>Q: 如何调试Mock规则？</Title>
          <Paragraph>
            可以在"Mock管理"-规则管理-详情页面-查看请求URL，了解Mock规则的匹配情况。
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default MockLinkInterface;
