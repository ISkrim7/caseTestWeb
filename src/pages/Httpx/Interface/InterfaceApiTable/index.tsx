import { IModuleEnum } from '@/api';
import {
  copyApiTo,
  copyInterApiById,
  outPutInter2Yaml,
  pageInterApi,
  removeInterApiById,
  updateInterApiById,
} from '@/api/inter';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum, pageData } from '@/utils/somefunc';
import { useModel } from '@@/exports';
import {
  CopyOutlined,
  DeleteOutlined,
  DeliveredProcedureOutlined,
  DownOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProForm,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import {
  Button,
  Dropdown,
  Form,
  message,
  Modal,
  Popconfirm,
  Tag,
  Tooltip,
} from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { history } from 'umi';

interface SelfProps {
  currentProjectId?: number;
  currentModuleId?: number;
  perKey: string;
}

const Index: FC<SelfProps> = ({
  currentModuleId,
  currentProjectId,
  perKey,
}) => {
  const [copyForm] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState(false);
  const { initialState } = useModel('@@initialState');
  const projects = initialState?.projects || [];
  const [copyProjectId, setCopyProjectId] = useState<number>();
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [currentApiId, setCurrentApiId] = useState<number>();
  const [copyOrMove, setCopyOrMove] = useState(1);

  useEffect(() => {
    if (copyProjectId) {
      fetchModulesEnum(copyProjectId, ModuleEnum.API, setModuleEnum).then();
    }
  }, [copyProjectId]);

  useEffect(() => {
    actionRef.current?.reload();
  }, [currentModuleId, currentProjectId]);

  const fetchInterface = useCallback(
    async (params: any, sort: any) => {
      const { code, data } = await pageInterApi({
        ...params,
        module_id: currentModuleId,
        module_type: ModuleEnum.API,
        is_common: 1,
        sort: sort,
      });
      return pageData(code, data);
    },
    [currentModuleId],
  );

  const columns: ProColumns<IInterfaceAPI>[] = [
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
      width: 95,
      ellipsis: true,
      copyable: true,
      render: (_, record) => {
        return <Tag color={'blue'}>{record.uid}</Tag>;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: {
        showTitle: true,
      },
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '路径',
      dataIndex: 'url',
      key: 'url',
      width: 300,
      ellipsis: {
        showTitle: true,
      },
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ fontFamily: 'monospace' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '方法',
      dataIndex: 'method',
      valueType: 'select',
      key: 'method',
      width: 80,
      valueEnum: CONFIG.API_METHOD_ENUM,
      filters: true,
      search: true,
      onFilter: true,
      render: (_, record) => {
        return (
          <Tag color={CONFIG.API_METHOD_ENUM[record.method].color}>
            {record.method}
          </Tag>
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      search: false,
      filters: true,
      onFilter: true,
      render: (_, record) => {
        return <Tag color={'blue'}>{record.level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      key: 'status',
      width: 100,
      search: false,
      filters: true,
      onFilter: true,
      valueEnum: CONFIG.API_STATUS_ENUM,
      render: (_, record) => {
        return CONFIG.API_STATUS_ENUM[record.status].tag;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      key: 'creatorName',
      width: 100,
      ellipsis: true,
      render: (_, record) => {
        return (
          <Tooltip title={record.creatorName}>
            <Tag color={'orange'}>{record.creatorName}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 200,
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            history.push({
              pathname: `/interface/interApi/detail/interId=${record.id}`,
              search: `?projectId=${currentProjectId?.toString()}&moduleId=${currentModuleId?.toString()}`,
            });
          }}
          style={{ marginRight: 8 }}
        >
          详情
        </a>,

        <a
          key="copy"
          onClick={async () => {
            const { code } = await copyInterApiById(record.id);
            if (code === 0) {
              message.success('复制成功');
              actionRef.current?.reload();
            }
          }}
          style={{ marginRight: 8 }}
        >
          复制
        </a>,

        <Dropdown
          key="more"
          menu={{
            items: [
              {
                key: 'copy-to',
                label: '复制至',
                icon: <CopyOutlined />,
                onClick: () => {
                  setCurrentApiId(record.id);
                  setCopyOrMove(1);
                  setOpenModal(true);
                },
              },
              {
                key: 'move-to',
                label: '移动至',
                icon: <DeliveredProcedureOutlined />,
                onClick: () => {
                  setCurrentApiId(record.id);
                  setCopyOrMove(2);
                  setOpenModal(true);
                },
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: (
                  <Popconfirm
                    title={'确认删除？'}
                    okText={'确认'}
                    cancelText={'点错了'}
                    onConfirm={async () => {
                      const { code } = await removeInterApiById(record.id);
                      if (code === 0) {
                        message.success('删除成功');
                        actionRef.current?.reload();
                      }
                    }}
                  >
                    <span style={{ color: '#ff4d4f' }}>删除</span>
                  </Popconfirm>
                ),
                icon: <DeleteOutlined />,
              },
            ],
          }}
        >
          <Tooltip title="更多操作（复制至、移动至、删除）">
            <a style={{ color: '#1890ff', fontWeight: 500 }}>
              <EllipsisOutlined /> 更多
            </a>
          </Tooltip>
        </Dropdown>,
      ],
    },
  ];

  return (
    <>
      <Modal
        open={openModal}
        onOk={async () => {
          try {
            const values = await copyForm.validateFields();
            if (!currentApiId) return;
            let response;
            if (copyOrMove === 1) {
              response = await copyApiTo({
                inter_id: currentApiId,
                project_id: values.project_id,
                module_id: values.module_id,
              });
            } else if (copyOrMove === 2) {
              response = await updateInterApiById({
                id: currentApiId,
                project_id: values.project_id,
                module_id: values.module_id,
              });
            } else {
              return;
            }
            if (response?.code === 0) {
              message.success(response.msg);
              copyForm.resetFields();
              setOpenModal(false);
              actionRef.current?.reload();
            }
          } catch (error) {
            console.error('操作失败:', error);
          }
        }}
        onCancel={() => setOpenModal(false)}
        title={copyOrMove === 1 ? '复制接口' : '移动接口'}
      >
        <ProForm submitter={false} form={copyForm}>
          <ProFormSelect
            width={'md'}
            options={projects}
            label={'项目'}
            name={'project_id'}
            required={true}
            onChange={(value) => {
              setCopyProjectId(value as number);
            }}
          />
          <ProFormTreeSelect
            required
            name="module_id"
            label="模块"
            rules={[{ required: true, message: '所属模块必选' }]}
            fieldProps={{
              treeData: moduleEnum,
              fieldNames: {
                label: 'title',
              },
              filterTreeNode: true,
            }}
            width={'md'}
          />
        </ProForm>
      </Modal>
      <MyProTable
        persistenceKey={perKey}
        columns={columns}
        rowKey={'id'}
        actionRef={actionRef}
        request={fetchInterface}
        // 如果 MyProTable 支持分页配置，可以这样设置
        // pagination={{
        //   showSizeChanger: true,
        //   showQuickJumper: true,
        //   pageSizeOptions: ['10', '20', '50', '100'],
        //   defaultPageSize: 20,
        // }}
        toolBarRender={() => [
          <Button
            type={'primary'}
            onClick={() => {
              if (!currentModuleId) {
                message.warning('请左侧树列表选择所属模块');
                return;
              }
              history.push({
                pathname: '/interface/interApi/detail',
                search: `?projectId=${currentProjectId?.toString()}&moduleId=${currentModuleId?.toString()}`,
              });
            }}
          >
            <PlusOutlined />
            添加接口
          </Button>,
          <Button
            type={'primary'}
            onClick={async () => {
              if (currentModuleId) {
                await outPutInter2Yaml(currentModuleId);
              } else {
                message.warning('请选择模块');
              }
            }}
          >
            <DownOutlined />
            接口导出
          </Button>,
        ]}
      />
    </>
  );
};

export default Index;
