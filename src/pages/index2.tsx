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
          <Card title="重点关注" bordered={false}>
            <Title level={5}>场景一：接口测试</Title>
            <Paragraph>
              在接口测试中设置的全局变量参数，接口中用{'{{}}'}引用变量，
              实现测试与开发的平滑过渡。
            </Paragraph>

            <Title level={5}>场景二：可使用内置函数设置变量</Title>
            <Paragraph>
              接口测试内置函数，如:获取时间戳\获取日期。{'举例：\n'}
              {'from datetime import datetime\n'}
              {'ts=timestamp()\n'}
              {"ts1=timestamp('+1h')\n"}
              {
                'dt_object = datetime.fromtimestamp(ts)  # 转换为 datetime 对象\n'
              }
              {
                'dt_object1 = datetime.fromtimestamp(ts1)  # 转换为 datetime 对象\n'
              }
              {
                "date_str = dt_object.strftime('%Y-%m-%d %H:%M:%S')  # 输出：2025-01-01 00:00:00\n"
              }
              {
                "date_str1 = dt_object1.strftime('%Y-%m-%d %H:%M:%S')  # 输出：2025-01-01 00:01:00"
              }
            </Paragraph>

            <Title level={5}>场景三：支持前置脚本/后置脚本</Title>
            <Paragraph>
              典型用途： - 修改参数数据 - 根据参数动态生成响应 - 记录请求日志 -
              数据格式转换
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
