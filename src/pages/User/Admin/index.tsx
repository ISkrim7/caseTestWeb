import { IDepartment, IObjGet, IUser } from '@/api';
import { departmentQuery, pageUser, UserOpt } from '@/api/user';
import MyProTable from '@/components/Table/MyProTable';
import AddUser from '@/components/UserOpt/AddUser';
import type { ActionType } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [departmentsEnum, setDepartmentEnum] = useState<IObjGet>({});
  const [departments, setDepartments] = useState<IDepartment[]>();

  useEffect(() => {
    const queryDepartments = async () => {
      const { data } = await departmentQuery('GET');
      return data;
    };
    queryDepartments().then((data?: IDepartment[]) => {
      if (data) {
        setDepartments(data);
        const valueEnum: IObjGet = {};
        data.forEach((item: any) => {
          valueEnum[item.name!] = { text: item.name };
        });
        setDepartmentEnum(valueEnum);
      }
    });
  }, []);

  const fetchUsers = async (params: any, sort: any) => {
    const searchInfo: any = {
      ...params,
      sort: sort,
    };

    const { code, data } = await pageUser(searchInfo);
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
      total: 0,
      success: false,
    };
  };

  const onSave = async (_: any, record: IUser) => {
    const selectDepartment = departments?.find(
      (item) => item.name === record.departmentName,
    );
    record.departmentID = selectDepartment?.id!;
    const { code } = await UserOpt('PUT', record);
    if (code === 0) {
      actionRef.current?.reload();
    }
  };

  const onDelete = async (_: any, record: IUser) => {
    const { code, msg } = await UserOpt('DELETE', { uid: record.uid });
    if (code === 0) {
      message.success(msg);
      if (code === 0) {
        actionRef.current?.reload();
      }
    }
  };
  const isReload = (value: boolean) => {
    if (value) {
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns[] = [
    {
      title: 'username',
      copyable: true,
      dataIndex: 'username',
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
      title: 'email',
      dataIndex: 'email',
      ellipsis: true, //是否自动缩略
      width: '10%',
      editable: false,
    },

    {
      title: 'department',
      dataIndex: 'departmentName',
      valueType: 'select',
      ellipsis: true, //是否自动缩略
      valueEnum: departmentsEnum,
      width: '10%',
    },
    // {
    //   title: 'tag',
    //   dataIndex: 'tagName',
    //   valueType: 'select',
    //   search: false,
    //   ellipsis: true, //是否自动缩略
    //   fieldProps: {
    //     options: tags,
    //   },
    //   width: '10%',
    //   render: (text) => {
    //     return <Tag color={'blue'}>{text}</Tag>;
    //   },
    // },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
      editable: false,
    },
    {
      title: '更新时间',
      key: 'showTime',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
      editable: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.uid);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <MyProTable
      headerTitle={'用户表'}
      columns={columns}
      actionRef={actionRef}
      request={fetchUsers}
      rowKey={'uid'}
      onDelete={onDelete}
      onSave={onSave}
      toolBarRender={() => [<AddUser reload={isReload} />]}
    />
  );
};

export default Index;
