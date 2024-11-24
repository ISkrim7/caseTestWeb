import { assertColumns } from '@/pages/Httpx/componets/assertColumn';
import { IAsserts, IInterfaceAPI } from '@/pages/Interface/types';
import { EditableProTable, ProForm } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterAsserts: FC<SelfProps> = ({ form, mode }) => {
  const [assertsEditableKeys, setAssertsEditableRowKeys] = useState<
    React.Key[]
  >([]);
  return (
    <ProForm form={form} submitter={false}>
      <ProForm.Item name={'asserts'} trigger={'onValuesChange'}>
        <EditableProTable<IAsserts>
          rowKey={'id'}
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

export default InterAsserts;
