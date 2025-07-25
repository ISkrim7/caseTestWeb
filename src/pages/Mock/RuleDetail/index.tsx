import { mockApi } from '@/api/mock';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { ArrowLeftOutlined, CopyOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { history, useParams } from '@umijs/max';
import {
  Button,
  Card,
  Descriptions,
  message,
  Modal,
  Space,
  Tabs,
  Tag,
} from 'antd';
import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const MockRuleDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = useParams<{ path?: string; method?: string }>();
  const [rule, setRule] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRule = async () => {
      setLoading(true);
      try {
        const id = searchParams.get('rule_id');
        if (id) {
          const { data } = await mockApi.getMockRuleDetailById(Number(id));
          setRule(data);
        }
      } catch (error) {
        message.error('获取规则详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchRule();
  }, [searchParams]);

  const handleEdit = () => {
    history.push(`/mock/create?id=${rule?.id}`);
  };

  const getMethodColor = (method?: string) => {
    if (!method) return 'default';
    switch (method.toUpperCase()) {
      case 'GET':
        return 'blue';
      case 'POST':
        return 'green';
      case 'PUT':
        return 'orange';
      case 'DELETE':
        return 'red';
      case 'PATCH':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getStatusCodeColor = (statusCode?: number) => {
    if (!statusCode) return 'default';
    if (statusCode >= 200 && statusCode < 300) return 'green';
    if (statusCode >= 300 && statusCode < 400) return 'blue';
    if (statusCode >= 400 && statusCode < 500) return 'orange';
    if (statusCode >= 500) return 'red';
    return 'default';
  };

  return (
    <PageContainer
      loading={loading}
      header={{
        title: rule?.mockname || 'Mock规则详情',
        breadcrumb: {},
        extra: [
          // <Button
          //   key="edit"
          //   type="primary"
          //   icon={<EditOutlined />}
          //   onClick={handleEdit}
          //   style={{ marginRight: 8 }}
          // >
          //   编辑
          // </Button>,
        ],
      }}
    >
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.back()}
            style={{ marginBottom: 16 }}
          >
            返回
          </Button>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="基本信息" key="1">
              <Descriptions title="基本信息" bordered column={2} size="middle">
                <Descriptions.Item label="路径">{rule?.path}</Descriptions.Item>
                <Descriptions.Item label="方法">
                  <Tag color={getMethodColor(rule?.method)}>{rule?.method}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="状态码">
                  <Tag color={getStatusCodeColor(rule?.status_code)}>
                    {rule?.status_code}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="延迟">
                  {rule?.delay ? `${rule.delay}毫秒` : '无'}
                </Descriptions.Item>
                <Descriptions.Item label="描述">
                  {rule?.description || '无'}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={rule?.enable ? 'green' : 'red'}>
                    {rule?.enable ? '已启用' : '已禁用'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="关联接口">
                  {rule?.interface_id ? (
                    <a
                      onClick={() =>
                        history.push(
                          `/interface/interApi/detail/interId=${rule.interface_id}`,
                        )
                      }
                    >
                      {rule.interface_id}
                    </a>
                  ) : (
                    '无'
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="创建人">
                  {rule?.creatorName || '未知'}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {rule?.create_time
                    ? new Date(rule.create_time).toLocaleString()
                    : '未知'}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {rule?.update_time
                    ? new Date(rule.update_time).toLocaleString()
                    : '未知'}
                </Descriptions.Item>
              </Descriptions>
            </Tabs.TabPane>
            <Tabs.TabPane tab="响应内容" key="2">
              <div style={{ marginBottom: 16 }}>
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => {
                    copy(JSON.stringify(rule?.response, null, 2));
                    message.success('已复制响应体到剪贴板');
                  }}
                >
                  复制响应体
                </Button>
              </div>
              <AceCodeEditor
                value={rule?.response}
                readonly
                height="400px"
                _mode="json"
              />
            </Tabs.TabPane>
          </Tabs>
          <Space style={{ marginTop: 16, marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={async () => {
                const key = 'mock-test';
                message.loading({ content: '正在测试Mock...', key });
                // 记录请求开始时间
                const startTime = Date.now();
                try {
                  // 使用axios直接发送请求，同时保留token和X-Mock-Request
                  const axios = require('axios').default;
                  const token = localStorage.getItem('TOKEN') || '';
                  const res = await axios({
                    url: `/mock${rule.path}`,
                    method: rule.method,
                    headers: {
                      'X-Mock-Request': 'true',
                      token: token,
                      ...(rule.headers || {}),
                      'Content-Type': rule.content_type || 'application/json',
                    },
                    withCredentials: true,
                  });
                  // 计算请求耗时
                  const requestCostTime = Date.now() - startTime;
                  // 将耗时添加到响应对象
                  res.requestCostTime = requestCostTime;
                  console.log('实际发送的请求头:', res.config.headers);
                  console.debug('已发送请求头:', {
                    'X-Mock-Request': 'true',
                    ...(rule.headers || {}),
                  });

                  message.success({
                    content: 'Mock测试成功',
                    key,
                    duration: 2,
                  });
                  Modal.info({
                    title: 'Mock响应结果',
                    width: 800,
                    content: (
                      <div>
                        <div style={{ marginBottom: 16 }}>
                          <span style={{ fontWeight: 'bold' }}>状态码: </span>
                          <span
                            style={{
                              color:
                                (res.code || res.status) >= 400
                                  ? '#ff4d4f'
                                  : '#52c41a',
                              fontWeight: 'bold',
                            }}
                          >
                            {res.code || res.status}
                          </span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ fontWeight: 'bold' }}>响应时间: </span>
                          {res.requestCostTime
                            ? `${res.requestCostTime}ms`
                            : '未知'}
                        </div>
                        <pre
                          style={{
                            maxHeight: 400,
                            overflow: 'auto',
                            backgroundColor: '#f5f5f5',
                            padding: 12,
                            borderRadius: 4,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                          }}
                        >
                          {JSON.stringify(res, null, 2)}
                        </pre>
                      </div>
                    ),
                    okText: '关闭',
                    maskClosable: true,
                  });
                } catch (error: any) {
                  // 错误处理中也添加耗时计算
                  const requestCostTime = Date.now() - startTime;
                  message.error({
                    content: `Mock测试失败: ${error.message || '未知错误'}`,
                    key,
                  });
                  Modal.error({
                    title: 'Mock测试失败',
                    width: 800,
                    content: (
                      <div>
                        <span style={{ fontWeight: 'bold' }}>响应时间: </span>
                        {requestCostTime}ms
                        <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                          错误信息:
                        </p>
                        <pre
                          style={{
                            maxHeight: 300,
                            overflow: 'auto',
                            backgroundColor: '#fff2f0',
                            padding: 12,
                            borderRadius: 4,
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {JSON.stringify(
                            error?.response?.data || error?.message || error,
                            null,
                            2,
                          )}
                        </pre>
                        {error?.response?.data?.errorDetails && (
                          <div style={{ marginTop: 16 }}>
                            <p style={{ fontWeight: 'bold' }}>详细错误:</p>
                            <pre
                              style={{
                                maxHeight: 200,
                                overflow: 'auto',
                                backgroundColor: '#fff2f0',
                                padding: 12,
                                borderRadius: 4,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {JSON.stringify(
                                error.response.data.errorDetails,
                                null,
                                2,
                              )}
                            </pre>
                          </div>
                        )}
                      </div>
                    ),
                    okText: '关闭',
                    maskClosable: true,
                  });
                }
              }}
              style={{ marginRight: 8 }}
            >
              测试Mock
            </Button>
            <Button
              onClick={() => {
                const baseUrl = `${window.location.protocol}//${window.location.host}`;
                Modal.info({
                  title: 'Mock URL',
                  content: (
                    <div>
                      <p>请求方法: {rule?.method}</p>
                      {rule?.access_level === 2 ? (
                        <>
                          <p>
                            请求URL: {baseUrl}/mock{rule?.path}
                          </p>
                          <p>
                            公共请求URL: {baseUrl}/mockpublic{rule?.path}
                          </p>
                        </>
                      ) : (
                        <p>
                          请求URL: {baseUrl}/mock{rule?.path}
                        </p>
                      )}
                      <p>请求头: X-Mock-Request: true</p>
                      <p>可以直接复制到Postman等工具中测试</p>
                    </div>
                  ),
                });
              }}
            >
              查看Mock URL
            </Button>
          </Space>
          <Tabs>
            {rule?.headers && (
              <Tabs.TabPane tab="响应头" key="headers">
                <AceCodeEditor
                  value={rule.headers}
                  readonly
                  height="300px"
                  _mode="json"
                />
              </Tabs.TabPane>
            )}
            {rule?.script && (
              <Tabs.TabPane tab="脚本" key="script">
                <AceCodeEditor
                  value={rule.script}
                  readonly
                  height="300px"
                  _mode="javascript"
                />
              </Tabs.TabPane>
            )}
            {rule?.cookies && (
              <Tabs.TabPane tab="Cookies" key="cookies">
                <AceCodeEditor
                  value={rule.cookies}
                  readonly
                  height="300px"
                  _mode="json"
                />
              </Tabs.TabPane>
            )}
            {rule?.content_type && (
              <Tabs.TabPane tab="内容类型" key="contentType">
                <Tag color="blue">{rule.content_type}</Tag>
              </Tabs.TabPane>
            )}
            {rule?.params && (
              <Tabs.TabPane tab="请求参数" key="params">
                <AceCodeEditor
                  value={rule.params}
                  readonly
                  height="300px"
                  _mode="json"
                />
              </Tabs.TabPane>
            )}
            {rule?.request_headers && (
              <Tabs.TabPane tab="请求头" key="requestHeaders">
                <AceCodeEditor
                  value={rule.request_headers}
                  readonly
                  height="300px"
                  _mode="json"
                />
              </Tabs.TabPane>
            )}
          </Tabs>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default MockRuleDetail;
