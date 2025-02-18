import { queryDBConfig } from '@/api/base/dbConfig';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { IDBConfig } from '@/pages/Project/types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  EditableProTable,
  ProCard,
  ProForm,
  ProFormSelect,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, FormInstance, Popover, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';

const { Title, Paragraph, Text, Link } = Typography;

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterBeforeSql: FC<SelfProps> = (props) => {
  const { form, mode } = props;
  const [sqlValue, setSqlValue] = useState<string>();
  const [readonly, setReadonly] = useState(false);
  const [beforeSQLParamsEditableKeys, setBeforeSQLParamsEditableRowKeys] =
    useState<React.Key[]>();

  useEffect(() => {
    const sv = form.getFieldValue('before_sql');
    if (sv) {
      setSqlValue(sv);
    }
  }, []);
  const handleOnChange = (value: string) => {
    if (value) {
      setSqlValue(value);
      form.setFieldsValue({ before_sql: value });
    }
  };

  const contentSQL = (
    <Paragraph>
      <ul>
        <li>
          <Text>仅支持一条SQL</Text>
        </li>
        <li>
          变量查询
          <ul>
            <li>
              <Text code>select name form table .. </Text>
            </li>
            <li>
              <Text>name将被处理为变量名，对应的值是搜索返回的第一个</Text>
            </li>
          </ul>
        </li>
        <li>
          使用as
          <ul>
            <li>
              <Text code>
                select username as u,password as p form table ..{' '}
              </Text>
            </li>
            <li>
              <Text>u,p 将被处理为变量名，对应的值是搜索返回的第一个</Text>
            </li>
          </ul>
        </li>
      </ul>
      <ul>
        <li>
          <Text strong>{'支持 上文 变量{{xx}} 写入SQL'}</Text>
          <ul>
            <li>
              <Text code>{'select * from table where id = {{ID}}'}</Text>
            </li>
          </ul>
        </li>
      </ul>
      <ul>
        <li>
          {'使用Oracle 注意⚠️'}
          <li>
            <Text>
              Oracle
              返回变量字段名皆为大写，设置变量名需大写，否则无法获取到变量值。
            </Text>
          </li>
        </li>
      </ul>
    </Paragraph>
  );

  const contentJP = (
    <Paragraph>
      <ul>
        <li>
          <Text code>
            {`查询 SQL 语句返回结果一般为数组格式，如:
          [{ "id":1,"name":"jack"}]`}{' '}
          </Text>
          <ul>
            <li>
              <Text>
                JSONPath $[0]表示读取第一条记录的整个对象值;$[0].name
                表示读取第一条记录的 name 字段
              </Text>
            </li>
          </ul>
        </li>
      </ul>
    </Paragraph>
  );
  const beforeColumns: ProColumns[] = [
    {
      title: '变量名',
      dataIndex: 'key',
    },
    {
      title: 'JsonPath表达',
      dataIndex: 'jp',
    },
    {
      title: 'Opt',
      valueType: 'option',
      render: (_: any, record: any) => {
        return (
          <>
            {mode !== 1 ? (
              <a
                onClick={() => {
                  setBeforeSQLParamsEditableRowKeys([record.id]);
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
    <ProCard split={'horizontal'}>
      <ProCard
        title={
          <ProFormSelect
            noStyle={true}
            width={'md'}
            name={'before_db_id'}
            required={true}
            request={async () => {
              const { code, data } = await queryDBConfig();
              if (code === 0) {
                return data.map((item: IDBConfig) => {
                  return {
                    label: item.db_name,
                    value: item.id,
                  };
                });
              }
              return [];
            }}
            onChange={(value: number) => {
              form.setFieldsValue({
                before_db_id: value,
              });
            }}
          />
        }
        extra={
          <Popover content={contentSQL}>
            <Button type="primary">
              在SQL语法中设置与使用变量
              <QuestionCircleOutlined />
            </Button>
          </Popover>
        }
      >
        <AceCodeEditor
          value={sqlValue}
          onChange={handleOnChange}
          height={'20vh'}
          readonly={readonly}
          _mode={'mysql'}
        />
      </ProCard>
      <ProCard
        extra={
          <Popover content={contentJP}>
            <Button type="primary">
              提取结果到变量
              <QuestionCircleOutlined />
            </Button>
          </Popover>
        }
      >
        <ProForm form={form} submitter={false}>
          <ProForm.Item name={'before_sql_extracts'} trigger={'onValuesChange'}>
            <EditableProTable
              name={'before_sql_extracts'}
              rowKey={'id'}
              search={false}
              // toolBarRender={() => [searchVariableButton]}
              columns={beforeColumns}
              recordCreatorProps={{
                newRecordType: 'dataSource',
                record: () => ({
                  id: Date.now(),
                }),
              }}
              editable={{
                type: 'multiple',
                editableKeys: beforeSQLParamsEditableKeys,
                onChange: setBeforeSQLParamsEditableRowKeys,
                actionRender: (row, _, dom) => {
                  return [dom.save, dom.delete, dom.cancel];
                },
              }}
            />
          </ProForm.Item>
        </ProForm>
      </ProCard>
    </ProCard>
  );
};

export default InterBeforeSql;
