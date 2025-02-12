import SetKv2Query from '@/pages/Httpx/componets/setKv2Query';
import { IFromData, IInterfaceAPI } from '@/pages/Httpx/types';
import {
  EditableProTable,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { FormInstance } from 'antd';
import React, { FC, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const FormData: FC<SelfProps> = ({ form, mode }) => {
  const [dataEditableKeys, setDataEditableRowKeys] = useState<React.Key[]>();
  const columns: ProColumns<IFromData>[] = [
    {
      title: 'key',
      key: 'key',
      dataIndex: 'key',
      width: '30%',
      renderFormItem: (_, { record }) => {
        return (
          <ProFormText
            name={'key'}
            noStyle={true}
            fieldProps={{ value: record?.key }}
          />
        );
      },
    },
    {
      title: 'value',
      key: 'value',
      dataIndex: 'value',
      width: '30%',
    },
    // {
    //   title: 'content-type',
    //   key: 'content_type',
    //   dataIndex: 'content_type',
    //   width: '30%',
    //   valueType: 'select',
    //   valueEnum: FormDataTypeEnum,
    // },
    {
      title: 'desc',
      key: 'desc',
      dataIndex: 'desc',
      width: '30%',
    },
    {
      title: 'opt',
      valueType: 'option',
      render: (_: any, record: any) => {
        return (
          <>
            {mode !== 1 ? (
              <a
                onClick={() => {
                  setDataEditableRowKeys([record.id]);
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
      <SetKv2Query
        callBack={(resultArray: any) => {
          form.setFieldValue('data', resultArray);
          setDataEditableRowKeys(resultArray.map((item: any) => item.id) || []);
        }}
      />
      <ProForm.Item name={'data'} trigger={'onValuesChange'}>
        <EditableProTable<IFromData>
          rowKey={'id'}
          toolBarRender={false}
          columns={columns}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys: dataEditableKeys,
            onChange: setDataEditableRowKeys, // Update editable keys
            actionRender: (_, __, dom) => {
              return [dom.save, dom.delete, dom.cancel];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default FormData;
