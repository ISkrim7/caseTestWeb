import { IObjGet } from '@/api';
import { handelAPSRunCase, pageUICase } from '@/api/aps';
import { copyCase, delUICase } from '@/api/ui';
import MyProTable from '@/components/Table/MyProTable';
import { fetchQueryEnv2Obj } from '@/pages/UIPlaywright/someFetch';
import { IUICase } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { history } from '@@/core/history';
import { useModel } from '@@/exports';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  currentProject?: number;
  currentCasePart?: number;
}

const Index: FC<SelfProps> = ({ currentProject, currentCasePart }) => {
  const { initialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [envOptions, setEnvOptions] = useState<IObjGet>({});

  const fetchUICase = useCallback(
    async (params: any, sort: any) => {
      const searchData: any = {
        casePartId: currentCasePart,
        ...params,
        sort: sort,
      };
      const { code, data } = await pageUICase(searchData);
      if (code === 0) {
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
    },
    [currentCasePart],
  );
  useEffect(() => {
    actionRef.current?.reload();
  }, [currentCasePart, currentProject]);

  useEffect(() => {
    Promise.all([fetchQueryEnv2Obj(setEnvOptions)]).then((r) => r.reverse());
  }, []);

  const columns: ProColumns<IUICase>[] = [
    {
      title: '用例ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      copyable: true,
      width: 100,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '名称',
      dataIndex: 'title',
      sorter: true,
      fixed: 'left',
      key: 'title',
      width: 250,
      // render: (text) => {
      //   return <Tag color={'blue'}>{text}</Tag>;
      // },
    },
    {
      title: '运行环境',
      dataIndex: 'envName',
      valueType: 'select',
      key: 'envId',
      width: 100,
      valueEnum: { ...envOptions },
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      width: 50,
      valueEnum: CONFIG.API_LEVEL_ENUM,
      render: (_, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_LEVEL[record.level].color}>
            {CONFIG.RENDER_CASE_LEVEL[record.level].text}
          </Tag>
        );
      },
    },
    {
      title: '步骤数量',
      dataIndex: 'step_num',
      hideInSearch: true,
      key: 'title',
      width: 50,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.CASE_STATUS_ENUM,
      width: 100,
      render: (_, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_STATUS[record.status].color}>
            {CONFIG.RENDER_CASE_STATUS[record.status].text}
          </Tag>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: 100,
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      search: false,
      width: 120,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record, __) => {
        return (
          <>
            <a
              target="_blank"
              rel="noopener noreferrer"
              key="view"
              onClick={() => {
                history.push(`/ui/case/detail/caseId=${record.id}`);
              }}
            >
              详情
            </a>
            <Divider type={'vertical'} />
            <a
              onClick={async () => {
                const { code, msg } = await handelAPSRunCase({
                  caseId: record.id,
                  userId: initialState!.currentUser!.id!,
                });
                if (code === 0) {
                  message.success(msg);
                }
              }}
            >
              执行
            </a>
            <Divider type={'vertical'} />
            <a
              onClick={async () => {
                const { code, data, msg } = await copyCase({ uid: record.uid });
                if (code === 0) {
                  history.push(`/ui/case/detail/caseId=${data}`);
                  message.success(msg);
                }
              }}
            >
              复制
            </a>
            {initialState?.currentUser?.id === record.creator ||
            initialState?.currentUser?.isAdmin ? (
              <Popconfirm
                title={'确认删除？'}
                okText={'确认'}
                cancelText={'点错了'}
                onConfirm={async () => {
                  const { code, msg } = await delUICase({ uid: record.uid });
                  if (code === 0) {
                    message.success(msg);
                    actionRef.current?.reload();
                  }
                }}
              >
                <Divider type={'vertical'} />
                <a>删除</a>
              </Popconfirm>
            ) : null}
          </>
        );
      },
    },
  ];

  const AddCaseButton = (
    <Button
      type={'primary'}
      onClick={() => {
        history.push(`/ui/addCase/projectId=${currentProject}`);
      }}
    >
      添加用例
    </Button>
  );

  return (
    <MyProTable
      columns={columns}
      rowKey={'id'}
      request={fetchUICase}
      actionRef={actionRef}
      toolBarRender={() => [AddCaseButton]}
    />
    // <ProTable
    //   actionRef={actionRef}
    //   columns={columns}
    //   request={fetchUICase}
    //   scroll={{x: 1000}}
    //   toolBarRender={() => [AddCaseButton]}
    //   rowKey={"uid"}
    //   search={{
    //     labelWidth: 'auto',
    //     defaultCollapsed: false,
    //   }}
    //   pagination={
    //     {
    //       showQuickJumper: true,
    //       defaultPageSize: 20,
    //       showSizeChanger: true,
    //     }
    //   }
    // />
  );
};

export default Index;
