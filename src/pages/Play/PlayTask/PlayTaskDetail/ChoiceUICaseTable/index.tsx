import { IObjGet } from '@/api';
import { queryProject } from '@/api/base';
import { pageUICase } from '@/api/play';
import { associationUICasesByTaskId } from '@/api/play/task';
import MyProTable from '@/components/Table/MyProTable';
import { fetchCaseParts } from '@/pages/UIPlaywright/someFetch';
import { CasePartEnum, IUICase } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import { pageData } from '@/utils/somefunc';
import { history } from '@@/core/history';
import { ActionType, ProCard } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, message, Tag } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SelfProps {
  currentTaskId?: string;
  refresh?: () => void;
}

const Index: FC<SelfProps> = ({ currentTaskId, refresh }) => {
  const [selectProjectId, setSelectProjectId] = useState<number>();
  const [selectPartId, setSelectPartId] = useState<number>();
  const [projectEnumMap, setProjectEnumMap] = useState<IObjGet>({});
  const [partEnumMap, setPartEnumMap] = useState<CasePartEnum[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

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
    if (selectProjectId) {
      fetchCaseParts(selectProjectId, setPartEnumMap).then();
    }
  }, [selectProjectId]);
  const columns: ProColumns<IUICase>[] = [
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
      title: '用例编号',
      dataIndex: 'uid',
      key: 'uid',
      width: '10%',
      render: (_, record) => (
        <a
          target="_blank"
          rel="noopener noreferrer"
          key="view"
          onClick={() => {
            history.push(`/ui/case/detail/caseId=${record.id}`);
          }}
        >
          {record.uid}
        </a>
      ),
    },
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => {
        return <span>{record.title}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.CASE_STATUS_ENUM,
      render: (_, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_STATUS[record.status].color}>
            {CONFIG.RENDER_CASE_STATUS[record.status].text}
          </Tag>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      search: false,
    },
  ];

  const rowSelection: TableRowSelection<IUICase> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const fetchUICases = useCallback(async (params: any, sort: any) => {
    const { code, data } = await pageUICase({ ...params, sort: sort });
    return pageData(code, data);
  }, []);

  return (
    <ProCard>
      <MyProTable
        rowSelection={rowSelection}
        headerTitle={'UI用例表'}
        columns={columns}
        actionRef={actionRef}
        rowKey={'id'}
        request={fetchUICases}
        x={1000}
        // @ts-ignore
        tableAlertOptionRender={() => {
          return (
            <Button
              type={'primary'}
              onClick={async () => {
                if (currentTaskId) {
                  const { code, msg } = await associationUICasesByTaskId({
                    taskId: currentTaskId,
                    caseIdList: selectedRowKeys as number[],
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
      />
    </ProCard>
  );
};

export default Index;
