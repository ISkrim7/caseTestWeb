import { IExtracts } from '@/pages/Httpx/types';
import { IUICaseStepAPI } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import {
  EditableProTable,
  ProColumns,
  ProForm,
} from '@ant-design/pro-components';
import { FormInstance, Tag } from 'antd';
import React, { FC, useEffect, useState } from 'react';
interface SelfProps {
  apiForm: FormInstance<any>;
  apiData?: IUICaseStepAPI;
}
const Index: FC<SelfProps> = ({ apiForm, apiData }) => {
  const [extractsDataSource, setExtractsDataSource] = useState<IExtracts[]>([]);
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
  const extractColumns: ProColumns<IExtracts>[] = [
    {
      title: '变量名',
      dataIndex: 'key',
      width: '30%',
    },
    {
      title: '提取目标',
      dataIndex: 'target',
      valueType: 'select',
      width: '20%',
      valueEnum: CONFIG.EXTRACT_TARGET_ENUM,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '提取语法',
      dataIndex: 'value',
      valueType: 'textarea',
      width: '50%',
      fieldProps: {
        rows: 1,
      },
    },
    {
      title: 'Opt',
      valueType: 'option',
      width: '10%',
      render: (_: any, record: any) => {
        return (
          <>
            <a
              onClick={() => {
                setExtractsEditableRowKeys([record.id]);
              }}
            >
              编辑
            </a>
          </>
        );
      },
    },
  ];

  return (
    <ProForm form={apiForm} submitter={false}>
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
