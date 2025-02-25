import { IObjGet } from '@/api';
import { queryProject } from '@/api/base';
import { pageInterApi } from '@/api/inter';
import { selectCommonApis2Case } from '@/api/inter/interCase';
import { addInterfaceGroupApis } from '@/api/inter/interGroup';
import { associationApisByTaskId } from '@/api/inter/interTask';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { fetchCaseParts } from '@/pages/Play/componets/someFetch';
import { CasePartEnum } from '@/pages/Play/componets/uiTypes';
import { CONFIG } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  currentProjectId?: number;
  currentCaseApiId?: string;
  currentGroupId?: string;
  currentTaskId?: string;
  refresh?: () => void;
}

const InterfaceCaseChoiceApiTable: FC<SelfProps> = ({
  currentGroupId,
  currentCaseApiId,
  refresh,
  currentProjectId,
  currentTaskId,
}) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [selectPartId, setSelectPartId] = useState<number>();
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [partEnumMap, setPartEnumMap] = useState<CasePartEnum[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 查询所有project 设置枚举
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
  const fetchInterface = useCallback(async (params: any, sort: any) => {
    const searchData = {
      ...params,
      //只查询公共api
      is_common: 1,
      sort: sort,
    };
    const { code, data } = await pageInterApi(searchData);
    return pageData(code, data);
  }, []);

  const columns: ProColumns<IInterfaceAPI>[] = [
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
      dataIndex: 'name',
      key: 'name',
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

  const rowSelection: TableRowSelection<IInterfaceAPI> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <MyProTable
      // @ts-ignore
      tableAlertOptionRender={() => {
        return (
          <Button
            type={'primary'}
            onClick={async () => {
              if (currentCaseApiId) {
                const { code, msg } = await selectCommonApis2Case({
                  caseId: currentCaseApiId,
                  commonApis: selectedRowKeys as number[],
                });
                if (code === 0) {
                  message.success(msg);
                  refresh?.();
                }
              } else if (currentTaskId) {
                const { code, msg } = await associationApisByTaskId({
                  taskId: currentTaskId,
                  apiIds: selectedRowKeys as number[],
                });
                if (code === 0) {
                  message.success(msg);
                  refresh?.();
                }
              } else if (currentGroupId) {
                const { code, msg } = await addInterfaceGroupApis({
                  groupId: currentGroupId,
                  apiIds: selectedRowKeys as number[],
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
      request={fetchInterface}
    />
  );
};

export default InterfaceCaseChoiceApiTable;
