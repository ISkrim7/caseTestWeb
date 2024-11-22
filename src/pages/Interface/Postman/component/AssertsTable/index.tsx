import React, { FC, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { IAsserts, ISteps } from '@/pages/Interface/types';
import {
  EditableFormInstance,
  EditableProTable,
  ProForm,
} from '@ant-design/pro-components';
import { assertColumns } from '@/pages/Interface/Postman/component/AssertsTable/assertColumn';

interface SelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
}

const Index: FC<SelfProps> = ({ stepInfo, stepForm }) => {
  const [assertsDataSource, setAssertsSource] = useState<IAsserts[]>([]);
  const [assertsEditableKeys, setAssertsEditableRowKeys] = useState<
    React.Key[]
  >(assertsDataSource.map((item) => item.id));
  const editableFormRef = useRef<EditableFormInstance>();
  const [extraValueType, setExtraValueType] = useState<string>('string'); // 添加状态
  useEffect(() => {
    if (stepInfo) {
      setAssertsEditableRowKeys(stepInfo.asserts?.map((item) => item.id) || []);
    }
  }, [stepInfo]);

  return (
    <ProForm form={stepForm} submitter={false}>
      <ProForm.Item name={'asserts'} trigger={'onValuesChange'}>
        <EditableProTable<IAsserts>
          rowKey={'id'}
          editableFormRef={editableFormRef}
          dataSource={assertsDataSource}
          toolBarRender={false}
          columns={assertColumns}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys: assertsEditableKeys,
            onChange: setAssertsEditableRowKeys,
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};
export default Index;
