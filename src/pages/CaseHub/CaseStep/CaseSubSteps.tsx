import {
  EditableProTable,
  ProCard,
  ProColumns,
} from '@ant-design/pro-components';
import { Space } from 'antd';
import React, { useState } from 'react';

type CaseSubStepType = {
  id: React.Key;
  step: number;
  todo: string;
  exp: string;
};
const CaseSubSteps = () => {
  const [caseStepSource, setCaseStepInfoSource] = useState<CaseSubStepType[]>(
    [],
  );
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    caseStepSource.map((item: any) => item.id),
  );

  const caseInfoColumn: ProColumns<CaseSubStepType>[] = [
    {
      title: '步骤',
      dataIndex: 'step',
      width: '8%',
      valueType: 'index',
    },
    {
      title: '操作步骤',
      dataIndex: 'todo',
      valueType: 'textarea',
      ellipsis: true,
      fieldProps: {
        rows: 2,
        fontWeight: 'bold',
      },
    },
    {
      title: '预期结果',
      dataIndex: 'exp',
      valueType: 'textarea',
      ellipsis: true,
      fieldProps: {
        rows: 2,
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 70,
      render: (_, record: CaseSubStepType) => (
        <Space>
          <a
            key="delete"
            type="primary"
            onClick={() => {
              // const data = caseStepInfo.filter(
              //   (item: any) => item.id !== record.id,
              // );
              // setStepCaseInfo(data);
            }}
          >
            删除
          </a>
          <a>复制</a>
        </Space>
      ),
    },
  ];

  return (
    <ProCard>
      <EditableProTable<CaseSubStepType>
        value={caseStepSource}
        search={false}
        options={false}
        columns={caseInfoColumn}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
          }),
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setCaseStepInfoSource(recordList);
          },
          onChange: setEditableRowKeys,
        }}
        rowKey={'id'}
      />
    </ProCard>
  );
};

export default CaseSubSteps;
