import { ExtraOpt } from '@/pages/Httpx/componets/assertEnum';
import {
  FormEditableOnValueChange,
  FormEditableOnValueRemove,
} from '@/pages/Httpx/componets/FormEditableOnValueChange';
import { IExtracts, IInterfaceAPI } from '@/pages/Httpx/types';
import { CONFIG } from '@/utils/config';
import {
  EditableFormInstance,
  EditableProTable,
  ProColumns,
  ProForm,
} from '@ant-design/pro-components';
import { FormInstance, Tag } from 'antd';
import React, { FC, useRef, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterExtracts: FC<SelfProps> = ({ form, mode }) => {
  const [extractsEditableKeys, setExtractsEditableRowKeys] = useState<
    React.Key[]
  >([]);
  const editorFormRef = useRef<EditableFormInstance<IExtracts>>();
  const extractColumns: ProColumns<IExtracts>[] = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: '10%',
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: 'Key 必填',
          },
        ],
      },
    },
    {
      title: 'Target',
      dataIndex: 'target',
      valueType: 'select',
      width: '10%',
      valueEnum: CONFIG.EXTRACT_TARGET_ENUM,
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: '请选择提取目标',
          },
        ],
      },
    },
    {
      title: '提取方式',
      dataIndex: 'extraOpt',
      valueEnum: ExtraOpt,
      valueType: 'select',
      width: '10%',

      initialValue: ExtraOpt.jmespath.text,
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: '提取方式 必选',
          },
        ],
      },
      render: (_, record) => {
        return <Tag color={'blue'}>{record.extraOpt}</Tag>;
      },
    },
    {
      title: 'Script',
      dataIndex: 'value',
      tooltip: 'json&cookie:语法为jsonpath&jemspath; \n text:语法为正则',
      valueType: 'textarea',
      width: '40%',
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: 'Script 必填',
          },
        ],
      },
      fieldProps: {
        rows: 1,
      },
    },
    {
      title: 'Opt',
      valueType: 'option',
      width: '20%',
      render: (_: any, record: IExtracts, __, action) => {
        return [
          <a
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>,
        ];
      },
    },
  ];
  return (
    <>
      <ProForm.Item name={'extracts'} trigger={'onValuesChange'}>
        <EditableProTable<IExtracts>
          rowKey={'id'}
          editableFormRef={editorFormRef}
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
            onDelete: async (key) => {
              await FormEditableOnValueRemove(form, 'extracts', key);
            },
            onSave: async () => {
              return await FormEditableOnValueChange(form, 'extracts');
            },
            actionRender: (row, _, dom) => {
              return [dom.save, dom.cancel, dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </>
  );
};

export default InterExtracts;
