import {
  delCocoConfig,
  genReport,
  pageCocoConfig,
  putCocoConfig,
  queryModel,
} from '@/api/coco';
import MyDrawer from '@/components/MyDrawer';
import TitleName from '@/components/TitleName';
import CocoEdit from '@/pages/Jacoco/CocoList/CocoEdit';
import { CocoConfig } from '@/pages/Jacoco/cocoType';
import { useModel } from '@@/exports';
import {
  ActionType,
  EditableProTable,
  ProCard,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, Divider, message, Tag } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const Index = () => {
  const [open, setOpen] = useState(false);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const { initialState } = useModel('@@initialState');
  const [moduleOption, setModuleOption] = useState();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
  const [cocoConfigs, setCocoConfigs] = useState<CocoConfig[]>([]);
  const [loadingState, setLoadingState] = useState<any>({});

  useEffect(() => {
    queryModel().then(({ data }) => {
      setModuleOption(data);
    });
  }, []);
  const fetchCoco = useCallback(async (params: any, sort: any) => {
    const searchData: any = {
      ...params,
      sort: sort,
    };
    const { code, data } = await pageCocoConfig(searchData);
    if (code === 0) {
      setCocoConfigs(data.items);
      return {
        data: data.items,
        total: data.pageInfo.total,
        success: true,
        pageSize: data.pageInfo.page,
        current: data.pageInfo.limit,
      };
    }
    return {
      data: [],
      success: false,
      total: 0,
    };
  }, []);

  const columns: ProColumns<CocoConfig>[] = [
    {
      title: '模块',
      dataIndex: 'module_name',
      valueType: 'select',
      valueEnum: moduleOption,
      sorter: true,
      fixed: 'left',
      width: '5%',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '项目名称',
      dataIndex: 'project_name',
      copyable: true,
      sorter: true,
      fixed: 'left',
      editable: (_, record) => {
        // 管理可操作
        if (initialState?.currentUser?.isAdmin) {
          return true;
        }
        // 创建者也可
        return record.creator === initialState?.currentUser?.id;
      },
    },
    {
      title: '环境',
      dataIndex: 'env',
      valueType: 'select',
      valueEnum: {
        dev: 'dev',
        sit: 'sit',
        uat: 'uat',
      },
      width: '5%',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: 'git地址',
      dataIndex: 'gitUrl',
      copyable: true,
      ellipsis: true,
      hideInSearch: true,
      editable: (_, record) => {
        // 管理可操作
        if (initialState?.currentUser?.isAdmin) {
          return true;
        }
        // 创建者也可
        return record.creator === initialState?.currentUser?.id;
      },
    },
    {
      title: 'ip',
      dataIndex: 'ip',
      copyable: true,
      ellipsis: true,
      valueType: 'textarea',
      hideInSearch: true,
      editable: (_, record) => {
        // 管理可操作
        if (initialState?.currentUser?.isAdmin) {
          return true;
        }
        // 创建者也可
        return record.creator === initialState?.currentUser?.id;
      },
    },
    {
      title: '端口',
      dataIndex: 'agent_port',
      valueType: 'digit',
      copyable: true,
      hideInSearch: true,
      editable: (_, record) => {
        // 管理可操作
        if (initialState?.currentUser?.isAdmin) {
          return true;
        }
        // 创建者也可
        return record.creator === initialState?.currentUser?.id;
      },
    },
    {
      title: 'git原始分支/标签',
      dataIndex: 'baseVersion',
      valueType: 'textarea',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: 'git现分支/标签',
      dataIndex: 'nowVersion',
      valueType: 'textarea',
      hideInSearch: true,
      copyable: true,
    },
    {
      title: '构建结果地址',
      tooltip: '构建结果地址',
      dataIndex: 'ftp_url',
      valueType: 'textarea',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '项目包名',
      tooltip: '项目包名',
      dataIndex: 'project_jar_name_list',
      valueType: 'textarea',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '项目代码目录',
      dataIndex: 'project_name_list',
      valueType: 'textarea',
      hideInSearch: true,
      ellipsis: true,
      editable: (_, record) => {
        // 管理可操作
        if (initialState?.currentUser?.isAdmin) {
          return true;
        }
        // 创建者也可
        return record.creator === initialState?.currentUser?.id;
      },
    },
    {
      title: '密钥',
      dataIndex: 'wx_key',
      valueType: 'password',
      hideInSearch: true,
      editable: (_, record) => {
        // 管理可操作
        if (initialState?.currentUser?.isAdmin) {
          return true;
        }
        // 创建者也可
        return record.creator === initialState?.currentUser?.id;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      valueType: 'text',
      editable: false,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '13%',
      fixed: 'right',
      render: (_, record, __, action) => {
        return (
          <>
            <a
              key="editable"
              onClick={() => {
                console.log('==', record);
                action?.startEditable?.(record.id);
              }}
            >
              编辑
            </a>
            {initialState?.currentUser?.id === record.creator ||
            initialState?.currentUser?.isAdmin ? (
              <>
                <Divider type={'vertical'} />
                <a
                  key="delete"
                  onClick={async () => {
                    const { code, msg } = await delCocoConfig({
                      uid: record.uid,
                    });
                    if (code === 0) {
                      message.success(msg);
                      action?.reload?.();
                    }
                  }}
                >
                  删除
                </a>
              </>
            ) : null}
            <Divider type={'vertical'} />
            <Button
              type={'link'}
              loading={loadingState[record.id] || false}
              onClick={async () => {
                setLoadingState((prev: any) => ({
                  ...prev,
                  [record.id]: true,
                }));
                try {
                  const { code, msg } = await genReport({ id: record.id });
                  if (code === 0) {
                    message.success(msg);
                  }
                } finally {
                  setLoadingState((prev: any) => ({
                    ...prev,
                    [record.id]: false,
                  }));
                }
              }}
            >
              生成报告
            </Button>
          </>
        );
      },
    },
  ];

  const AddCocoButton = (
    <Button type={'primary'} onClick={() => setOpen(true)}>
      添加
    </Button>
  );

  const Book = (
    <Button
      type={'primary'}
      onClick={() => {
        window.open(
          'https://doc.weixin.qq.com/doc/w3_ATgAwQZeAHk14AeKofHQpCE5zg7oM?scode=APwAJgfkAHAVOKFRkNATgAwQZeAHk&journal_source=chat',
        );
      }}
    >
      使用说明
    </Button>
  );

  return (
    <ProCard>
      <MyDrawer
        name={TitleName('添加配置')}
        width={'auto'}
        open={open}
        setOpen={setOpen}
      >
        <CocoEdit setOpen={setOpen} actionRef={actionRef} />
      </MyDrawer>
      <EditableProTable
        rowKey={'id'}
        search={{
          layout: 'vertical',
          split: true,
          filterType: 'query',
          labelWidth: 'auto',
          span: 6,
          showHiddenNum: true,
        }}
        scroll={{ x: 1600 }}
        dataSource={cocoConfigs}
        actionRef={actionRef}
        request={fetchCoco}
        recordCreatorProps={false}
        toolBarRender={() => [AddCocoButton, Book]}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        editable={{
          type: 'single',
          editableKeys: editableKeys,
          onChange: setEditableRowKeys,
          onSave: async (_, data) => {
            const { code, msg } = await putCocoConfig(data);
            if (code === 0) {
              message.success(msg);
              actionRef.current?.reload();
            }
          },
          onCancel: async (_) => {
            actionRef.current?.reload();
          },
          actionRender: (_, __, dom) => [dom.save, dom.cancel],
        }}
      />
    </ProCard>
  );
};

export default Index;
