import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { IParams } from '@/pages/Interface/types';
import { CodeOutlined } from '@ant-design/icons';
import {
  EditableProTable,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Modal } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';

import { IUICaseStepAPI } from '@/pages/UIPlaywright/uiTypes';
import { FormInstance } from 'antd';

interface SelfProps {
  apiForm: FormInstance<IUICaseStepAPI>;
  apiData?: IUICaseStepAPI;
}

const Index: FC<SelfProps> = ({ apiForm, apiData }) => {
  const timeoutRef = useRef<any>(null);
  const [kvData, setKVData] = useState<string>();
  const [paramsEditableKeys, setParamsEditableRowKeys] =
    useState<React.Key[]>();
  const [showError, setShowError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (apiData) {
      setParamsEditableRowKeys(apiData.params?.map((item) => item.id) || []);
    }
  }, [apiData]);

  const columns: ProColumns<IParams>[] = [
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
  const onModelFinish = () => {
    clearTimeout(timeoutRef.current);
    try {
      if (kvData) {
        const NewKVData = JSON.parse(kvData);
        const resultArray = Object.keys(NewKVData).map((key) => {
          return {
            key: key,
            value: NewKVData[key],
            id: Date.now(),
          };
        });
        apiForm.setFieldValue('params', resultArray);
        setParamsEditableRowKeys(resultArray.map((item) => item.id) || []);
        setIsModalOpen(false);
      }
    } catch (error) {
      setShowError(true);
    }
  };
  const handleOnChange = (value: any) => {
    clearTimeout(timeoutRef.current);
    setKVData(value);
    timeoutRef.current = setTimeout(() => {
      if (value) {
        try {
          setShowError(false);
        } catch (error) {
          setShowError(true);
        }
      }
    }, 1000); // 延迟1秒钟进行验证
  };
  const inputParams = () => {
    setKVData('');
    setIsModalOpen(true);
  };
  return (
    <ProForm form={apiForm} submitter={false}>
      <Modal
        title="导入参数"
        open={isModalOpen}
        onOk={onModelFinish}
        onCancel={() => {
          setIsModalOpen(false);
          setShowError(false);
        }}
      >
        <span style={{ color: 'gray' }}>
          快速导入到请求参数，支持 JSON/Key-value 格式
        </span>
        {showError && <p style={{ color: 'red' }}>JSON 格式错误，请检查。</p>}
        <AceCodeEditor onChange={handleOnChange} value={kvData} />
      </Modal>
      <span>
        <CodeOutlined style={{ color: 'gray' }} />
        <a style={{ color: 'gray' }} onClick={inputParams}>
          导入参数
        </a>
      </span>
      <ProForm.Item name={'params'} trigger={'onValuesChange'}>
        <EditableProTable<IParams>
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
            editableKeys: paramsEditableKeys,
            onChange: setParamsEditableRowKeys, // Update editable keys
            actionRender: (_, __, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default Index;
