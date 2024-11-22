import React, { FC, useEffect, useState } from 'react';
import { FormInstance, Tag } from 'antd';
import { IExtracts, ISteps } from '@/pages/Interface/types';
import { EditableProTable, ProForm } from '@ant-design/pro-components';
import ExtractColumns from '@/pages/Interface/Postman/component/ExtractTable/extractColumns';

interface SelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
}

const Index: FC<SelfProps> = (props) => {
  const { stepForm, stepInfo } = props;
  const [extractsDataSource, setExtractsDataSource] = useState<IExtracts[]>(
    stepInfo?.extracts || [],
  );
  const { extractColumns } = ExtractColumns();
  const [extractsEditableKeys, setExtractsEditableRowKeys] = useState<
    React.Key[]
  >(extractsDataSource.map((item) => item.id));

  useEffect(() => {
    if (stepInfo) {
      setExtractsEditableRowKeys(
        stepInfo.extracts?.map((item) => item.id) || [],
      );
    }
  }, [stepInfo]);

  return (
    <ProForm form={stepForm} submitter={false}>
      <ProForm.Item name={'extracts'} trigger={'onValuesChange'}>
        <EditableProTable<IExtracts>
          rowKey={'id'}
          dataSource={extractsDataSource}
          toolBarRender={false}
          columns={extractColumns}
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
