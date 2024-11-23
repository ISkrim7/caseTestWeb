import { IProject } from '@/api';
import { pageProject, putProject } from '@/api/base';
import NewProject from '@/components/NewProject';
import MyProTable from '@/components/Table/MyProTable';
import type { ActionType } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { useAccess } from 'umi';

const ProjectList: React.FC = () => {
  const { isAdmin } = useAccess();
  const columns: ProColumns[] = [
    {
      title: 'uid',
      dataIndex: 'uid',
      ellipsis: false,
      editable: false,
      copyable: true,
      formItemProps: { label: 'uid' },
    },
    {
      title: 'title',
      dataIndex: 'title',
      ellipsis: true, //是否自动缩略
      width: '10%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: 'desc',
      dataIndex: 'desc',
      ellipsis: true,
      search: false,
    },
    {
      title: 'chargeName',
      dataIndex: 'chargeName',
      ellipsis: true,
      editable: false,
      search: false,
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'create_time',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
      editable: false,
    },
    {
      title: '更新时间',
      key: 'showTime',
      dataIndex: 'update_time',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
      editable: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        isAdmin ? (
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.uid);
            }}
          >
            编辑
          </a>
        ) : null,
        <a target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
      ],
    },
  ];

  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const isReload = (value: boolean) => {
    if (value) {
      actionRef.current?.reload();
    }
  };

  const fetchPageProjects = async (params: any, sort: any) => {
    const searchInfo: any = {
      ...params,
      sort: sort,
    };
    const { code, data } = await pageProject(searchInfo);
    if (code === 0) {
      return {
        data: data.items,
        total: data.pageInfo.total,
        success: true,
        pageSize: data.pageInfo.page,
        current: data.pageInfo.limit,
      };
    } else {
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  };

  const OnSave = async (_: any, record: IProject) => {
    return await putProject(record);
  };

  return (
    <MyProTable
      headerTitle={'项目'}
      actionRef={actionRef}
      columns={columns}
      request={fetchPageProjects}
      rowKey={'uid'}
      onSave={OnSave}
      toolBarRender={() => [<NewProject reload={isReload} />]}
    />
  );
};

export default ProjectList;
