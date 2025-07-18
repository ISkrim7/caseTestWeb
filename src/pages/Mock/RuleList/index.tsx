import { IMockRule, mockApi } from '@/api/mock';
import MockCreateRule from '@/pages/Mock/CreateRule';
import { DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, message, Popconfirm, Space, Switch, Tag } from 'antd';
import React, { ReactNode, useCallback, useRef, useState } from 'react';
import { history, useModel } from 'umi';
// 在导入部分添加 Modal
import { Modal } from 'antd';

// 修正后的类型
type ApiMockRule = IMockRule & {
  enable?: boolean;
  interface_id?: number; // 添加蛇形命名字段
  status_code?: number; // 明确status_code类型
};

// 状态管理类型
type RuleState = {
  id: number;
  enabled: boolean;
  loading: boolean;
};

const MockRuleList: React.FC = () => {
  // 获取当前用户信息
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser || {
    id: 0,
    username: '未知用户',
  };
  const { data: status, refresh: refreshStatus } = useRequest(
    mockApi.getStatus,
  );
  const [loading, setLoading] = useState(false); // 新增统一加载状态
  // 使用正确的 enable/disable 方法（不需要传递参数）
  const { run: toggleMock } = useRequest(
    async (enabled: boolean) => {
      if (enabled) {
        return mockApi.enable();
      } else {
        return mockApi.disable();
      }
    },
    {
      manual: true,
      onSuccess: (data, [enabled]) => {
        message.success(
          `${enabled ? '启用' : '禁用'}成功 (${currentUser.username})`,
        );
        refreshStatus();
      },
      onError: (error) => {
        message.error(`操作失败 (${currentUser.username})`);
        refreshStatus();
      },
    },
  );

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<ApiMockRule[]>([]);

  // 使用 ref 来获取 ProTable 的 action 实例
  const actionRef = useRef<ActionType>();

  // 状态管理：使用对象存储状态 - 更高效
  const [ruleStates, setRuleStates] = useState<Record<number, RuleState>>({});

  // 优化过的状态更新函数
  const updateRuleState = useCallback(
    (id: number, state: Partial<RuleState>) => {
      setRuleStates((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || {
            id,
            enabled: false,
            loading: false,
          }),
          ...state,
        },
      }));
    },
    [],
  );

  // 清除规则状态
  const clearRuleState = useCallback((id: number) => {
    setRuleStates((prev) => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  }, []);

  // 流畅切换规则状态
  const toggleRuleState = useCallback(
    async (id: number, newState: boolean, record: ApiMockRule) => {
      const ruleId = Number(id);

      // 1. 立即更新本地状态（乐观更新）
      updateRuleState(ruleId, {
        enabled: newState,
        loading: true,
      });

      try {
        // 2. 执行API调用
        await mockApi.toggleRule(ruleId, newState);

        // 3. API成功后清除本地状态
        clearRuleState(ruleId);

        message.success(
          newState
            ? `规则已启用 (${currentUser.username})`
            : `规则已禁用 (${currentUser.username})`,
        );

        // 4. 仅更新当前行数据
        if (actionRef.current) {
          actionRef.current.reloadAndRest?.(); // 仅重新加载当前页而不是整个表格
        }
      } catch (error) {
        // 5. 失败时恢复到原始状态
        const originalState = record.enable ?? record.enabled;
        updateRuleState(ruleId, {
          enabled: originalState,
          loading: false,
        });

        message.error('状态切换失败');
      }
    },
    [updateRuleState, clearRuleState, currentUser.id],
  );

  const columns: ProColumns<ApiMockRule, 'text'>[] = [
    {
      title: '规则名称',
      dataIndex: 'mockname',
      key: 'mockname',
      search: true, // 启用搜索
      width: 150,
    },
    {
      title: '关联接口',
      dataIndex: 'interface_id',
      key: 'interface_id',
      hideInSearch: true,
      width: 120,
      render: (text: ReactNode, record: ApiMockRule) =>
        record.interface_id ? (
          <span style={{ color: '#79cb53' }}>已关联</span>
        ) : (
          <span style={{ color: '#999' }}>未关联</span>
        ),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      search: true, // 启用搜索
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      search: true, // 启用搜索
      render: (text: ReactNode, record: ApiMockRule) => (
        <span style={{ textTransform: 'uppercase' }}>{record.method}</span>
      ),
      valueEnum: {
        GET: { text: 'GET' },
        POST: { text: 'POST' },
        PUT: { text: 'PUT' },
        DELETE: { text: 'DELETE' },
        PATCH: { text: 'PATCH' },
      },
    },
    // 优化状态列UI（增加视觉一致性和易用性）
    {
      title: '状态',
      width: 120,
      hideInSearch: true,
      render: (text: ReactNode, record: ApiMockRule) => {
        const ruleId = Number(record.id);
        const state = ruleStates[ruleId];

        // 确定当前状态
        let isEnabled = false;
        let isLoading = false;

        if (state) {
          isEnabled = state.enabled;
          isLoading = state.loading;
        } else {
          const apiEnabled =
            record.enable !== undefined ? record.enable : record.enabled;
          isEnabled = apiEnabled;
        }

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
                backgroundColor: isEnabled ? '#52c41a' : undefined, // 启用状态显示绿色背景
              }}
              className={isEnabled ? 'enabled-switch' : 'disabled-switch'}
            />
            <Tag
              color={isEnabled ? 'green' : 'red'}
              style={{ marginLeft: 8, borderRadius: 4 }}
            >
              {isEnabled ? '运行中' : '已禁用'}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '状态码',
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 100,
      hideInSearch: true,
      valueType: 'digit',
      //render: (text: ReactNode, record: ApiMockRule) => record.status_code ?? 200,
      render: (text: ReactNode, record: ApiMockRule) => (
        <Tag
          color={
            (record.status_code ?? 200) >= 400
              ? 'red'
              : (record.status_code ?? 200) >= 300
              ? 'orange'
              : 'green'
          }
        >
          {record.status_code || 200}
        </Tag>
      ),
      fieldProps: {
        precision: 0,
        min: 100,
        max: 599,
        formatter: (value: number | undefined) => (value ?? 200).toString(),
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
      render: (text: ReactNode, record: ApiMockRule) => (
        <Space>
          <a onClick={() => history.push(`/mock/detail?rule_id=${record.id}`)}>
            详情
          </a>
          <a
            onClick={() => {
              setCurrentRule({
                ...record,
                enabled: record.enable ?? record.enabled,
              });
              setFormVisible(true);
            }}
          >
            编辑
          </a>
          {/*<a onClick={() => {*/}
          {/*  setCurrentRule({*/}
          {/*    ...record,*/}
          {/*    id: undefined,*/}
          {/*    mockname: `${record.mockname}-副本`,*/}
          {/*    enabled: record.enable ?? record.enabled*/}
          {/*  });*/}
          {/*  setFormVisible(true);*/}
          {/*}}>*/}
          {/*  复制*/}
          {/*</a>*/}
          <Popconfirm
            title="确认删除"
            description="确定要删除这条Mock规则吗？"
            onConfirm={async () => {
              try {
                await mockApi.delete(Number(record.id));
                message.success('删除成功');

                // 清除可能存在的状态
                clearRuleState(Number(record.id));

                // 仅重新加载当前页
                if (actionRef.current) {
                  actionRef.current.reloadAndRest?.();
                }
              } catch (error) {
                message.error('删除失败');
              }
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [formVisible, setFormVisible] = useState(false);
  const [currentRule, setCurrentRule] = useState<IMockRule>();

  return (
    <div>
      {/* 添加用户信息卡片 */}
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
        <Space>
          <Switch
            checked={status?.data?.enabled ?? false}
            onChange={(checked) => toggleMock(checked)}
            checkedChildren={`${currentUser.username}的Mock已启用`}
            unCheckedChildren={`${currentUser.username}的Mock已禁用`}
            style={{
              width: 'auto',
              maxWidth: 200,
              backgroundColor: status?.data?.enabled ? '#52c41a' : undefined,
            }}
          />
          <Tag
            color={status?.data?.enabled ? 'green' : 'red'}
            style={{
              marginLeft: 8,
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: 4,
            }}
          >
            {status?.data?.enabled
              ? `${currentUser.username}的Mock服务已启用`
              : `${currentUser.username}的Mock服务已禁用`}
          </Tag>
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
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                  setFormVisible(false);
                }}
                onError={(error: any) => {
                  message.error(error.message || '操作失败');
                }}
              />
            </div>
          </Modal>
          <Popconfirm
            title="确认删除"
            description={`确定要删除选中的${selectedRowKeys.length}条规则吗？`}
            onConfirm={async () => {
              try {
                await mockApi.batchDelete(
                  selectedRows.map((row) => Number(row.id)),
                );
                message.success(`成功删除${selectedRowKeys.length}条规则`);

                // 清除所有选中的规则状态
                selectedRows.forEach((row) => clearRuleState(Number(row.id)));

                setSelectedRowKeys([]);
                setSelectedRows([]);

                // 仅重新加载当前页
                if (actionRef.current) {
                  actionRef.current.reloadAndRest?.();
                }
              } catch (error) {
                message.error('删除失败');
              }
            }}
            disabled={selectedRowKeys.length === 0}
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
        loading={loading} // 使用统一加载状态
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys, newSelectedRows) => {
            setSelectedRowKeys(newSelectedRowKeys);
            setSelectedRows(newSelectedRows);
          },
        }}
        columns={columns}
        request={async (params) => {
          try {
            const page = params.current ?? 1;
            const size = params.pageSize ?? 10;
            const { current, pageSize, ...restParams } = params;
            const response = await mockApi.getList({
              page: page,
              size: size,
              userId: currentUser.id,
              ...restParams, // 包含搜索条件
            });

            return {
              data: response.data.items,
              total: response.data.total,
              success: true,
            };
          } catch (error) {
            console.error('获取Mock规则列表失败:', error);
            return {
              data: [],
              total: 0,
              success: false,
            };
          }
        }}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
        }}
      />
      {formVisible && (
        <MockCreateRule
          interId={currentRule?.interface_id || 0}
          initialValues={currentRule}
          onCancel={() => setFormVisible(false)}
          onSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reload();
            }
            setFormVisible(false);
          }}
          onError={(error: any) => {
            if (error?.response?.status === 409) {
              const { existing_rule_id } = error.response.data;
              message.error(
                error.response?.data?.message || '操作失败，请重试',
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default MockRuleList;
