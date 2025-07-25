import { IMockRule, mockApi } from '@/api/mock';
import MockCreateRule from '@/pages/Mock/CreateRule';
import {
  DeleteOutlined,
  DownOutlined,
  GlobalOutlined,
  LockOutlined,
  PlusOutlined,
  UnlockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import {
  Button,
  Card,
  Dropdown,
  MenuProps,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Tag,
} from 'antd'; // 合并导入并添加缺失组件
import React, { useCallback, useEffect, useRef, useState } from 'react'; // 添加useEffect
import { history, useModel } from 'umi';

// 修正后的类型（统一enabled字段）
type ApiMockRule = Omit<IMockRule, 'enable'> & {
  enable?: boolean;
  interface_id?: number;
  status_code?: number;
  access_level?: number; // 0-仅创建者, 1-登录用户, 2-公开访问
};

type RuleState = {
  id: number;
  enabled: boolean;
  loading: boolean;
};

const MockRuleList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser || {
    id: 0,
    username: '未知用户',
  };

  const { data: status, refresh: refreshStatus } = useRequest(
    mockApi.getStatus,
  );
  const [loading, setLoading] = useState(false);
  const [mockConfig, setMockConfig] = useState({
    enabled: false,
    require_mock_flag: true,
    browser_friendly: true,
  });

  const { run: fetchMockConfig } = useRequest(mockApi.getConfig, {
    manual: true,
    onSuccess: (res) => res.data && setMockConfig(res.data),
    onError: () => message.error('获取Mock配置失败'),
  });

  const { run: updateMockConfig } = useRequest(mockApi.updateConfig, {
    manual: true,
    onSuccess: () => {
      message.success('配置更新成功');
      fetchMockConfig();
    },
    onError: () => message.error('配置更新失败'),
  });

  useEffect(() => {
    fetchMockConfig();
  }, []);

  const { run: toggleMock } = useRequest(
    async (enabled: boolean) =>
      enabled ? mockApi.enable() : mockApi.disable(),
    {
      manual: true,
      onSuccess: (_, [enabled]) => {
        message.success(
          `${enabled ? '启用' : '禁用'}成功 (${currentUser.username})`,
        );
        refreshStatus();
        fetchMockConfig();
      },
      onError: () => {
        message.error(`操作失败 (${currentUser.username})`);
        refreshStatus();
      },
    },
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<ApiMockRule[]>([]);
  const actionRef = useRef<ActionType>();
  const [ruleStates, setRuleStates] = useState<Record<number, RuleState>>({});
  const [formVisible, setFormVisible] = useState(false);
  const [currentRule, setCurrentRule] = useState<ApiMockRule>();

  const updateRuleState = useCallback(
    (id: number, state: Partial<RuleState>) => {
      setRuleStates((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || { id, enabled: false, loading: false }),
          ...state,
        },
      }));
    },
    [],
  );

  const clearRuleState = useCallback((id: number) => {
    setRuleStates((prev) => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  }, []);

  const toggleRuleState = useCallback(
    async (id: number, newState: boolean, record: ApiMockRule) => {
      const ruleId = Number(id);
      updateRuleState(ruleId, { enabled: newState, loading: true });

      try {
        await mockApi.toggleRule(ruleId, newState);
        clearRuleState(ruleId);
        message.success(
          newState
            ? `规则已启用 (${currentUser.username})`
            : `规则已禁用 (${currentUser.username})`,
        );
        actionRef.current?.reloadAndRest?.();
      } catch (error) {
        updateRuleState(ruleId, { enabled: record.enabled, loading: false });
        message.error('状态切换失败');
      }
    },
    [updateRuleState, clearRuleState, currentUser.username],
  );

  const columns: ProColumns<ApiMockRule, 'text'>[] = [
    // ...列定义保持不变（已优化）
    {
      title: '规则名称',
      dataIndex: 'mockname',
      key: 'mockname',
      search: true,
      width: 150,
    },
    {
      title: '关联接口',
      dataIndex: 'interface_id',
      key: 'interface_id',
      hideInSearch: true,
      width: 120,
      render: (_, record) => (
        <span style={{ color: record.interface_id ? '#79cb53' : '#999' }}>
          {record.interface_id ? '已关联' : '未关联'}
        </span>
      ),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      search: true,
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 80,
      search: true,
      render: (_, record) => (
        <span style={{ textTransform: 'uppercase' }}>{record.method}</span>
      ),
      valueEnum: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        PATCH: 'PATCH',
      },
    },
    {
      title: '状态',
      width: 80,
      hideInSearch: true,
      render: (_, record) => {
        const ruleId = Number(record.id);
        const state = ruleStates[ruleId];
        const isEnabled = state ? state.enabled : record.enable;
        const isLoading = state?.loading || false;

        return (
          <Space align="center">
            <Switch
              checked={isEnabled}
              loading={isLoading}
              onChange={(newState) => toggleRuleState(ruleId, newState, record)}
              checkedChildren="启用"
              unCheckedChildren="禁用"
              style={{
                minWidth: 60,
                backgroundColor: isEnabled ? '#52c41a' : undefined,
              }}
            />
            {/*<Tag color={isEnabled ? 'green' : 'red'} style={{ marginLeft: 8, borderRadius: 4 }}>*/}
            {/*  {isEnabled ? '运行中' : '已禁用'}*/}
            {/*</Tag>*/}
          </Space>
        );
      },
    },
    // ====== 新增访问级别列 ======
    {
      title: '访问级别',
      dataIndex: 'access_level',
      key: 'access_level',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        const level = record.access_level ?? 0;
        const levelMap = {
          0: { text: '仅创建者', color: 'geekblue', icon: <LockOutlined /> },
          1: { text: '登录用户', color: 'blue', icon: <UserOutlined /> },
          2: { text: '公开访问', color: 'green', icon: <GlobalOutlined /> },
        };
        const { text, color, icon } =
          levelMap[level as keyof typeof levelMap] || levelMap[0];

        return (
          <Tag
            icon={icon}
            color={color}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              borderRadius: 4,
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    // ========================
    {
      title: '状态码',
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 70,
      hideInSearch: true,
      valueType: 'digit',
      render: (_, record) => {
        const code = record.status_code ?? 200;
        const color = code >= 400 ? 'red' : code >= 300 ? 'orange' : 'green';
        return <Tag color={color}>{code}</Tag>;
      },
      fieldProps: {
        precision: 0,
        min: 100,
        max: 599,
        formatter: (value: string) => (value ?? 200).toString(),
        parser: (value: string) => {
          const num = parseInt(value);
          return isNaN(num) ? 200 : Math.max(100, Math.min(599, num));
        },
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      hideInSearch: true,
      // render: (_, record) => (
      //   <Space>
      //     <a onClick={() => history.push(`/mock/detail?rule_id=${record.id}`)}>详情</a>
      //     <a onClick={() => {
      //       setCurrentRule({ ...record, enabled: record.enabled });
      //       setFormVisible(true);
      //     }}>编辑</a>
      //     <Popconfirm
      //       title="确认删除"
      //       description="确定要删除这条Mock规则吗？"
      //       onConfirm={async () => {
      //         try {
      //           await mockApi.delete(Number(record.id));
      //           message.success('删除成功');
      //           clearRuleState(Number(record.id));
      //           actionRef.current?.reloadAndRest?.();
      //         } catch {
      //           message.error('删除失败');
      //         }
      //       }}
      //     >
      //       <a>删除</a>
      //     </Popconfirm>
      //   </Space>
      // ),
      render: (_, record) => {
        // === 新增访问级别修改功能 ===
        const handleUpdateAccessLevel = async (level: number) => {
          try {
            await mockApi.update({
              ...record,
              id: record.id,
              access_level: level,
            } as ApiMockRule);
            message.success('访问级别已更新');
            actionRef.current?.reloadAndRest?.();
          } catch (error) {
            message.error('更新访问级别失败');
          }
        };

        const accessLevelMenuItems: MenuProps['items'] = [
          {
            key: '0',
            label: '仅创建者',
            icon: <LockOutlined />,
            onClick: () => handleUpdateAccessLevel(0),
          },
          {
            key: '1',
            label: '登录用户',
            icon: <UnlockOutlined />,
            onClick: () => handleUpdateAccessLevel(1),
          },
          {
            key: '2',
            label: '公开访问',
            icon: <GlobalOutlined />,
            onClick: () => handleUpdateAccessLevel(2),
          },
        ];

        return (
          <Space>
            <a
              onClick={() => history.push(`/mock/detail?rule_id=${record.id}`)}
            >
              详情
            </a>
            <a
              onClick={() => {
                setCurrentRule({ ...record, enabled: record.enabled });
                setFormVisible(true);
              }}
            >
              编辑
            </a>

            {/* === 新增权限下拉菜单 === */}
            <Dropdown
              menu={{ items: accessLevelMenuItems }}
              trigger={['click']}
              placement="bottomRight"
              overlayStyle={{ minWidth: 140 }}
            >
              <a onClick={(e) => e.preventDefault()}>
                权限 <DownOutlined />
              </a>
            </Dropdown>

            <Popconfirm
              title="确认删除"
              description="确定要删除这条Mock规则吗？"
              onConfirm={async () => {
                try {
                  await mockApi.delete(Number(record.id));
                  message.success('删除成功');
                  clearRuleState(Number(record.id));
                  actionRef.current?.reloadAndRest?.();
                } catch {
                  message.error('删除失败');
                }
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: 12,
          background: '#f0f2f5',
          borderRadius: 4,
        }}
      >
        <Space>
          <UserOutlined />
          <span>当前用户: {currentUser.username}</span>
          <Tag color="blue">ID: {currentUser.id}</Tag>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card
            title="Mock功能配置"
            bordered={false}
            size="small"
            extra={
              <Tag color={mockConfig.enabled ? 'green' : 'red'}>
                {mockConfig.enabled ? '配置已生效' : '配置未生效'}
              </Tag>
            }
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Switch
                  checked={mockConfig.enabled}
                  onChange={async (v) => {
                    const newConfig = { enabled: v };
                    await updateMockConfig(newConfig);
                  }}
                  loading={loading}
                />
                <div>
                  <div style={{ fontWeight: 500 }}>全局Mock开关</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    控制所有Mock功能的启用状态
                  </div>
                </div>
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Switch
                  checked={mockConfig.require_mock_flag}
                  onChange={(v) => updateMockConfig({ require_mock_flag: v })}
                  disabled={!mockConfig.enabled || loading}
                />
                <div>
                  <div style={{ fontWeight: 500 }}>需要Mock请求头</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    需添加 X-Mock-Request: true
                  </div>
                </div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Switch
                  checked={mockConfig.browser_friendly}
                  onChange={(v) => updateMockConfig({ browser_friendly: v })}
                  disabled={!mockConfig.enabled || loading}
                />
                <div>
                  <div style={{ fontWeight: 500 }}>浏览器友好模式</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    返回友好的错误提示
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRule({
                mockname: '',
                path: '',
                method: 'GET',
                status_code: 200,
                response: {},
                enabled: true,
              });
              setFormVisible(true);
            }}
          >
            新建规则
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除选中的${selectedRowKeys.length}条规则吗？`}
            onConfirm={async () => {
              try {
                await mockApi.batchDelete(
                  selectedRows.map((row) => Number(row.id)),
                );
                message.success(`成功删除${selectedRowKeys.length}条规则`);
                selectedRows.forEach((row) => clearRuleState(Number(row.id)));
                setSelectedRowKeys([]);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              } catch {
                message.error('删除失败');
              }
            }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
            >
              批量删除
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <ProTable
        actionRef={actionRef}
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: (newKeys, newRows) => {
            setSelectedRowKeys(newKeys);
            setSelectedRows(newRows);
          },
        }}
        columns={columns}
        request={async (params) => {
          try {
            const { current: page = 1, pageSize: size = 10, ...rest } = params;
            const response = await mockApi.getList({
              page,
              size,
              userId: currentUser.id,
              ...rest,
            });
            return {
              data: response.data.items,
              total: response.data.total,
              success: true,
            };
          } catch (error) {
            console.error('获取Mock规则列表失败:', error);
            return { data: [], total: 0, success: false };
          }
        }}
        rowKey="id"
        pagination={{ showSizeChanger: true }}
      />

      <Modal
        title={currentRule?.id ? '编辑Mock规则' : '新建Mock规则'}
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
        width="80%"
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <MockCreateRule
            interId={currentRule?.interface_id || 0}
            initialValues={currentRule}
            onCancel={() => setFormVisible(false)}
            onSuccess={() => {
              actionRef.current?.reload();
              setFormVisible(false);
            }}
            onError={(error: any) => {
              message.error(
                error.response?.data?.message || error.message || '操作失败',
              );
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default MockRuleList;
