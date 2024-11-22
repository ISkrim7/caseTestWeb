import { assertColumns } from '@/pages/Interface/Postman/component/AssertsTable/assertColumn';
import { IAsserts } from '@/pages/Interface/types';
import { IUICaseStepAPI } from '@/pages/UIPlaywright/uiTypes';
import {
  EditableFormInstance,
  EditableProTable,
  ProForm,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
interface SelfProps {
  apiForm: FormInstance<any>;
  apiData?: IUICaseStepAPI;
}

const Index: FC<SelfProps> = ({ apiForm, apiData }) => {
  const [assertsDataSource, setAssertsSource] = useState<IAsserts[]>([]);
  const [assertsEditableKeys, setAssertsEditableRowKeys] = useState<
    React.Key[]
  >(assertsDataSource.map((item) => item.id));
  const editableFormRef = useRef<EditableFormInstance>();

  useEffect(() => {
    if (apiData) {
      setAssertsEditableRowKeys(apiData.asserts?.map((item) => item.id) || []);
    }
  }, [apiData]);
  return (
    <ProForm form={apiForm} submitter={false}>
      <ProForm.Item name={'asserts'} trigger={'onValuesChange'}>
        <EditableProTable<IAsserts>
          rowKey={'id'}
          editableFormRef={editableFormRef}
          dataSource={assertsDataSource}
          toolBarRender={false}
          scroll={{ x: 1000 }}
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
