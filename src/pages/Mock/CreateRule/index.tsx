import { detailInterApiById } from '@/api/inter';
import type { IMockRule } from '@/api/mock';
import { mockApi } from '@/api/mock';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import ApiVariableFunc from '@/pages/Httpx/componets/ApiVariableFunc';
import SetKv2Query from '@/pages/Httpx/componets/setKv2Query';
import {
  EditableProTable,
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-table';
import { useUpdate } from 'ahooks';
import {
  Button,
  Card,
  Divider,
  Form,
  message,
  Modal,
  Radio,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

const { TabPane } = Tabs;
const { Text } = Typography;

// 定义键值对类型
interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  desc?: string;
  type?: 'text' | 'file';
}

interface MockCreateRuleProps {
  interId: number;
  interPath?: string;
  interMethod?: string;
  onSuccess: () => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
  initialValues?: IMockRule;
}

const METHOD_BODY_MAPPING: Record<string, number[]> = {
  GET: [0],
  POST: [0, 1, 2],
  PUT: [0, 1, 2],
  PATCH: [0, 1, 2],
  DELETE: [0],
};

// 新增响应头组件
const ResHeaders: React.FC<{
  resheaders: KeyValuePair[];
  setRESHeaders: React.Dispatch<React.SetStateAction<KeyValuePair[]>>;
  title: string;
}> = ({ resheaders, setRESHeaders, title }) => {
  const columns: ProColumns<KeyValuePair>[] = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: '30%',
      formItemProps: { rules: [{ required: true, message: 'Key不能为空' }] },
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : '-'),
      renderFormItem: (_, { record }) => {
        if (!record) return null;
        return (
          <ProFormText
            noStyle
            name="key"
            fieldProps={{
              value: record.key,
              onChange: (e) => {
                const newData = [...resheaders];
                const index = newData.findIndex(
                  (item) => item.id === record.id,
                );
                if (index > -1) {
                  newData[index].key = e.target.value;
                  setRESHeaders(newData);
                }
              },
            }}
          />
        );
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '40%',
      render: (_, record) => (
        <Tag color={record.value?.includes('{{$') ? 'orange' : 'blue'}>
          {record.value || '-'}
        </Tag>
      ),
      renderFormItem: (_, { record }) => {
        if (!record) return null;
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <ProFormText
              noStyle
              name="value"
              fieldProps={{
                value: record.value,
                onChange: (e) => {
                  const newData = [...resheaders];
                  const index = newData.findIndex(
                    (item) => item.id === record.id,
                  );
                  if (index > -1) {
                    newData[index].value = e.target.value;
                    setRESHeaders(newData);
                  }
                },
              }}
            />
            <ApiVariableFunc
              value={record.value || ''}
              setValue={(_, data) => {
                const newData = [...resheaders];
                const index = newData.findIndex(
                  (item) => item.id === record.id,
                );
                if (index > -1) {
                  newData[index].value = data.value;
                  setRESHeaders(newData);
                }
              }}
            />
          </div>
        );
      },
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
      width: '20%',
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : '-'),
      renderFormItem: (_, { record }) => {
        if (!record) return null;
        return (
          <ProFormText
            noStyle
            name="desc"
            fieldProps={{
              value: record.desc,
              onChange: (e) => {
                const newData = [...resheaders];
                const index = newData.findIndex(
                  (item) => item.id === record.id,
                );
                if (index > -1) {
                  newData[index].desc = e.target.value;
                  setRESHeaders(newData);
                }
              },
            }}
          />
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: '10%',
      render: (_, record, __, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const newData = resheaders.filter((item) => item.id !== record.id);
            setRESHeaders(newData);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <Card title={title} style={{ marginBottom: 16 }} bodyStyle={{ padding: 0 }}>
      <SetKv2Query
        callBack={(resultArray: KeyValuePair[]) => {
          setRESHeaders([...resultArray]);
        }}
      />
      <EditableProTable<KeyValuePair>
        rowKey="id"
        value={resheaders}
        onChange={(newDataSource) => {
          if (newDataSource) {
            setRESHeaders([...newDataSource]);
          }
        }}
        columns={columns}
        recordCreatorProps={{
          creatorButtonText: '添加一行',
          record: () => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            key: '',
            value: '',
            description: '',
          }),
          newRecordType: 'dataSource',
        }}
        editable={{
          editableKeys: resheaders.map((item) => item.id),
          // actionRender: (row, config, dom) => [
          //   dom.save,
          //   dom.cancel,
          //   dom.delete
          // ],
          actionRender: (row, config, dom) => [dom.delete],
          onSave: async (key, row) => {
            const newData = resheaders.map((item) =>
              item.id === key ? { ...row } : item,
            );
            setRESHeaders(newData);
          },
          onDelete: async (key) => {
            setRESHeaders(resheaders.filter((item) => item.id !== key));
          },
        }}
      />
    </Card>
  );
};

const ReqHeaders: React.FC<{
  headers: KeyValuePair[];
  setHeaders: React.Dispatch<React.SetStateAction<KeyValuePair[]>>;
  title: string;
}> = ({ headers, setHeaders, title }) => {
  console.log('ReqHeaders数据:', headers); // 添加调试日志
  const columns: ProColumns<KeyValuePair>[] = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: '30%',
      formItemProps: { rules: [{ required: true, message: 'Key不能为空' }] },
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : '-'),
      renderFormItem: (_, { record }) => {
        if (!record) return null;
        return (
          <ProFormText
            noStyle
            name="key"
            fieldProps={{
              value: record.key,
              onChange: (e) => {
                const newData = [...headers];
                const index = newData.findIndex(
                  (item) => item.id === record.id,
                );
                if (index > -1) {
                  newData[index].key = e.target.value;
                  setHeaders(newData);
                }
              },
            }}
          />
        );
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '40%',
      render: (_, record) => (
        <Tag color={record.value?.includes('{{$') ? 'orange' : 'blue'}>
          {record.value || '-'}
        </Tag>
      ),
      renderFormItem: (_, { record }) => {
        if (!record) return null;
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <ProFormText
              noStyle
              name="value"
              fieldProps={{
                value: record.value,
                onChange: (e) => {
                  const newData = [...headers];
                  const index = newData.findIndex(
                    (item) => item.id === record.id,
                  );
                  if (index > -1) {
                    newData[index].value = e.target.value;
                    setHeaders(newData);
                  }
                },
              }}
            />
            <ApiVariableFunc
              value={record.value || ''}
              setValue={(_, data) => {
                const newData = [...headers];
                const index = newData.findIndex(
                  (item) => item.id === record.id,
                );
                if (index > -1) {
                  newData[index].value = data.value;
                  setHeaders(newData);
                }
              }}
            />
          </div>
        );
      },
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
      width: '20%',
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : '-'),
      renderFormItem: (_, { record }) => {
        if (!record) return null;
        return (
          <ProFormText
            noStyle
            name="desc"
            fieldProps={{
              value: record.desc,
              onChange: (e) => {
                const newData = [...headers];
                const index = newData.findIndex(
                  (item) => item.id === record.id,
                );
                if (index > -1) {
                  newData[index].desc = e.target.value;
                  setHeaders(newData);
                }
              },
            }}
          />
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: '10%',
      render: (_, record, __, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const newData = headers.filter((item) => item.id !== record.id);
            setHeaders(newData);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <Card title={title} style={{ marginBottom: 16 }} bodyStyle={{ padding: 0 }}>
      <SetKv2Query
        callBack={(resultArray: KeyValuePair[]) => {
          setHeaders([...resultArray]);
        }}
      />
      <EditableProTable<KeyValuePair>
        rowKey="id"
        value={headers}
        onChange={(newDataSource) => {
          if (newDataSource) {
            setHeaders([...newDataSource]);
          }
        }}
        columns={columns}
        recordCreatorProps={{
          creatorButtonText: '添加一行',
          record: () => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            key: '',
            value: '',
            description: '',
          }),
          newRecordType: 'dataSource',
        }}
        editable={{
          editableKeys: headers.map((item) => item.id),
          actionRender: (row, config, dom) => [dom.delete],
          onSave: async (key, row) => {
            const newData = headers.map((item) =>
              item.id === key ? { ...row } : item,
            );
            setHeaders(newData);
          },
          onDelete: async (key) => {
            setHeaders(headers.filter((item) => item.id !== key));
          },
        }}
      />
    </Card>
  );
};

// Query 参数组件
const InterQueryParams: React.FC<{
  queryParams: KeyValuePair[];
  setQueryParams: React.Dispatch<React.SetStateAction<KeyValuePair[]>>;
  title: string;
}> = ({ queryParams, setQueryParams, title }) => {
  console.log('Query数据:', queryParams); // 添加调试日志
  const columns: ProColumns<KeyValuePair>[] = [
    {
      title: 'Key',
      dataIndex: 'key',
      width: '30%',
      formItemProps: { rules: [{ required: true, message: 'Key不能为空' }] },
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : '-'),
      renderFormItem: (_, { record }) => {
        if (!record) return null;
        return (
          <ProFormText
            noStyle
            name="key"
            fieldProps={{
              value: record.key,
              onChange: (e) => {
                const newData = [...queryParams];
                const index = newData.findIndex(
                  (item) => item.id === record.id,
                );
                if (index > -1) {
                  newData[index].key = e.target.value;
                  setQueryParams(newData);
                }
              },
            }}
          />
        );
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '40%',
      render: (_, record) => (
        <Tag color={record.value?.includes('{{$') ? 'orange' : 'blue'}>
          {record.value || '-'}
        </Tag>
      ),
      renderFormItem: (_, { record }) => {
        if (!record) return null;
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <ProFormText
              noStyle
              name="value"
              fieldProps={{
                value: record.value,
                onChange: (e) => {
                  const newData = [...queryParams];
                  const index = newData.findIndex(
                    (item) => item.id === record.id,
                  );
                  if (index > -1) {
                    newData[index].value = e.target.value;
                    setQueryParams(newData);
                  }
                },
              }}
            />
            <ApiVariableFunc
              value={record.value || ''}
              setValue={(_, data) => {
                const newData = [...queryParams];
                const index = newData.findIndex(
                  (item) => item.id === record.id,
                );
                if (index > -1) {
                  newData[index].value = data.value;
                  setQueryParams(newData);
                }
              }}
            />
          </div>
        );
      },
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
      width: '20%',
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : '-'),
      renderFormItem: (_, { record }) => {
        if (!record) return null;
        return (
          <ProFormText
            noStyle
            name="desc"
            fieldProps={{
              value: record.desc,
              onChange: (e) => {
                const newData = [...queryParams];
                const index = newData.findIndex(
                  (item) => item.id === record.id,
                );
                if (index > -1) {
                  newData[index].desc = e.target.value;
                  setQueryParams(newData);
                }
              },
            }}
          />
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: '10%',
      render: (_, record, __, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const newData = queryParams.filter((item) => item.id !== record.id);
            setQueryParams(newData);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <Card title={title} style={{ marginBottom: 16 }} bodyStyle={{ padding: 0 }}>
      <SetKv2Query
        callBack={(resultArray: KeyValuePair[]) => {
          setQueryParams([...resultArray]);
        }}
      />
      <EditableProTable<KeyValuePair>
        rowKey="id"
        value={queryParams}
        onChange={(newDataSource) => {
          if (newDataSource) {
            setQueryParams([...newDataSource]);
          }
        }}
        columns={columns}
        recordCreatorProps={{
          creatorButtonText: '添加一行',
          record: () => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            key: '',
            value: '',
            description: '',
          }),
          newRecordType: 'dataSource',
        }}
        editable={{
          editableKeys: queryParams.map((item) => item.id),
          actionRender: (row, config, dom) => [dom.delete],
          onSave: async (key, row) => {
            const newData = queryParams.map((item) =>
              item.id === key ? { ...row } : item,
            );
            setQueryParams(newData);
          },
          onDelete: async (key) => {
            setQueryParams(queryParams.filter((item) => item.id !== key));
          },
        }}
      />
    </Card>
  );
};

// Body 组件
const InterBody: React.FC<{
  bodyType: number;
  rawType: string;
  rawBody: string;
  setRawBody: (value: string) => void;
  formData: KeyValuePair[];
  setFormData: React.Dispatch<React.SetStateAction<KeyValuePair[]>>;
  currentMethod: string;
  availableBodyTypes: number[];
}> = ({
  bodyType,
  rawType,
  rawBody,
  setRawBody,
  formData,
  setFormData,
  currentMethod,
  availableBodyTypes,
}) => {
  if (currentMethod === 'GET' || bodyType === 0) {
    // if (bodyType === 0) {
    return (
      <Card>
        <p style={{ textAlign: 'center', padding: 24, color: '#999' }}>
          {currentMethod === 'GET' ? 'GET请求没有请求体' : '未设置请求体类型'}
        </p>
      </Card>
    );
  }

  if (bodyType === 1) {
    return (
      <Card
        title="Raw内容"
        extra={
          <ProFormSelect
            name="raw_type"
            options={[
              { label: 'JSON', value: 'json' },
              { label: 'Text', value: 'text' },
              { label: 'XML', value: 'xml' },
            ]}
            fieldProps={{
              style: { width: 100 },
              size: 'small' as const,
            }}
          />
        }
        bodyStyle={{ padding: 0 }}
      >
        <AceCodeEditor
          height="200px"
          value={rawBody}
          onChange={(value) => setRawBody(value)}
          _mode={rawType || 'json'}
          enableBasicAutocompletion
          enableLiveAutocompletion
        />
      </Card>
    );
  }

  if (bodyType === 2) {
    const columns: ProColumns<KeyValuePair>[] = [
      {
        title: 'Key',
        dataIndex: 'key',
        formItemProps: { rules: [{ required: true, message: 'Key不能为空' }] },
        renderFormItem: (_, { record }) => {
          if (!record) return null;
          return (
            <ProFormText
              noStyle
              name="key"
              fieldProps={{
                value: record.key,
                onChange: (e) => {
                  const newData = [...formData];
                  const index = newData.findIndex(
                    (item) => item.id === record.id,
                  );
                  if (index > -1) {
                    newData[index].key = e.target.value;
                    setFormData(newData);
                  }
                },
              }}
            />
          );
        },
      },
      {
        title: 'Value',
        dataIndex: 'value',
        formItemProps: {
          rules: [{ required: true, message: 'value不能为空' }],
        },
        renderFormItem: (_, { record }) => {
          if (!record) return null;

          if (record.type === 'file') {
            return (
              <div style={{ display: 'flex', gap: 8 }}>
                <ProFormText
                  noStyle
                  name="value"
                  fieldProps={{
                    value: record.value,
                    placeholder: '选择文件路径',
                    onChange: (e) => {
                      const newData = [...formData];
                      const index = newData.findIndex(
                        (item) => item.id === record.id,
                      );
                      if (index > -1) {
                        newData[index].value = e.target.value;
                        setFormData(newData);
                      }
                    },
                  }}
                />
                <Button
                  size="small"
                  onClick={() => {
                    // 这里可以添加文件选择器逻辑
                    message.info('文件选择功能待实现');
                  }}
                >
                  选择文件
                </Button>
              </div>
            );
          }

          return (
            <div style={{ display: 'flex', gap: 8 }}>
              <ProFormText
                noStyle
                name="value"
                fieldProps={{
                  value: record.value,
                  onChange: (e) => {
                    const newData = [...formData];
                    const index = newData.findIndex(
                      (item) => item.id === record.id,
                    );
                    if (index > -1) {
                      newData[index].value = e.target.value;
                      setFormData(newData);
                    }
                  },
                }}
              />
              <ApiVariableFunc
                value={record.value || ''}
                setValue={(_, data) => {
                  const newData = [...formData];
                  const index = newData.findIndex(
                    (item) => item.id === record.id,
                  );
                  if (index > -1) {
                    newData[index].value = data.value;
                    setFormData(newData);
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'type',
        valueType: 'select',
        valueEnum: {
          text: { text: '文本' },
          file: { text: '文件' },
        },
        renderFormItem: (_, { record }) => {
          if (!record) return null;
          return (
            <ProFormSelect
              noStyle
              name="type"
              options={[
                { label: '文本', value: 'text' },
                { label: '文件', value: 'file' },
              ]}
              fieldProps={{
                value: record.type,
                onChange: (value) => {
                  const newData = [...formData];
                  const index = newData.findIndex(
                    (item) => item.id === record.id,
                  );
                  if (index > -1) {
                    newData[index].type = value;
                    setFormData(newData);
                  }
                },
              }}
            />
          );
        },
      },
      {
        title: 'Desc',
        dataIndex: 'desc',
        renderFormItem: (_, { record }) => {
          if (!record) return null;
          return (
            <ProFormText
              noStyle
              name="desc"
              fieldProps={{
                value: record.desc,
                onChange: (e) => {
                  const newData = [...formData];
                  const index = newData.findIndex(
                    (item) => item.id === record.id,
                  );
                  if (index > -1) {
                    newData[index].desc = e.target.value;
                    setFormData(newData);
                  }
                },
              }}
            />
          );
        },
      },
      {
        title: '操作',
        valueType: 'option',
        render: (_, record, __, action) => [
          <a key="edit" onClick={() => action?.startEditable?.(record.id)}>
            编辑
          </a>,
          <a
            key="delete"
            onClick={() => {
              const newData = formData.filter((item) => item.id !== record.id);
              setFormData(newData);
            }}
          >
            删除
          </a>,
        ],
      },
    ];

    return (
      <Card
        title="Form Data"
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: 0 }}
      >
        <SetKv2Query
          callBack={(resultArray: KeyValuePair[]) => {
            setFormData([...resultArray]);
          }}
        />
        <EditableProTable<KeyValuePair>
          rowKey="id"
          value={formData}
          onChange={(newDataSource) => {
            if (newDataSource) {
              setFormData([...newDataSource]);
            }
          }}
          columns={columns}
          recordCreatorProps={{
            creatorButtonText: '添加一行',
            record: () => ({
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              key: '',
              value: '',
              description: '',
              type: 'text',
            }),
            newRecordType: 'dataSource',
          }}
          editable={{
            editableKeys: formData.map((item) => item.id),
            actionRender: (row, config, dom) => [dom.delete],
            onSave: async (key, row) => {
              const newData = formData.map((item) =>
                item.id === key ? { ...row } : item,
              );
              setFormData(newData);
            },
            onDelete: async (key) => {
              setFormData(formData.filter((item) => item.id !== key));
            },
          }}
        />
      </Card>
    );
  }

  return null;
};

const MockCreateRule: React.FC<MockCreateRuleProps> = ({
  interId,
  interPath,
  interMethod,
  onSuccess,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [responseData, setResponseData] = useState<any>({});
  const [cookies, setCookies] = useState<KeyValuePair[]>([
    { id: '1', key: '', value: '', desc: '' },
  ]);
  const [rawBody, setRawBody] = useState<string>('{}');
  const [activeTab, setActiveTab] = useState('basic');

  const [availableBodyTypes, setAvailableBodyTypes] = useState<number[]>(
    METHOD_BODY_MAPPING.POST,
  );
  const [currentMethod, setCurrentMethod] = useState<string>('GET');
  const [bodyType, setBodyType] = useState<number>(0);
  // 修改状态变量名以明确含义
  const [reqHeaders, setReqHeaders] = useState<KeyValuePair[]>([]); // 请求头
  const [resHeaders, setResHeaders] = useState<KeyValuePair[]>([]); // 响应头

  //const [headers, setHeaders] = useState<KeyValuePair[]>([]);
  const [queryParams, setQueryParams] = useState<KeyValuePair[]>([]);
  const [formData, setFormData] = useState<KeyValuePair[]>([]);
  // 修复2: 添加强制更新钩子
  const forceUpdate = useUpdate();
  const [tempHeaders, setTempHeaders] = useState<KeyValuePair[]>([]);
  const [tempQueryParams, setTempQueryParams] = useState<KeyValuePair[]>([]);
  const [tempFormData, setTempFormData] = useState<KeyValuePair[]>([]);
  const [tempRawBody, setTempRawBody] = useState<string>('{}');

  const [interfaceInfo, setInterfaceInfo] = useState<any>(null);
  const [showInterfaceModal, setShowInterfaceModal] = useState(false);

  const objectToKeyValueArray = (input: any): KeyValuePair[] => {
    // 1. 处理数组格式（新格式）
    if (Array.isArray(input)) {
      return input.map((item) => ({
        id: item.id
          ? String(item.id)
          : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        key: item.key || '',
        value: item.value || '',
        desc: item.desc || item.description || '',
        type: item.type || 'text',
      }));
    }

    // 2. 处理对象格式（旧格式）
    if (typeof input === 'object' && input !== null) {
      const result: KeyValuePair[] = [];
      Object.entries(input).forEach(([key, value]) => {
        // 跳过描述字段（它们会通过主字段处理）
        if (key.endsWith('_desc')) return;

        // 获取关联的描述字段
        const descKey = `${key}_desc`;
        const descValue = input[descKey] || '';

        result.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          desc: descValue,
        });
      });
      return result;
    }

    return [];
  };

  const keyValueArrayToObject = (arr: KeyValuePair[]): Record<string, any> => {
    const result: Record<string, any> = {};

    arr.forEach((item) => {
      if (item.key && item.key.trim() !== '') {
        // 主键值
        result[item.key] = item.value || '';

        // 关联的描述字段
        if (item.desc) {
          result[`${item.key}_desc`] = item.desc;
        }
      }
    });

    return result;
  };

  // 获取接口详情
  const fetchInterfaceDetail = async () => {
    try {
      const { code, data } = await detailInterApiById({ interfaceId: interId });
      if (code === 0) {
        setInterfaceInfo({
          path: data.url,
          method: data.method,
          description: data.description,
          headers: data.headers,
          params: data.params,
          data: data.data,
          body: data.body,
          body_type: data.body_type,
          raw_type: data.raw_type,
        });

        form.setFieldsValue({
          path: data.url,
          method: data.method,
          description: data.description,
          body_type: data.body_type,
          raw_type: data.raw_type,
        });

        // 正确区分请求头和响应头
        setReqHeaders(objectToKeyValueArray(data.headers) || []);
        //setResHeaders(objectToKeyValueArray(data.request_headers) || []);
        //setHeaders(objectToKeyValueArray(data.headers) || []);
        console.log('获取接口详情:', data.headers); // 添加调试日志
        const headers = objectToKeyValueArray(data.headers) || [];
        const params = objectToKeyValueArray(data.params) || [];
        const formData = objectToKeyValueArray(data.data) || [];

        setTempHeaders(headers);

        setQueryParams(objectToKeyValueArray(data.params) || []);
        setFormData(objectToKeyValueArray(data.data) || []);
        //setHeaders(headers);
        setTempQueryParams(params);
        //setQueryParams(params);
        setTempFormData(formData);
        //setFormData(formData);

        // 处理body数据
        let bodyContent = '{}';
        if (data.body) {
          if (typeof data.body === 'string') {
            bodyContent = data.body;
          } else if (data.body_type === 1) {
            try {
              bodyContent = JSON.stringify(data.body, null, 2);
            } catch {
              bodyContent = '{}';
            }
          } else {
            bodyContent = JSON.stringify(data.body);
          }
        }
        setTempRawBody(bodyContent);
        setRawBody(bodyContent);

        // 设置响应数据
        if (data.response) {
          setResponseData(
            typeof data.response === 'string'
              ? JSON.parse(data.response)
              : data.response,
          );
        }
      }
    } catch (error) {
      message.error('获取接口详情失败');
    }
  };

  // 获取规则详情
  //const fetchRuleDetail = async (rule_id: number, path: string, method: string) => {
  const fetchRuleDetail = async (rule_id: number) => {
    setLoading(true);
    try {
      //const { code, data } = await mockApi.getDetail(path, method);
      const { code, data } = await mockApi.getMockRuleDetailById(rule_id);
      if (code === 0) {
        const methodVal = data.method;
        const bodyTypeVal = data.body_type || 0;

        const values = {
          mockname: data.mockname,
          path: data.path,
          method: methodVal,
          status_code: data.status_code,
          delay: data.delay,
          description: data.description,
          body_type: bodyTypeVal,
          raw_type: data.raw_type || 'json',
        };

        form.setFieldsValue(values);
        setResponseData(data.response || {});
        setCurrentMethod(methodVal);
        setBodyType(bodyTypeVal);
        setAvailableBodyTypes(
          METHOD_BODY_MAPPING[methodVal] || METHOD_BODY_MAPPING.POST,
        );
        setReqHeaders(objectToKeyValueArray(data.request_headers) || []); // 使用 request_headers
        console.log('获取规则详情:', data.request_headers); // 添加调试日志
        //setHeaders(objectToKeyValueArray(data.request_headers) || []); // 使用 request_headers
        //setHeaders(objectToKeyValueArray(data.headers) || []);
        setQueryParams(objectToKeyValueArray(data.params) || []);
        setFormData(objectToKeyValueArray(data.data) || []);
        setRawBody(JSON.stringify(data.body || {}, null, 2));

        setIsEditMode(true);
        message.success('规则详情加载成功');
      } else {
        message.error('获取规则详情失败');
      }
    } catch (error) {
      message.error('获取规则详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 应用接口信息
  const applyInterfaceInfo = (applyAll = true) => {
    if (!interfaceInfo) return;

    const methodVal = interfaceInfo.method || interMethod || 'GET';
    const values = {
      path: interfaceInfo.path || interPath,
      method: methodVal,
      description: interfaceInfo.description || '',
      body_type: interfaceInfo.body_type || 0,
      raw_type: interfaceInfo.raw_type || 'json',
    };

    form.setFieldsValue(values);
    setCurrentMethod(methodVal);
    setAvailableBodyTypes(
      METHOD_BODY_MAPPING[methodVal] || METHOD_BODY_MAPPING.POST,
    );
    setBodyType(interfaceInfo.body_type || 0);

    if (applyAll) {
      //setHeaders(tempHeaders);
      setReqHeaders(tempHeaders);
      setQueryParams(tempQueryParams);
      setFormData(tempFormData);
      setRawBody(tempRawBody);

      try {
        setResponseData(JSON.parse(tempRawBody));
      } catch {
        setResponseData(tempRawBody);
      }

      message.success('全部接口信息已应用');
    } else {
      message.success('基础接口信息已应用');
    }

    setShowInterfaceModal(false);
  };

  useEffect(() => {
    console.log('useEffect 触发，initialValues:', initialValues);

    if (initialValues) {
      const methodVal = initialValues.method || 'GET';
      //const bodyTypeVal = initialValues.body_type || 0;

      const bodyTypeVal = initialValues.body_type ?? 0;
      setBodyType(bodyTypeVal);
      form.setFieldsValue({ body_type: bodyTypeVal });

      console.log('初始化设置 body_type:', bodyTypeVal);

      // 2. 获取该方法允许的 body 类型
      const allowedTypes =
        METHOD_BODY_MAPPING[methodVal] || METHOD_BODY_MAPPING.POST;
      setAvailableBodyTypes(allowedTypes);

      // 3. 确保 body_type 在允许的范围内
      let finalBodyType = bodyTypeVal;
      if (!allowedTypes.includes(bodyTypeVal)) {
        console.warn(
          `方法 ${methodVal} 不支持 body_type=${bodyTypeVal}, 重置为 0`,
        );
        finalBodyType = 0;
      }

      const values = {
        mockname: initialValues.mockname,
        path: initialValues.path,
        method: methodVal,
        status_code: initialValues.status_code,
        delay: initialValues.delay,
        description: initialValues.description,
        body_type: finalBodyType,
        raw_type: initialValues.raw_type || 'json',
      };
      console.log('设置表单值:', values);
      form.setFieldsValue(values);

      let responseDataValue = initialValues.response || {};
      if (typeof initialValues.response === 'string') {
        try {
          responseDataValue = JSON.parse(initialValues.response);
        } catch {
          responseDataValue = initialValues.response;
        }
      }
      setResponseData(responseDataValue);

      setCurrentMethod(methodVal);
      //setBodyType(bodyTypeVal);
      setBodyType(finalBodyType); // 设置状态
      setAvailableBodyTypes(
        METHOD_BODY_MAPPING[methodVal] || METHOD_BODY_MAPPING.POST,
      );

      let rawBodyValue = '{}';
      if (initialValues.body) {
        if (typeof initialValues.body === 'string') {
          rawBodyValue = initialValues.body;
        } else if (initialValues.body_type === 1) {
          try {
            rawBodyValue = JSON.stringify(initialValues.body, null, 2);
          } catch {
            rawBodyValue = '{}';
          }
        } else {
          rawBodyValue = JSON.stringify(initialValues.body);
        }
      }
      setRawBody(rawBodyValue);

      // 新增规则时，headers作为请求头(request_headers)，响应头初始化为空
      if (!initialValues.id) {
        const requestHeaders =
          objectToKeyValueArray(initialValues.headers) || [];
        console.log(
          '新增规则 - 设置请求头数据:',
          requestHeaders,
          '来自字段:',
          initialValues.headers,
        );
        setReqHeaders(requestHeaders);
        setResHeaders([]);
      }
      // 编辑规则时，request_headers作为请求头，headers作为响应头
      else {
        const requestHeaders =
          objectToKeyValueArray(initialValues.request_headers) || [];
        console.log(
          '编辑规则 - 设置请求头数据:',
          requestHeaders,
          '来自字段:',
          initialValues.request_headers,
        );
        setReqHeaders(requestHeaders);
        const responseHeaders =
          objectToKeyValueArray(initialValues.headers) || [];
        console.log(
          '编辑规则 - 设置响应头数据:',
          responseHeaders,
          '来自字段:',
          initialValues.headers,
        );
        setResHeaders(responseHeaders);
      }
      setQueryParams(objectToKeyValueArray(initialValues.params) || []);
      setFormData(objectToKeyValueArray(initialValues.data) || []);
      setCookies(objectToKeyValueArray(initialValues.cookies) || []);
      setIsEditMode(true);
    } else {
      form.resetFields();
      setIsEditMode(false);
      setReqHeaders([{ id: '1', key: '', value: '', desc: '' }]);
      //setHeaders([{ id: '1', key: '', value: '', desc: '' }]);
      setQueryParams([{ id: '1', key: '', value: '', desc: '' }]);
      setFormData([{ id: '1', key: '', value: '', type: 'text', desc: '' }]);
      setCookies([{ id: '1', key: '', value: '', desc: '' }]);
      setCurrentMethod(interMethod || 'GET');

      if (interPath || interMethod) {
        form.setFieldsValue({
          path: interPath,
          method: interMethod,
        });
        setCurrentMethod(interMethod || 'GET');
        setAvailableBodyTypes(
          METHOD_BODY_MAPPING[interMethod || 'GET'] || METHOD_BODY_MAPPING.POST,
        );
      }

      if (interId) {
        fetchInterfaceDetail();
      }
    }
  }, [initialValues, interId, interPath, interMethod]);

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 修复1: 从表单实例获取最新值（包括body_type）
      const formValues = form.getFieldsValue();
      console.log('提交前表单值:', formValues);
      // 验证必填字段
      if (!formValues.path || !formValues.method) {
        throw new Error('接口路径和方法不能为空');
      }

      // 处理响应数据 - 确保是字典类型
      let responsePayload: Record<string, any> = {};
      if (typeof responseData === 'string') {
        try {
          responsePayload = JSON.parse(responseData);
          if (
            typeof responsePayload !== 'object' ||
            Array.isArray(responsePayload)
          ) {
            responsePayload = { data: responsePayload };
          }
        } catch (error) {
          console.error('解析响应数据失败:', error);
          responsePayload = { error: 'Invalid JSON response' };
        }
      } else if (
        typeof responseData === 'object' &&
        !Array.isArray(responseData)
      ) {
        responsePayload = responseData;
      } else {
        responsePayload = { data: responseData };
      }

      // 处理请求体数据 - 直接从表单获取最新body_type
      const currentBodyType = form.getFieldValue('body_type') || 0;
      console.log('提交时Body类型:', currentBodyType);
      let requestBody = {};
      if (currentBodyType === 1) {
        try {
          requestBody = JSON.parse(rawBody || '{}');
        } catch (error) {
          console.error('解析请求体JSON失败:', error);
          throw new Error('请求体JSON格式不正确');
        }
      } else if (currentBodyType === 2) {
        requestBody = keyValueArrayToObject(formData);
      }
      // 在提交前重新获取表单值确保最新
      const finalValues = form.getFieldsValue();
      console.log('提交前表单值:', finalValues);

      const payload: IMockRule = {
        mockname: values.mockname || '未命名规则',
        path: values.path,
        method: values.method,
        status_code: form.getFieldValue('status_code') || 200,
        enabled: false, // 默认禁用新创建的规则
        response: responsePayload,
        delay: values.delay || 0,
        description: values.description || '',
        // 根据后端接口定义调整映射关系
        //headers: keyValueArrayToObject(resHeaders), // 响应头映射到headers
        //request_headers: keyValueArrayToObject(reqHeaders), // 请求头映射到request_headers
        headers: keyValueArrayToObject(resHeaders), // 响应头映射到headers
        request_headers: keyValueArrayToObject(reqHeaders), // 请求头映射到request_headers
        cookies: keyValueArrayToObject(cookies),
        interface_id: interId ? interId : undefined,
        body_type: currentBodyType,
        raw_type: values.raw_type || 'json',
        params: keyValueArrayToObject(queryParams),
        data: keyValueArrayToObject(formData),
        body: requestBody,
      };

      // 添加调试日志
      console.log('提交Mock规则:', payload);
      //console.log('请求头数据:', reqHeaders);
      //console.log('响应头数据:', resHeaders);
      //console.log('转换后的请求头:', keyValueArrayToObject(reqHeaders));
      //console.log('转换后的响应头:', keyValueArrayToObject(resHeaders));
      //console.log('payload.headers:', payload.headers);
      //console.log('payload.request_headers:', payload.request_headers);//反了

      if (isEditMode && initialValues?.id) {
        await mockApi.update({
          ...payload,
          id: initialValues.id,
        });
        console.log('规则更新:', payload);
        message.success('规则更新成功');
      } else {
        await mockApi.create(payload);
        console.log('createMock规则:', payload);
        message.success('规则创建成功');
      }
      onSuccess();
    } catch (error: any) {
      console.error('提交Mock规则失败:', error);
      message.error(
        error.message ||
          (isEditMode
            ? '规则更新失败，请检查数据格式'
            : '规则创建失败，请检查数据格式'),
      );
    } finally {
      setLoading(false);
    }
  };
  // 调试日志 - 在渲染时检查body_type值
  const bodyTypeValue = form.getFieldValue('body_type') ?? 0;
  const localBodyType = bodyType;
  console.log(
    '当前bodyType状态 - 表单值:',
    bodyTypeValue,
    '本地状态:',
    localBodyType,
  );
  if (bodyTypeValue !== localBodyType) {
    console.warn('警告: body_type表单值与本地状态不一致');
    // 自动同步不一致的状态
    setBodyType(bodyTypeValue);
    console.log('已自动同步本地状态到表单值');
    console.log(
      '同步后状态 - 表单值:',
      form.getFieldValue('body_type'),
      '本地状态:',
      bodyType,
    );
  }
  return (
    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      <Card bordered={false} bodyStyle={{ padding: '16px 24px' }}>
        <ProForm
          form={form}
          onFinish={handleSubmit}
          submitter={false}
          layout="horizontal"
          initialValues={{
            method: 'GET',
            status_code: 200,
            delay: undefined,
            body_type: 0,
            raw_type: 'json',
          }}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="基本信息" key="basic">
              <ProFormGroup>
                <ProFormText
                  name="mockname"
                  label="规则名称"
                  rules={[{ required: true, message: '规则名称不能为空' }]}
                  placeholder="请输入规则名称"
                  width="md"
                />

                <div style={{ display: 'flex', gap: 8 }}>
                  <ProFormText
                    name="path"
                    label="接口路径"
                    rules={[{ required: true, message: '接口路径不能为空' }]}
                    placeholder="例如: /api/user/info"
                    width="md"
                  />
                </div>

                <ProFormSelect
                  name="method"
                  label="请求方法"
                  rules={[{ required: true }]}
                  options={[
                    { label: 'GET', value: 'GET' },
                    { label: 'POST', value: 'POST' },
                    { label: 'PUT', value: 'PUT' },
                    { label: 'DELETE', value: 'DELETE' },
                    { label: 'PATCH', value: 'PATCH' },
                  ]}
                  fieldProps={{
                    onChange: (value: string) => {
                      console.log('请求方法改变为:', value);
                      setCurrentMethod(value);
                      const allowedTypes =
                        METHOD_BODY_MAPPING[value] || METHOD_BODY_MAPPING.POST;
                      setAvailableBodyTypes(allowedTypes);

                      // 同步更新表单值和本地状态
                      const currentBodyType =
                        form.getFieldValue('body_type') || 0;
                      if (
                        value === 'GET' ||
                        !allowedTypes.includes(currentBodyType)
                      ) {
                        console.log('重置body_type为0');
                        form.setFieldsValue({ body_type: 0 });
                        setBodyType(0); // 同步更新本地状态
                        console.log(
                          '方法变更后状态 - 表单值:',
                          form.getFieldValue('body_type'),
                          '本地状态:',
                          bodyType,
                        );
                        forceUpdate(); // 强制重新渲染
                      }
                    },
                  }}
                  width="md"
                />
              </ProFormGroup>

              <ProFormGroup>
                <ProFormDigit
                  name="status_code"
                  label="状态码"
                  rules={[{ required: true, message: '状态码不能为空' }]}
                  min={200}
                  max={599}
                  fieldProps={{ precision: 0 }}
                  width="md"
                />

                <ProFormDigit
                  name="delay"
                  label="延迟响应(毫秒)"
                  min={0}
                  max={10000}
                  fieldProps={{ precision: 0 }}
                  width="md"
                />
              </ProFormGroup>

              <ProFormTextArea
                name="description"
                label="规则描述"
                placeholder="请输入规则描述"
                width="xl"
              />
            </TabPane>

            <TabPane tab="请求参数" key="query">
              {/*<InterHeaders*/}
              <ReqHeaders
                // headers={headers}
                // setHeaders={setHeaders}
                headers={reqHeaders}
                setHeaders={setReqHeaders}
                title="请求头"
              />
              <InterQueryParams
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                title="Query参数"
              />
            </TabPane>

            <TabPane tab="请求体" key="body">
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ marginRight: 16 }}>
                  Body类型:
                </Text>
                <Radio.Group
                  value={form.getFieldValue('body_type')} // 直接从表单获取值
                  onChange={(e) => {
                    const newBodyType = e.target.value;
                    console.log('Body类型改变为:', newBodyType);

                    // 确保表单值和本地状态同步更新
                    form.setFieldsValue({
                      body_type: newBodyType,
                      raw_type: newBodyType === 1 ? 'json' : undefined,
                    });
                    setBodyType(newBodyType);
                    console.log(
                      '更新后表单body_type:',
                      form.getFieldValue('body_type'),
                    );
                    console.log('更新后本地bodyType:', newBodyType);
                  }}
                  disabled={currentMethod === 'GET'}
                >
                  <Radio value={0} disabled={!availableBodyTypes.includes(0)}>
                    none
                  </Radio>
                  <Radio value={2} disabled={!availableBodyTypes.includes(2)}>
                    form-data
                  </Radio>
                  <Radio value={1} disabled={!availableBodyTypes.includes(1)}>
                    raw
                  </Radio>
                </Radio.Group>
              </div>

              <InterBody
                key={`inter-body-${bodyType}-${currentMethod}`}
                bodyType={bodyType}
                rawType={form.getFieldValue('raw_type') || 'json'}
                rawBody={rawBody}
                setRawBody={setRawBody}
                formData={formData}
                setFormData={setFormData}
                currentMethod={currentMethod}
                availableBodyTypes={availableBodyTypes}
              />
            </TabPane>

            <TabPane tab="响应内容" key="response">
              {/*<ResHeaders*/}
              <ResHeaders
                resheaders={resHeaders}
                setRESHeaders={setResHeaders}
                title="响应头"
              />
              <Card
                title="响应数据"
                extra={
                  <Button
                    size="small"
                    onClick={() => {
                      try {
                        const formatted = JSON.stringify(
                          JSON.parse(rawBody),
                          null,
                          2,
                        );
                        setResponseData(formatted);
                      } catch {
                        message.error('JSON格式化失败');
                      }
                    }}
                  >
                    格式化JSON
                  </Button>
                }
                bodyStyle={{ padding: 0 }}
              >
                <AceCodeEditor
                  value={
                    typeof responseData === 'string'
                      ? responseData
                      : JSON.stringify(responseData, null, 2)
                  }
                  onChange={(value) => {
                    try {
                      setResponseData(JSON.parse(value));
                    } catch {
                      setResponseData(value);
                    }
                  }}
                  height="300px"
                  _mode="json"
                  enableBasicAutocompletion
                  enableLiveAutocompletion
                />
              </Card>
            </TabPane>
          </Tabs>

          <Divider />
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ marginLeft: 16 }}
              >
                {isEditMode ? '保存规则' : '创建规则'}
              </Button>
              {onCancel && <Button onClick={onCancel}>取消</Button>}
            </Space>
          </Form.Item>
        </ProForm>

        {/* 接口信息弹窗 */}
        <Modal
          title="接口信息"
          open={showInterfaceModal}
          footer={[
            <Button key="cancel" onClick={() => setShowInterfaceModal(false)}>
              取消
            </Button>,
            <Button key="basic" onClick={() => applyInterfaceInfo(false)}>
              仅应用基本信息
            </Button>,
            <Button
              key="all"
              type="primary"
              onClick={() => applyInterfaceInfo(true)}
            >
              应用全部信息
            </Button>,
          ]}
          onCancel={() => setShowInterfaceModal(false)}
          width={800}
        >
          {interfaceInfo ? (
            <div>
              <p>
                <strong>接口路径:</strong> {interfaceInfo.path}
              </p>
              <p>
                <strong>请求方法:</strong> {interfaceInfo.method}
              </p>
              <p>
                <strong>描述:</strong> {interfaceInfo.description}
              </p>

              <Tabs>
                {interfaceInfo.headers && (
                  <Tabs.TabPane tab="请求头" key="headers">
                    {/*<InterHeaders*/}
                    <ReqHeaders
                      headers={tempHeaders}
                      setHeaders={setTempHeaders}
                      title="请求头"
                    />
                  </Tabs.TabPane>
                )}
                {interfaceInfo.params && (
                  <Tabs.TabPane tab="Query参数" key="params">
                    <InterQueryParams
                      queryParams={tempQueryParams}
                      setQueryParams={setTempQueryParams}
                      title="Query参数"
                    />
                  </Tabs.TabPane>
                )}
                {interfaceInfo.data && (
                  <Tabs.TabPane tab="表单数据" key="data">
                    <InterBody
                      bodyType={interfaceInfo.body_type || 0}
                      rawType={interfaceInfo.raw_type || 'json'}
                      rawBody={tempRawBody}
                      setRawBody={setTempRawBody}
                      formData={tempFormData}
                      setFormData={setTempFormData}
                      currentMethod={interfaceInfo.method || 'GET'}
                      availableBodyTypes={
                        METHOD_BODY_MAPPING[interfaceInfo.method] || []
                      }
                    />
                  </Tabs.TabPane>
                )}
                {interfaceInfo.body && (
                  <Tabs.TabPane tab="请求体" key="body">
                    <AceCodeEditor
                      height="300px"
                      value={tempRawBody}
                      onChange={setTempRawBody}
                      _mode="json"
                    />
                  </Tabs.TabPane>
                )}
              </Tabs>
            </div>
          ) : (
            <p>加载中...</p>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default MockCreateRule;
