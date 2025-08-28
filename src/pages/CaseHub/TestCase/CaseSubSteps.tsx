import { CaseSubStep } from '@/pages/CaseHub/type';
import { MenuOutlined } from '@ant-design/icons';
import {
  DragSortTable,
  ProCard,
  ProColumns,
  ProForm,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { debounce } from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';

const caseInfoColumn: ProColumns<CaseSubStep>[] = [
  {
    title: '步骤',
    dataIndex: 'sort',
    width: '5%',
    editable: false,
  },
  {
    title: '操作步骤',
    dataIndex: 'action',
    valueType: 'textarea',
    ellipsis: true,
    fieldProps: {
      rows: 2,
      allowClear: true,
      fontWeight: 'bold',
      variant: 'filled',
    },
  },
  {
    title: '预期结果',
    dataIndex: 'expected_result',
    valueType: 'textarea',
    ellipsis: true,
    fieldProps: {
      rows: 2,
      variant: 'filled',
      allowClear: true,
    },
  },
  {
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    width: '8%',
  },
];

interface IProps {
  caseSubStepDataSource?: CaseSubStep[];
  setCaseSubStepDataSource: React.Dispatch<React.SetStateAction<CaseSubStep[]>>;
  save: React.ReactNode;
}

const CaseSubSteps: FC<IProps> = ({
  save,
  caseSubStepDataSource,
  setCaseSubStepDataSource,
}) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();

  // 使用 useCallback 来确保 handleDragSortEnd 不会在每次渲染时重新定义
  const handleDragSortEnd = useCallback(
    (beforeIndex: number, afterIndex: number, newDataSource: any) => {
      setCaseSubStepDataSource(newDataSource);
    },
    [setCaseSubStepDataSource],
  );
  // 使用 debounce 来避免每次都直接更新
  const handleValuesChange = useCallback(
    debounce((dataSource: CaseSubStep[]) => {
      setCaseSubStepDataSource(dataSource);
    }, 300), // 300ms 的延迟
    [setCaseSubStepDataSource],
  );
  useEffect(() => {
    if (caseSubStepDataSource) {
      setEditableRowKeys(
        caseSubStepDataSource.map((item: CaseSubStep) => item.id),
      );
    }
  }, [caseSubStepDataSource]);

  const copySubStep = async (record: CaseSubStep) => {
    const newStep: CaseSubStep = {
      id: Date.now(),
      action: record.action,
      expected_result: record.expected_result,
    };
    setCaseSubStepDataSource((prev) => [...prev, newStep]);
  };
  return (
    <ProCard>
      <ProFormTextArea
        name={'case_step_setup'}
        placeholder={'请输入用例前置'}
        fieldProps={{
          variant: 'filled',
          rows: 1,
        }}
      />
      <ProForm.Item name={'case_sub_step'}>
        <DragSortTable<CaseSubStep>
          columns={caseInfoColumn}
          rowKey="id"
          search={false}
          pagination={false}
          toolBarRender={false}
          dataSource={caseSubStepDataSource}
          dragSortKey="sort"
          onDragSortEnd={handleDragSortEnd}
          dragSortHandlerRender={() => (
            <MenuOutlined style={{ cursor: 'grab', color: 'gold' }} />
          )}
          editable={{
            type: 'multiple',
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
              return [
                <a onClick={async () => await copySubStep(row)}>复制</a>,
                <a>删除</a>,
              ];
            },
            onValuesChange: (
              record: CaseSubStep,
              dataSource: CaseSubStep[],
            ) => {
              handleValuesChange(dataSource);
            },
            onChange: setEditableRowKeys,
          }}
        />
      </ProForm.Item>
      <ProFormTextArea
        name={'case_step_mark'}
        placeholder={'请输入备注'}
        fieldProps={{
          variant: 'filled',
          rows: 1,
        }}
      />
      <Space
        style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
      >
        {save}
        <Button>Pass</Button>
        <Button>Fail</Button>
      </Space>
    </ProCard>
  );
};

export default CaseSubSteps;
