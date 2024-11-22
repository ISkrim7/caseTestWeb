import { ISteps } from '@/pages/Interface/types';
import { DragSortTable, ProCard } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  setSteps?: any;
  stepsForm: React.MutableRefObject<FormInstance<ISteps>[]>;
  stepsInfo?: ISteps[];
  openStepEdit: boolean;
}

const columns = [
  {
    title: '排序',
    dataIndex: 'sort',
    width: '10%',
  },
  {
    title: '步骤名称',
    dataIndex: 'name',
    width: '90%',
  },
];

const InterfaceStepEdit: FC<SelfProps> = ({
  stepsForm,
  setSteps,
  openStepEdit,
}) => {
  const [dataSource, setDataSource] = useState<ISteps[]>([]);

  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: ISteps[],
  ) => {
    // 更新 dataSource
    setDataSource(newDataSource);
    // 更新表单数据
    const newData = resetDataStep(newDataSource);
    console.log('==newData', newData);
    if (setSteps) {
      setSteps(newData);
    }
  };

  const resetDataStep = (data: ISteps[]) => {
    return data.map((item, index) => {
      return { ...item, step: index };
    });
  };

  useEffect(() => {
    if (stepsForm) {
      const _steps = stepsForm.current.map((f) => {
        return {
          ...f.getFieldsValue(true),
        };
      });
      console.log('edit form 改动', _steps);
      setDataSource(_steps);
    }
  }, [openStepEdit]);

  return (
    <ProCard type={'inner'} headerBordered bodyStyle={{ padding: 0 }}>
      <DragSortTable
        toolBarRender={false}
        options={false}
        search={false}
        columns={columns}
        dataSource={dataSource}
        rowKey="step"
        onDragSortEnd={handleDragSortEnd}
        pagination={false}
        dragSortKey="sort"
      />
    </ProCard>
  );
};

export default InterfaceStepEdit;
