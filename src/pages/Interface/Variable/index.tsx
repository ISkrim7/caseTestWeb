import { IObjGet, IProject } from '@/api';
import {
  DelVariable,
  IPutVariableOpt,
  PageVariable,
  PutVariable,
} from '@/api/interface';
import { queryProject } from '@/api/project';
import MyProTable from '@/components/Table/MyProTable';
import { IVariable } from '@/pages/Interface/types';
import AddVariable from '@/pages/Interface/Variable/AddVariable';
import { ActionType } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { useEffect, useRef, useState } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const isReload = () => {
    actionRef.current?.reload();
  };
  const [projectsEnum, setProjectsEnum] = useState<IObjGet>();
  const [projects, setProjects] = useState<IProject[]>();

  const fetchProjects = async () => {
    const { code, data } = await queryProject();
    if (code === 0) {
      return data;
    }
  };
  useEffect(() => {
    fetchProjects().then((data?: IProject[]) => {
      if (data) {
        setProjects(data);
        console.log(data);
        const valueEnum: IObjGet = {};
        data.forEach((item: IProject) => {
          valueEnum[item.name!] = { text: item.name };
        });
        setProjectsEnum(valueEnum);
      }
    });
  }, []);

  const fetchVariables = async (params: any, sort: any) => {
    const searchInfo: any = {
      ...params,
      sort: sort,
    };
    const { code, data } = await PageVariable(searchInfo);
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

  const onPutVariable = async (_: any, record: IVariable) => {
    const selectProject = projects?.find(
      (item) => item.name === record.projectName,
    );
    record.projectId = selectProject?.id!;
    const form: IPutVariableOpt = {
      uid: record.uid,
      key: record.key,
      value: record.value,
      desc: record.desc,
      projectId: record.projectId,
    };
    const { code } = await PutVariable(form);
    if (code === 0) {
      isReload();
      return;
    }
  };

  const onDeleteVariable = async (_: any, record: IVariable) => {
    const { code } = await DelVariable({ uid: record.uid });
    if (code === 0) {
      return;
    }
  };
  const columns: ProColumns<IVariable>[] = [
    {
      title: 'key',
      dataIndex: 'key',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
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
      title: 'value',
      dataIndex: 'value',
      valueType: 'code',
      width: '30%',
      fieldProps: {
        rows: 3,
        width: '100%',
      },
      search: false,
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
      valueType: 'textarea',
      fieldProps: { rows: 1 },
      search: false,
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      valueType: 'select',
      filters: true,
      onFilter: true,
      valueEnum: projectsEnum,
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
      title: '创建人',
      dataIndex: 'creatorName',
      valueType: 'text',
      editable: false,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      search: false,
      editable: false,
    },
    {
      title: '更新人',
      dataIndex: 'updaterName',
      valueType: 'text',
      editable: false,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      search: false,
      editable: false,
    },
    {
      title: '编辑',
      valueType: 'option',
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
      headerTitle={'全局变量表'}
      actionRef={actionRef}
      columns={columns}
      request={fetchVariables}
      rowKey={'uid'}
      onSave={onPutVariable}
      onDelete={onDeleteVariable}
      toolBarRender={() => [<AddVariable isReload={isReload} />]}
    />
  );
};

export default Index;
