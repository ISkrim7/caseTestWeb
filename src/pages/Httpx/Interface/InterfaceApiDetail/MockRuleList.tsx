import MockCreateRule from '@/pages/Mock/CreateRule';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Empty,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useNavigate } from 'umi';

import type { IResponse } from '@/api';
import { detailInterApiById } from '@/api/inter';
import type { IMockRule } from '@/api/mock';
import { mockApi } from '@/api/mock';
import { useRequest } from 'ahooks';

interface MockRuleListProps {
  interfaceId: string;
}

const MockRuleList: React.FC<MockRuleListProps> = ({ interfaceId }) => {
  const navigate = useNavigate();
  const {
    data: _rules,
    loading,
    run: refresh,
  } = useRequest<IResponse<IMockRule[]>, []>(
    () => mockApi.getListByInterfaceId(Number(interfaceId)),
    {
      refreshDeps: [interfaceId],
      onSuccess: (data) => {
        setFilteredRules(data?.data || []);
      },
    },
  );
  const rules: IMockRule[] = _rules?.data || [];
  const { data: mockStatus, run: toggleService } = useRequest<
    IResponse<{ enabled: boolean }>,
    [boolean]
  >((enabled: boolean) => mockApi.toggle(enabled), { manual: true });
  const mockEnabled = mockStatus?.data?.enabled || false;

  const handleBatchToggle = async (enabled: boolean) => {
    try {
      await Promise.all(
        selectedRowKeys.map((id) => {
          const rule = rules.find((r) => r.id === id);
          return (
            rule &&
            mockApi.update({
              ...rule,
              enabled,
            })
          );
        }),
      );
      setSelectedRowKeys([]);
      refresh();
      message.success(
        `已${enabled ? '启用' : '禁用'} ${selectedRowKeys.length} 条规则`,
      );
    } catch {
      message.error('操作失败');
    }
  };

  const handleBatchDelete = async () => {
    try {
      await mockApi.batchDelete(selectedRowKeys.map((id) => Number(id)));
      setSelectedRowKeys([]);
      refresh();
      message.success(`已删除 ${selectedRowKeys.length} 条规则`);
    } catch {
      message.error('删除失败');
    }
  };

  const [searchValue, setSearchValue] = React.useState('');
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [filteredRules, setFilteredRules] = React.useState<IMockRule[]>([]);

  React.useEffect(() => {
    const newFilteredRules = searchValue
      ? rules.filter(
          (rule: IMockRule) =>
            rule.mockname.toLowerCase().includes(searchValue.toLowerCase()) ||
            rule.path.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : [...rules];

    setFilteredRules(newFilteredRules);
  }, [rules, searchValue]);

  const [formVisible, setFormVisible] = React.useState(false);
  const [currentRule, setCurrentRule] = React.useState<IMockRule>();

  React.useEffect(() => {
    if (rules.length === 0 && !localStorage.getItem('mock_guide_shown')) {
      message.info({
        content: '这是您第一次使用Mock功能，点击下方按钮创建规则',
        duration: 5,
        key: 'mock_guide',
      });
      localStorage.setItem('mock_guide_shown', 'true');
    }
  }, [rules.length]);

  const columns: ColumnsType<IMockRule> = [
    {
      title: '规则名称',
      dataIndex: 'mockname',
      key: 'mockname',
      width: 200,
      render: (text, record) => (
        <Tooltip title={record.description}>
          <span>{text || '未命名规则'}</span>
        </Tooltip>
      ),
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method) => (
        <Tag color="blue" style={{ textTransform: 'uppercase' }}>
          {method}
        </Tag>
      ),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: '状态码',
      dataIndex: 'status_code',
      key: 'status_code',
      width: 100,
      render: (code) => (
        <Tag color={code >= 400 ? 'red' : code >= 300 ? 'orange' : 'green'}>
          {code || 200}
        </Tag>
      ),
    },
    {
      title: '延迟(ms)',
      dataIndex: 'delay',
      key: 'delay',
      render: (delay?: number) => (delay !== undefined ? `${delay}ms` : '-'),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled, record) => (
        <Switch
          checked={enabled}
          onChange={async (checked) => {
            await mockApi.update({
              id: record.id,
              ...record,
              enabled: checked,
            });
            refresh();
          }}
          disabled={!mockEnabled}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => {
              // 添加调试日志
              console.log(
                '编辑按钮点击，规则ID:',
                record.id,
                '规则名称:',
                record.mockname,
                '完整规则对象:',
                JSON.stringify(record, null, 2),
              );
              setCurrentRule({ ...record });
              setFormVisible(true);
            }}
          >
            编辑
          </Button>
          {/*<Button*/}
          {/*  type="link"*/}
          {/*  size="small"*/}
          {/*  onClick={() => {*/}
          {/*    setCurrentRule({*/}
          {/*      ...record,*/}
          {/*      id: undefined,*/}
          {/*      mockname: `${record.mockname}-副本`*/}
          {/*    });*/}
          {/*    setFormVisible(true);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  复制*/}
          {/*</Button>*/}
          <Popconfirm
            title="确定删除此规则吗?"
            onConfirm={async () => {
              await mockApi.delete(Number(record.id));
              refresh();
            }}
          >
            <Button type="text" danger size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <span>Mock规则管理</span>
          {/*<Tooltip title={`Mock服务${mockEnabled ? '已启用' : '已禁用'}`}>*/}
          {/*  <Button*/}
          {/*    type="text"*/}
          {/*    icon={<PoweroffOutlined />}*/}
          {/*    onClick={async () => {*/}
          {/*      await toggleService(!mockEnabled);*/}
          {/*      refresh();*/}
          {/*    }}*/}
          {/*    danger={!mockEnabled}*/}
          {/*  >*/}
          {/*    {mockEnabled ? '禁用Mock服务' : '启用Mock服务'}*/}
          {/*  </Button>*/}
          {/*</Tooltip>*/}
        </Space>
      }
      extra={
        <Space>
          <Space.Compact>
            <Input.Search
              placeholder="搜索规则名称/路径"
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 200 }}
            />
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'active',
                    label: '仅启用',
                    onClick: () =>
                      setFilteredRules(
                        rules.filter((rule: IMockRule) => rule.enabled),
                      ),
                  },
                  {
                    key: 'inactive',
                    label: '仅禁用',
                    onClick: () =>
                      setFilteredRules(
                        rules.filter((rule: IMockRule) => !rule.enabled),
                      ),
                  },
                  {
                    key: 'delayed',
                    label: '延迟>500ms',
                    onClick: () =>
                      setFilteredRules(
                        rules.filter(
                          (rule: IMockRule) => rule.delay && rule.delay > 500,
                        ),
                      ),
                  },
                  {
                    key: 'clear',
                    label: '清除筛选',
                    onClick: () => setFilteredRules(rules),
                  },
                ],
              }}
            >
              <Button icon={<FilterOutlined />} />
            </Dropdown>
          </Space.Compact>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={async () => {
              try {
                console.log('Fetching interface details for ID:', interfaceId);
                const { data: interfaceDetail } = await detailInterApiById({
                  interfaceId,
                });

                if (
                  !interfaceDetail ||
                  !interfaceDetail.url ||
                  !interfaceDetail.method
                ) {
                  throw new Error('Invalid interface detail response');
                }

                const mockRule: IMockRule = {
                  interface_id: Number(interfaceId),
                  mockname: interfaceDetail.name
                    ? `${interfaceDetail.name}-Mock`
                    : 'New-Mock-Rule',
                  path: interfaceDetail.url,
                  method: interfaceDetail.method,
                  status_code: 200,
                  response: interfaceDetail.data || {},
                  enabled: true,
                  headers: interfaceDetail.headers || [],
                  params: interfaceDetail.params || [],
                  data: interfaceDetail.data || [],
                  body: interfaceDetail.body || {},
                  body_type: interfaceDetail.body_type || 0,
                  raw_type: interfaceDetail.raw_type || 'json',
                  description: interfaceDetail.description || '',
                  delay: 0,
                  cookies: {},
                };

                console.log('Setting mock rule with:', mockRule);
                setCurrentRule(mockRule);
                setFormVisible(true);
              } catch (error: unknown) {
                console.error('Failed to get interface details:', error);
                const errorMessage =
                  error instanceof Error ? error.message : 'Unknown error';
                message.error(`获取接口详情失败: ${errorMessage}`);
                setCurrentRule({
                  interface_id: Number(interfaceId),
                  mockname: '',
                  path: '',
                  method: 'GET',
                  status_code: 200,
                  response: {},
                  enabled: true,
                });
                setFormVisible(true);
              }
            }}
            disabled={loading}
          >
            新增规则
          </Button>
          {/*<Button*/}
          {/*  icon={<ImportOutlined />}*/}
          {/*  onClick={() => {*/}
          {/*    const input = document.createElement('input');*/}
          {/*    input.type = 'file';*/}
          {/*    input.accept = '.json';*/}
          {/*    input.onchange = async (e) => {*/}
          {/*      const file = (e.target as HTMLInputElement).files?.[0];*/}
          {/*      if (file) {*/}
          {/*        try {*/}
          {/*          await mockApi.import(file);*/}
          {/*          refresh();*/}
          {/*          message.success('导入成功');*/}
          {/*        } catch {*/}
          {/*          message.error('导入失败');*/}
          {/*        }*/}
          {/*      }*/}
          {/*    };*/}
          {/*    input.click();*/}
          {/*  }}*/}
          {/*>*/}
          {/*  导入*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  icon={<DownloadOutlined />}*/}
          {/*  onClick={async () => {*/}
          {/*    try {*/}
          {/*      await mockApi.export();*/}
          {/*      message.success('导出成功');*/}
          {/*    } catch {*/}
          {/*      message.error('导出失败');*/}
          {/*    }*/}
          {/*  }}*/}
          {/*>*/}
          {/*  导出*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  type="link"*/}
          {/*  onClick={() => navigate(`/management/mock?interfaceId=${interfaceId}`)}*/}
          {/*>*/}
          {/*  管理全部规则*/}
          {/*</Button>*/}
          {selectedRowKeys.length > 0 && (
            <Space>
              <Button
                onClick={() => handleBatchToggle(true)}
                disabled={!mockEnabled}
              >
                批量启用
              </Button>
              <Button
                onClick={() => handleBatchToggle(false)}
                disabled={!mockEnabled}
              >
                批量禁用
              </Button>
              <Popconfirm
                title="确定删除选中规则吗?"
                onConfirm={handleBatchDelete}
              >
                <Button danger>批量删除</Button>
              </Popconfirm>
            </Space>
          )}
        </Space>
      }
      loading={loading}
    >
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        columns={columns}
        dataSource={filteredRules}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条规则`,
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  暂无Mock规则
                  {/*<a*/}
                  {/*  onClick={() => {*/}
                  {/*    setCurrentRule({*/}
                  {/*      interface_id: Number(interfaceId),*/}
                  {/*      mockname: '',*/}
                  {/*      path: '',*/}
                  {/*      method: 'GET',*/}
                  {/*      status_code: 200,*/}
                  {/*      response: {},*/}
                  {/*      enabled: true,*/}
                  {/*    });*/}
                  {/*    setFormVisible(true);*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  点击创建*/}
                  {/*</a>*/}
                </span>
              }
            />
          ),
        }}
      />
      {formVisible && (
        <Modal
          title={currentRule?.id ? '编辑Mock规则' : '创建Mock规则'}
          open={formVisible}
          footer={null}
          onCancel={() => setFormVisible(false)}
          width="80%"
          style={{ top: 20 }}
          destroyOnClose
        >
          <MockCreateRule
            interId={Number(interfaceId)}
            initialValues={currentRule}
            onCancel={() => setFormVisible(false)}
            onSuccess={() => {
              refresh();
              setFormVisible(false);
            }}
          />
        </Modal>
      )}
    </Card>
  );
};

export default MockRuleList;
