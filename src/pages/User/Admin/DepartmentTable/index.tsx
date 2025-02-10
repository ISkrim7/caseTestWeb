import { IDepartment } from '@/api';
import MyProTable from '@/components/Table/MyProTable';
import AddDepartment from '@/components/UserOpt/AddDepartment';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useRef } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  const isReload = (value: boolean) => {
    if (value) {
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns[] = [
    {
      title: '部门名称',
      dataIndex: 'name',
      ellipsis: true, //是否自动缩略
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
      title: '部门描述',
      dataIndex: 'desc',
      ellipsis: true, //是否自动缩略
    },
    {
      title: '部门负责人',
      dataIndex: 'adminName',
      ellipsis: true,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '构造统计',
      dataIndex: 'structure',
      hideInSearch: true,
      editable: false,
    },
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

  const OnSave = async (_: any, record: IDepartment) => {
    const form = {
      uid: record.uid,
      name: record.name,
      desc: record.desc,
      adminID: record.adminID,
    };
    // return await departmentOpt(form, 'PUT');
  };

  const OnDelete = async (_: any, record: IDepartment) => {
    // return await departmentOpt({ uid: record.uid } as IDepartment, 'DELETE');
  };
  return (
    <MyProTable
      headerTitle={'用户部门表'}
      actionRef={actionRef}
      columns={columns}
      // request={pageDepartments}
      rowKey={'uid'}
      onDelete={OnDelete}
      onSave={OnSave}
      toolBarRender={() => [<AddDepartment reload={isReload} />]}
    />
  );
};

export default Index;
