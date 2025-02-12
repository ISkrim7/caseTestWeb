import { IExtracts, IInterfaceAPI } from '@/pages/Httpx/types';
import { CONFIG } from '@/utils/config';
import {
  EditableProTable,
  ProColumns,
  ProForm,
} from '@ant-design/pro-components';
import { FormInstance, Tag } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterExtracts: FC<SelfProps> = ({ form, mode }) => {
  const [extractsEditableKeys, setExtractsEditableRowKeys] = useState<
    React.Key[]
  >([]);
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
      tooltip: 'json&cookie:语法为jsonpath; text:语法为正则',
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
            {mode !== 1 ? (
              <a
                onClick={() => {
                  setExtractsEditableRowKeys([record.id]);
                }}
              >
                编辑
              </a>
            ) : null}
          </>
        );
      },
    },
  ];
  return (
    <ProForm form={form} submitter={false}>
      <ProForm.Item name={'extracts'} trigger={'onValuesChange'}>
        <EditableProTable<IExtracts>
          rowKey={'id'}
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
              return [dom.delete, dom.save, dom.cancel];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default InterExtracts;
