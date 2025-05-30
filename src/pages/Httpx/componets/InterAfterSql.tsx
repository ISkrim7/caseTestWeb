import { queryDBConfig, tryDBScript } from '@/api/base/dbConfig';
import { updateInterApiById } from '@/api/inter';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import MyDrawer from '@/components/MyDrawer';
import {
  FormEditableOnValueChange,
  FormEditableOnValueRemove,
} from '@/pages/Httpx/componets/FormEditableOnValueChange';
import { IAfterSQLExtract, IInterfaceAPI } from '@/pages/Httpx/types';
import { IDBConfig } from '@/pages/Project/types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  EditableFormInstance,
  EditableProTable,
  ProCard,
  ProForm,
  ProFormSelect,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import {
  Button,
  FormInstance,
  message,
  Popover,
  Space,
  Typography,
} from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';

const { Paragraph, Text } = Typography;

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
}

const InterAfterSql: FC<SelfProps> = (props) => {
  const { form } = props;
  const [sqlValue, setSqlValue] = useState<string>();
  const editorFormRef = useRef<EditableFormInstance<IAfterSQLExtract>>();

  const [afterSQLParamsEditableKeys, setAfterSQLParamsEditableRowKeys] =
    useState<React.Key[]>();
  const [canTry, setCanTry] = useState<boolean>(false);
  const [afterDbId, setAfterDbId] = useState<number>();
  const [open, setOpen] = useState<boolean>(false);
  const [tryData, setTryData] = useState<any>();
  // 在InterAfterSql组件中添加
  useEffect(() => {
    const afterSql = form.getFieldValue('after_sql');
    const afterDbId = form.getFieldValue('after_db_id');

    if (afterDbId) setAfterDbId(afterDbId);
    if (afterSql) setSqlValue(afterSql);
  }, []);

  useEffect(() => {
    if (sqlValue) {
      setCanTry(true);
    } else {
      setCanTry(false);
    }
  }, [sqlValue]);

  const updateSqlValue = async () => {
    const InterfaceId = form.getFieldValue('id');

    if (sqlValue && afterDbId && InterfaceId) {
      const { code, msg } = await updateInterApiById({
        id: InterfaceId,
        after_db_id: afterDbId,
        after_sql: sqlValue,
      });
      if (code === 0) {
        message.success(msg);
      }
    }
  };

  const removeSqlValue = async () => {
    const InterfaceId = form.getFieldValue('id');
    form.setFieldValue('after_sql', null);
    form.setFieldValue('after_db_id', null);
    setSqlValue('');
    const { code, msg } = await updateInterApiById({
      id: InterfaceId,
      after_db_id: null,
      after_sql: null,
    });
    if (code === 0) {
      message.success(msg);
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

        <li>
          <Text code>{'如果返回 一个单字符串 则不需要传递jsonpath '}</Text>
        </li>
      </ul>
    </Paragraph>
  );
  const afterColumns: ProColumns<IAfterSQLExtract>[] = [
    {
      title: 'Key',
      dataIndex: 'key',
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
      title: 'JsonPath表达',
      dataIndex: 'jp',
    },
    {
      title: 'Opt',
      valueType: 'option',
      fixed: 'right',
      render: (_, record, __, action) => {
        return [
          <a
            onClick={() => {
              console.log('edit', record.id);
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
    <ProCard split={'horizontal'}>
      <MyDrawer name={'db'} open={open} setOpen={setOpen}>
        <AceCodeEditor
          value={tryData}
          readonly={true}
          _mode={'json'}
          height={'100vh'}
        />
      </MyDrawer>
      <ProCard
        title={
          <ProFormSelect
            disabled={false}
            noStyle={true}
            width={'md'}
            name={'after_db_id'}
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
              setAfterDbId(value);
              form.setFieldsValue({
                after_db_id: value,
              });
            }}
          />
        }
        extra={
          <Space>
            <>
              {canTry && (
                <Button
                  disabled={false}
                  type={'primary'}
                  onClick={async () => {
                    if (sqlValue && afterDbId) {
                      const { code, data } = await tryDBScript({
                        db_id: afterDbId,
                        script: sqlValue,
                      });
                      if (code === 0) {
                        setTryData(JSON.stringify(data, null, 2));
                        setOpen(true);
                      }
                    }
                  }}
                >
                  Try
                  <Popover content={'SQL 不支持变量的调试'}>
                    <QuestionCircleOutlined />
                  </Popover>
                </Button>
              )}
            </>
            {canTry && (
              <Space>
                <Button disabled={false} onClick={updateSqlValue}>
                  提交
                </Button>
                <Button disabled={false} onClick={removeSqlValue}>
                  删除
                </Button>
              </Space>
            )}
            <Popover content={contentSQL}>
              <Button type="primary">
                在SQL语法中设置与使用变量
                <QuestionCircleOutlined />
              </Button>
            </Popover>
          </Space>
        }
      >
        <AceCodeEditor
          value={sqlValue}
          onChange={(value) => setSqlValue(value)}
          height={'20vh'}
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
        <>
          <ProForm.Item name={'after_sql_extracts'} trigger={'onValuesChange'}>
            <EditableProTable<IAfterSQLExtract>
              rowKey={'id'}
              search={false}
              editableFormRef={editorFormRef}
              columns={afterColumns}
              recordCreatorProps={{
                newRecordType: 'dataSource',
                record: () => ({
                  id: Date.now(),
                }),
              }}
              editable={{
                type: 'multiple',
                editableKeys: afterSQLParamsEditableKeys,
                onChange: setAfterSQLParamsEditableRowKeys,
                onSave: async () => {
                  await FormEditableOnValueChange(form, 'after_sql_extracts');
                },
                onDelete: async (key) => {
                  await FormEditableOnValueRemove(
                    form,
                    'after_sql_extracts',
                    key,
                  );
                },
                actionRender: (row, _, dom) => {
                  return [dom.save, dom.delete, dom.cancel];
                },
              }}
            />
          </ProForm.Item>
        </>
      </ProCard>
    </ProCard>
  );
};

export default InterAfterSql;
