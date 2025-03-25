import { IModuleEnum, IObjGet } from '@/api';
import { pageInterApiCase } from '@/api/inter/interCase';
import { associationCasesByTaskId } from '@/api/inter/interTask';
import { queryProjectEnum } from '@/components/CommonFunc';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPICase } from '@/pages/Httpx/types';
import { IUICase } from '@/pages/Play/componets/uiTypes';
import { CONFIG, ModuleEnum } from '@/utils/config';
import { fetchModulesEnum, pageData } from '@/utils/somefunc';
import { ProColumns } from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { FC, useCallback, useEffect, useState } from 'react';

interface IChoiceApiCasesTableProps {
  currentProjectId?: number;
  currentTaskId?: string;
  reload?: () => void;
}

const ChoiceApiCasesTable: FC<IChoiceApiCasesTableProps> = ({
  currentProjectId,
  currentTaskId,
  reload,
}) => {
  const [selectProjectId, setSelectProjectId] = useState<number | undefined>(
    currentProjectId,
  );
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    queryProjectEnum(setProjectEnumMap).then();
  }, []);

  useEffect(() => {
    if (selectProjectId) {
      fetchModulesEnum(
        selectProjectId,
        ModuleEnum.API_CASE,
        setModuleEnum,
      ).then();
    }
  }, [selectProjectId]);
  const pageInterfaceCase = useCallback(async (params: any, sort: any) => {
    const { code, data } = await pageInterApiCase({
      ...params,
      project_id: currentProjectId,
      module_type: ModuleEnum.API_CASE,
      sort: sort,
    });
    return pageData(code, data);
  }, []);

  const rowSelection: TableRowSelection<IUICase> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns: ProColumns<IInterfaceAPICase>[] = [
    {
      title: '项目',
      dataIndex: 'project_id',
      hideInTable: true,
      valueType: 'select',
      valueEnum: projectEnumMap,
      initialValue: selectProjectId?.toString(),
      fieldProps: {
        disabled: true,
      },
    },
    {
      title: '所属模块',
      dataIndex: 'module_id',
      hideInTable: true,
      valueType: 'treeSelect',
      fieldProps: {
        treeData: moduleEnum,
        fieldNames: {
          label: 'title',
        },
      },
    },
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
      copyable: true,
    },
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'API数量',
      dataIndex: 'apiNum',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return <Tag color={'blue'}>{record.apiNum}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      width: '10%',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.level}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.API_STATUS_ENUM,
      render: (_, record) => {
        return CONFIG.API_STATUS_ENUM[record.status].tag;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      render: (_, record) => {
        return <Tag>{record.creatorName}</Tag>;
      },
    },
  ];

  return (
    <MyProTable
      // @ts-ignore
      tableAlertOptionRender={() => {
        return (
          <Button
            type={'primary'}
            onClick={async () => {
              if (currentTaskId) {
                const { code, data, msg } = await associationCasesByTaskId({
                  taskId: currentTaskId,
                  caseIds: selectedRowKeys as number[],
                });
                if (code === 0) {
                  message.success(msg);
                  if (data) {
                    message.warning('存在已关联业务用例、已过滤');
                  }
                  reload?.();
                }
              }
            }}
          >
            确认添加
          </Button>
        );
      }}
      rowSelection={rowSelection}
      columns={columns}
      rowKey={'id'}
      x={800}
      request={pageInterfaceCase}
    />
  );
};

export default ChoiceApiCasesTable;
