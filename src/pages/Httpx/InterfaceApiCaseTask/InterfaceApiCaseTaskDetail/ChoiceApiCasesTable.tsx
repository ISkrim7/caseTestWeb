import { IObjGet } from '@/api';
import { queryProject } from '@/api/base';
import { pageInterApiCase } from '@/api/inter/interCase';
import { associationCasesByTaskId } from '@/api/inter/interTask';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPICase } from '@/pages/Httpx/types';
import { fetchCaseParts } from '@/pages/Play/componets/someFetch';
import { CasePartEnum, IUICase } from '@/pages/Play/componets/uiTypes';
import { CONFIG } from '@/utils/config';
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
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [selectPartId, setSelectPartId] = useState<number>();
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [partEnumMap, setPartEnumMap] = useState<CasePartEnum[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    queryProject().then(({ code, data }) => {
      if (code === 0) {
        const mapData = data.reduce((acc: any, obj) => {
          acc[obj.id] = { text: obj.title };
          return acc;
        }, {});
        setProjectEnumMap(mapData);
      }
    });
  }, []);
  useEffect(() => {
    if (currentProjectId) {
      setSelectProjectId(currentProjectId);
    }
  }, [currentProjectId]);
  useEffect(() => {
    if (selectProjectId) {
      fetchCaseParts(selectProjectId, setPartEnumMap).then();
    }
  }, [selectProjectId]);
  const pageInterfaceCase = useCallback(async (params: any, sort: any) => {
    const searchData = {
      ...params,
      sort: sort,
    };
    const { code, data } = await pageInterApiCase(searchData);
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
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: projectEnumMap,
      initialValue: selectProjectId,
      fieldProps: {
        onSelect: (value: number) => {
          setSelectProjectId(value);
          setSelectPartId(undefined);
        },
      },
    },
    {
      title: '所属模块',
      dataIndex: 'part_id',
      hideInTable: true,
      valueType: 'treeSelect',
      initialValue: selectPartId,
      fieldProps: {
        value: selectPartId,
        onSelect: (value: number) => {
          setSelectPartId(value);
        },
        treeData: partEnumMap,
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
