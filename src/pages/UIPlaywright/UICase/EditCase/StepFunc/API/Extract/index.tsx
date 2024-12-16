import { IExtracts } from '@/pages/Httpx/types';
import { IUICaseStepAPI } from '@/pages/UIPlaywright/uiTypes';
import { EditableProTable, ProForm } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC, useEffect, useState } from 'react';
interface SelfProps {
  apiForm: FormInstance<any>;
  apiData?: IUICaseStepAPI;
}
const Index: FC<SelfProps> = ({ apiForm, apiData }) => {
  const [extractsDataSource, setExtractsDataSource] = useState<IExtracts[]>([]);
  // const { extractColumns } = ExtractColumns();
  const [extractsEditableKeys, setExtractsEditableRowKeys] = useState<
    React.Key[]
  >(extractsDataSource.map((item) => item.id));

  useEffect(() => {
    if (apiData) {
      setExtractsEditableRowKeys(
        apiData.extracts?.map((item) => item.id) || [],
      );
    }
  }, [apiData]);

  return (
    <ProForm form={apiForm} submitter={false}>
      <ProForm.Item name={'extracts'} trigger={'onValuesChange'}>
        <EditableProTable<IExtracts>
          rowKey={'id'}
          dataSource={extractsDataSource}
          toolBarRender={false}
          columns={[]}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys: extractsEditableKeys,
            onChange: setExtractsEditableRowKeys,
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
