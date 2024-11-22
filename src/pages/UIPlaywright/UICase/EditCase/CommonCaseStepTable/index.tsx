import { ISearch } from '@/api';
import { handelCaseSteps, pageStepOptions } from '@/api/ui';
import MyProTable from '@/components/Table/MyProTable';
import { IUICaseSteps } from '@/pages/UIPlaywright/uiTypes';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { message, Tag } from 'antd';
import React, { FC } from 'react';

interface SelfProps {
  caseId: string;
  dataSource: IUICaseSteps[];
  setDataSource: React.Dispatch<React.SetStateAction<IUICaseSteps[]>>;
  actionRef: any;
}

const Index: FC<SelfProps> = (props) => {
  const { caseId, actionRef, dataSource, setDataSource } = props;
  const fetchCommonStepPage = async (values: ISearch) => {
    const newValue = { ...values, isCommonStep: 1 };
    const { code, data } = await pageStepOptions(newValue);
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
        success: false,
        total: 0,
      };
    }
  };
  const onSelect = async (record: IUICaseSteps, selected: boolean) => {
    const selectRow: IUICaseSteps = record;
    if (selected) {
      console.log('onSelect', record);
      if (dataSource.some((item) => item.id === selectRow.id)) {
        message.warning('该步骤已存在');
        return;
      }
      if (caseId) {
        //新增公共
        const addData = { caseId: caseId, ...record };
        const { code } = await handelCaseSteps(addData, 'POST');
        if (code === 0) {
          actionRef.current?.reload();
        }
      }
      const mergedValues: IUICaseSteps[] = dataSource
        ? [...dataSource, selectRow]
        : [selectRow];
      setDataSource([...mergedValues]);
    }
  };

  const commonColumns: ProColumns<IUICaseSteps>[] = [
    {
      title: '步骤ID',
      valueType: 'text',
      dataIndex: 'uid',
    },
    {
      title: '步骤名称',
      valueType: 'text',
      dataIndex: 'name',
    },
    {
      title: '步骤方法',
      dataIndex: 'method',
      render: (_, record) => <Tag color={'blue'}>{record.method}</Tag>,
    },
    {
      title: '步骤描述',
      key: 'desc',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      valueType: 'text',
    },
  ];
  return (
    <MyProTable
      rowSelection={{
        onSelect: onSelect,
        onChange: (selectedRowKeys, selectedRows) => {},
      }}
      headerTitle={'UI步骤表'}
      columns={commonColumns}
      rowKey={'id'}
      request={fetchCommonStepPage}
    />
  );
};

export default Index;
