import { IModuleEnum, IObjGet } from '@/api';
import { appendRecord2Case } from '@/api/inter';
import { pageInterApiCase } from '@/api/inter/interCase';
import { queryProjectEnum } from '@/components/CommonFunc';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPICase } from '@/pages/Httpx/types';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum, pageData } from '@/utils/somefunc';
import { ProColumns } from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { FC, useCallback, useEffect, useState } from 'react';

interface IAddToCase {
  currentRecordId?: string;
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddToCase: FC<IAddToCase> = ({ currentRecordId, setCloseModal }) => {
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [selectPartId, setSelectPartId] = useState<number>();
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 查询所有project 设置枚举
  useEffect(() => {
    queryProjectEnum(setProjectEnumMap).then();
  }, []);
  useEffect(() => {
    if (selectProjectId) {
      fetchModulesEnum(selectProjectId, ModuleEnum.API, setModuleEnum).then();
    }
  }, [selectProjectId]);
  const fetchInterfaceCase = useCallback(
    async (params: any, sort: any) => {
      const searchData = {
        ...params,
        module_id: selectPartId,
        sort: sort,
      };
      const { code, data } = await pageInterApiCase(searchData);
      return pageData(code, data);
    },
    [selectPartId],
  );
  const columns: ProColumns<IInterfaceAPICase>[] = [
    {
      title: '项目',
      dataIndex: 'project_id',
      hideInTable: true,
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: projectEnumMap,
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
      fieldProps: {
        value: selectPartId,
        onSelect: (value: number) => {
          setSelectPartId(value);
        },
        treeData: moduleEnum,
        fieldNames: {
          label: 'title',
        },
      },
    },
    {
      title: '接口编号',
      dataIndex: 'id',
      key: 'id',
      copyable: true,
      render: (_, record) => {
        return <Tag color={'green'}>CASE_{record.id}</Tag>;
      },
    },
    {
      title: '名称',
      dataIndex: 'title',
      key: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      render: (_, record) => {
        return <Tag>{record.creatorName}</Tag>;
      },
    },
  ];
  const rowSelection: TableRowSelection<IInterfaceAPICase> = {
    type: 'radio',
    hideSelectAll: true,
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      console.log(newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  return (
    <MyProTable
      rowSelection={rowSelection}
      // @ts-ignore
      tableAlertOptionRender={() => {
        return (
          <Button
            type={'primary'}
            onClick={async () => {
              console.log(selectedRowKeys);
              if (currentRecordId && selectedRowKeys.length > 0) {
                const { code, msg } = await appendRecord2Case({
                  caseId: selectedRowKeys[0] as string,
                  recordId: currentRecordId,
                });
                if (code === 0) {
                  message.success(msg);
                  setCloseModal(false);
                }
              }
            }}
          >
            确认添加
          </Button>
        );
      }}
      rowKey={'id'}
      columns={columns}
      x={500}
      request={fetchInterfaceCase}
    />
  );
};
export default AddToCase;
