import { IObjGet } from '@/api';
import { queryProject } from '@/api/base';
import { pageInterApi } from '@/api/inter';
import MyProTable from '@/components/Table/MyProTable';
import { IInterfaceAPI } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  currentProjectId?: number;
}

const InterfaceCaseChoiceApiTable: FC<SelfProps> = ({ currentProjectId }) => {
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [selectPartId, setSelectPartId] = useState<number>();
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [partEnumMap, setPartEnumMap] = useState<IObjGet>({});
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
      // fetchCaseParts(currentProjectId, setProjectEnumMap)
    }
  }, [currentProjectId]);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  const fetchInterface = useCallback(async (params: any, sort: any) => {
    const searchData = {
      ...params,
      //只查询公共api
      is_common: 1,
      sort: sort,
    };
    const { code, data } = await pageInterApi(searchData);
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

  const columns: ProColumns<IInterfaceAPI>[] = [
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      width: '10%',
      copyable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: '15%',
    },
    {
      title: '项目',
      dataIndex: 'project_id',
      hideInTable: true,
      valueType: 'select',
      valueEnum: projectEnumMap,
      initialValue: selectProjectId,
      fieldProps: {
        defaultValue: selectProjectId,
        onSelect: (value) => {
          setSelectProjectId(parseInt(value));
          setSelectPartId(null);
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
        onSelect: (value) => {
          setSelectPartId(value);
        },
        treeData: partEnumMap,
        fieldNames: {
          label: 'title',
        },
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
      width: '10%',
      valueEnum: CONFIG.API_STATUS_ENUM,
      render: (_, record) => {
        return CONFIG.API_STATUS_ENUM[record.status].tag;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: '10%',
      render: (_, record) => {
        return <Tag>{record.creatorName}</Tag>;
      },
    },
  ];

  return (
    <MyProTable
      columns={columns}
      rowKey={'id'}
      x={1000}
      actionRef={actionRef}
      request={fetchInterface}
    />
  );
};

export default InterfaceCaseChoiceApiTable;
