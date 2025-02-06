import { IObjGet } from '@/api';
import { handelAPSRunCase } from '@/api/aps';
import { copyUICase, pageUICase } from '@/api/play';
import { queryUIEnvs } from '@/api/play/env';
import { delUICase } from '@/api/ui';
import MyProTable from '@/components/Table/MyProTable';
import { IUICase } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { history, useModel } from '@@/exports';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  currentProjectId?: number;
  currentPartId?: number;
  perKey: string;
}

const Index: FC<SelfProps> = ({ currentPartId, currentProjectId, perKey }) => {
  const { initialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [envOptions, setEnvOptions] = useState<IObjGet>({});
  useEffect(() => {
    queryUIEnvs().then(async ({ code, data }) => {
      if (code === 0) {
        const envOptions = Object.create(null);
        for (const item of data) {
          envOptions[item.id] = item.name;
        }
        setEnvOptions(envOptions);
      }
    });
  }, []);
  const fetchUICase = useCallback(
    async (params: any, sort: any) => {
      const { code, data } = await pageUICase({
        casePartId: currentPartId,
        ...params,
        sort: sort,
      });
      return pageData(code, data);
    },
    [currentPartId],
  );

  const columns: ProColumns<IUICase>[] = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      copyable: true,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: 'name',
      dataIndex: 'title',
      sorter: true,
      fixed: 'left',
      key: 'title',
    },
    {
      title: 'env',
      dataIndex: 'env_id',
      valueType: 'select',
      key: 'env_id',
      valueEnum: { ...envOptions },
      render: (text, record) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: 'level',
      dataIndex: 'level',
      valueType: 'select',
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
      title: 'step num',
      dataIndex: 'step_num',
      hideInSearch: true,
      key: 'title',
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: 'status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.CASE_STATUS_ENUM,
      render: (_, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_STATUS[record.status].color}>
            {CONFIG.RENDER_CASE_STATUS[record.status].text}
          </Tag>
        );
      },
    },
    {
      title: 'creator',
      dataIndex: 'creatorName',
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: 'create time',
      dataIndex: 'create_time',
      valueType: 'date',
      sorter: true,
      search: false,
    },
    {
      title: 'opt',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
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
                const { code, data, msg } = await copyUICase({
                  caseId: record.uid,
                });
                if (code === 0) {
                  history.push(`/ui/case/detail/caseId=${data.id}`);
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
        history.push(`/ui/addCase`);
      }}
    >
      添加用例
    </Button>
  );
  return (
    <MyProTable
      persistenceKey={perKey}
      columns={columns}
      rowKey={'id'}
      x={1000}
      request={fetchUICase}
      actionRef={actionRef}
      toolBarRender={() => [AddCaseButton]}
    />
  );
};

export default Index;
