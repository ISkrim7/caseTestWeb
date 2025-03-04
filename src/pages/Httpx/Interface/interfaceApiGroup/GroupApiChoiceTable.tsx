import { IModuleEnum, IObjGet } from '@/api';
import { selectCommonGroups2Case } from '@/api/inter/interCase';
import { pageInterfaceGroup } from '@/api/inter/interGroup';
import { queryProjectEnum } from '@/components/CommonFunc';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceGroup } from '@/pages/Httpx/types';
import { IUICase } from '@/pages/Play/componets/uiTypes';
import { ModuleEnum } from '@/utils/config';
import { fetchModulesEnum, pageData } from '@/utils/somefunc';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  currentCaseId: string;
  refresh?: () => void;
}

const GroupApiChoiceTable: FC<SelfProps> = (props) => {
  const { currentCaseId, refresh } = props;
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [selectModuleId, setSelectModuleId] = useState<number>();
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [moduleEnum, setModuleEnum] = useState<IModuleEnum[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 查询所有project 设置枚举
  useEffect(() => {
    queryProjectEnum(setProjectEnumMap).then();
  }, []);
  useEffect(() => {
    if (selectProjectId) {
      fetchModulesEnum(selectProjectId, ModuleEnum.API, setModuleEnum).then(
        (r) => {},
      );
    }
  }, [selectProjectId]);
  const columns: ProColumns<IInterfaceGroup>[] = [
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
          setSelectModuleId(undefined);
        },
      },
    },
    {
      title: '所属模块',
      dataIndex: 'module_id',
      hideInTable: true,
      valueType: 'treeSelect',
      initialValue: selectModuleId,
      fieldProps: {
        value: selectModuleId,
        onSelect: (value: number) => {
          setSelectModuleId(value);
        },
        treeData: moduleEnum,
        fieldNames: {
          label: 'title',
        },
      },
    },
    {
      title: 'ID',
      dataIndex: 'uid',
      key: 'uid',
      width: '15%',
      copyable: true,
      fixed: 'left',
      render: (_, record) => {
        return <Tag color={'geekblue'}>{record.uid}</Tag>;
      },
    },
    {
      title: '组名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '接口数',
      dataIndex: 'api_num',
      key: 'api_num',
      render: (_, record) => {
        return <Tag color={'blue-inverse'}>{record.api_num}</Tag>;
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
  const rowSelection: TableRowSelection<IUICase> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  const fetchInterfaceGroup = useCallback(async (params: any) => {
    const { code, data } = await pageInterfaceGroup({
      ...params,
      module_type: ModuleEnum.API,
    });
    return pageData(code, data);
  }, []);
  return (
    <MyProTable
      // @ts-ignore
      tableAlertOptionRender={() => {
        return (
          <Button
            type={'primary'}
            onClick={async () => {
              if (currentCaseId) {
                const { code, msg } = await selectCommonGroups2Case({
                  caseId: currentCaseId,
                  groupIds: selectedRowKeys as number[],
                });
                if (code === 0) {
                  message.success(msg);
                  refresh?.();
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
      x={1000}
      actionRef={actionRef}
      request={fetchInterfaceGroup}
    />
  );
};

export default GroupApiChoiceTable;
