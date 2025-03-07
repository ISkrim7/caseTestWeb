import {
  AssertOpt,
  ExtraOpt,
  TYPE_ENUM,
} from '@/pages/Httpx/componets/assertEnum';
import {
  FormEditableOnValueChange,
  FormEditableOnValueRemove,
} from '@/pages/Httpx/componets/FormEditableOnValueChange';
import { IAsserts, IInterfaceAPI } from '@/pages/Httpx/types';
import {
  EditableFormInstance,
  EditableProTable,
  ProColumns,
  ProForm,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC, useRef, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterAsserts: FC<SelfProps> = ({ form, mode }) => {
  const [assertsEditableKeys, setAssertsEditableRowKeys] = useState<
    React.Key[]
  >([]);
  const editorFormRef = useRef<EditableFormInstance<IAsserts>>();

  const assertColumns: ProColumns<IAsserts>[] = [
    {
      title: '提取方式',
      dataIndex: 'extraOpt',
      valueEnum: ExtraOpt,
      valueType: 'select',
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: '提取方式 必选',
          },
        ],
      },
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'text',
    },
    {
      title: '提取语法',
      dataIndex: 'extraValue',
      valueType: 'textarea',
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: '提取语法 必填',
          },
        ],
      },
      fieldProps: {
        rows: 1,
      },
    },
    {
      title: '断言方法',
      dataIndex: 'assertOpt',
      valueType: 'select',
      valueEnum: AssertOpt,
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: '断言方法 必填',
          },
        ],
      },
    },
    {
      title: '预期结果',
      dataIndex: 'expect',
      valueType: 'code',
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: '预期结果 必填',
          },
        ],
      },

      fieldProps: {
        rows: 2,
      },
    },
    {
      title: '预期类型',
      dataIndex: 'extraValueType',
      valueType: 'select',
      valueEnum: TYPE_ENUM,
      formItemProps: {
        required: true,
        rules: [
          {
            required: true,
            message: '预期类型 必填',
          },
        ],
      },

      fieldProps: { style: { color: 'greenyellow', borderRadius: '10px' } },
    },

    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (_: any, record: IAsserts, __, action) => {
        return (
          <a
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>
        );
      },
    },
  ];
  return (
    <ProForm form={form} disabled={false} submitter={false}>
      <ProForm.Item name={'asserts'} trigger={'onValuesChange'}>
        <EditableProTable<IAsserts>
          rowKey={'id'}
          toolBarRender={false}
          editableFormRef={editorFormRef}
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
            onSave: async () => {
              await FormEditableOnValueChange(form, 'asserts');
            },
            onDelete: async (key) => {
              await FormEditableOnValueRemove(form, 'asserts', key);
            },
            actionRender: (row, _, dom) => {
              return [dom.save, dom.cancel, dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default InterAsserts;
