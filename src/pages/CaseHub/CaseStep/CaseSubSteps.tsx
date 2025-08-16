import { CaseSubStep } from '@/pages/CaseHub/type';
import { MenuOutlined } from '@ant-design/icons';
import { DragSortTable, ProCard, ProColumns } from '@ant-design/pro-components';
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
    dataIndex: 'do',
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
    width: '8%',
  },
];

interface IProps {
  caseSubStepDataSource: CaseSubStep[];
  setCaseSubStepDataSource: React.Dispatch<React.SetStateAction<CaseSubStep[]>>;
}

const CaseSubSteps: FC<IProps> = ({
  caseSubStepDataSource,
  setCaseSubStepDataSource,
}) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();

  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    setCaseSubStepDataSource(newDataSource);
  };
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
  return (
    <ProCard>
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
            return [defaultDoms.delete, <a>复制</a>];
          },
          onValuesChange: (record: CaseSubStep, dataSource: CaseSubStep[]) => {
            console.log(dataSource);
            handleValuesChange(dataSource);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </ProCard>
  );
};

export default CaseSubSteps;
