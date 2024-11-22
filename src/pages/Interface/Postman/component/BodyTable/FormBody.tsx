import { IParams, ISteps } from '@/pages/Interface/types';
import { EditableProTable, ProForm } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
  step: number;
}

const FormBody: FC<SelfProps> = (props) => {
  const { stepForm, stepInfo } = props;
  const [paramsEditableKeys, setParamsEditableRowKeys] =
    useState<React.Key[]>();
  const [dataSource, setDataSource] = useState<any>(null);
  useEffect(() => {
    if (stepInfo) {
      if (stepInfo.bodyType === 2 && stepInfo.body) {
        setDataSource(stepInfo.body);
        setParamsEditableRowKeys(
          stepInfo.body?.map((item: any) => item.id) || [],
        );
      }
    }
  }, [stepInfo]);

  useEffect(() => {
    if (dataSource) {
      stepForm.setFieldsValue({ body: dataSource });
    }
  }, [dataSource]);
  const columns: ProColumns<IParams>[] = [
    {
      title: 'key',
      key: 'key',
      dataIndex: 'key',
      width: '30%',
    },
    {
      title: 'value',
      key: 'value',
      dataIndex: 'value',
      width: '30%',
    },

    {
      title: 'desc',
      key: 'desc',
      dataIndex: 'desc',
      width: '30%',
    },
    {
      title: 'opt',
      valueType: 'option',
      width: '10%',
    },
  ];
  return (
    <ProForm form={stepForm} submitter={false}>
      <EditableProTable
        rowKey={'id'}
        toolBarRender={false}
        columns={columns}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
          }),
        }}
        editable={{
          type: 'multiple',
          editableKeys: paramsEditableKeys,
          onChange: setParamsEditableRowKeys, // Update editable keys
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
          actionRender: (_, __, dom) => {
            return [dom.delete];
          },
        }}
      />
    </ProForm>
  );
};

export default FormBody;
