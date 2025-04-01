import { queryDBConfig, tryDBScript } from '@/api/base/dbConfig';
import {
  addUIStepSql,
  detailUIStepSql,
  editUIStepSql,
  removeUIStepSql,
} from '@/api/play/step';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import MyDrawer from '@/components/MyDrawer';
import { IBeforeSQLExtract } from '@/pages/Httpx/types';
import { IDBConfig } from '@/pages/Project/types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  EditableProTable,
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, Form, message, Popover, Space, Typography } from 'antd';
import React, { FC, useEffect, useState } from 'react';

const { Paragraph, Text } = Typography;

interface ISelfProps {
  stepId?: number;
  callBackFunc: () => void;
}

const StepSql: FC<ISelfProps> = ({ stepId, callBackFunc }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tryData, setTryData] = useState<any>();
  const [sqlValue, setSqlValue] = useState<string>();
  const [sqlEditableKeys, setSqlEditableKeys] = useState<React.Key[]>();
  const [canTry, setCanTry] = useState<boolean>(false);
  const [form] = Form.useForm<any>();
  //0空 1详情
  const [currentSqlUid, setCurrentSqlUid] = useState<string>();
  useEffect(() => {
    if (stepId) {
      detailUIStepSql({ stepId: stepId }).then(({ code, data }) => {
        if (code === 0) {
          if (data && data.sql_str) {
            setSqlValue(data.sql_str);
            setCurrentSqlUid(data.uid);
            form.setFieldsValue(data);
          }
        }
      });
    }
  }, [stepId]);

  useEffect(() => {
    if (sqlValue) {
      setCanTry(true);
    } else {
      setCanTry(false);
    }
  }, [sqlValue]);

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
  const beforeColumns: ProColumns<IBeforeSQLExtract>[] = [
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
  const updateSqlValue = async () => {
    const values = await form.validateFields();
    if (currentSqlUid === undefined) {
      const { code, msg } = await addUIStepSql({
        ...values,
        stepId: stepId,
        sql_str: sqlValue,
      });
      if (code === 0) {
        message.success(msg);
      }
    } else {
      const { code, msg } = await editUIStepSql({
        ...values,
        stepId: stepId,
        uid: currentSqlUid,
        sql_str: sqlValue,
      });
      if (code === 0) {
        message.success(msg);
      }
    }
  };

  const removeSqlValue = async () => {
    form.resetFields();
    if (currentSqlUid) {
      const { code, msg } = await removeUIStepSql({
        uid: currentSqlUid,
      });
      if (code === 0) {
        message.success(msg);
        setSqlValue('');
      }
    }
  };
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
      <ProForm form={form} submitter={false}>
        <ProCard
          title={
            <ProFormSelect
              noStyle={true}
              width={'md'}
              name={'db_id'}
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
            />
          }
          extra={
            <Space>
              <>
                {canTry && (
                  <Button
                    type={'primary'}
                    onClick={async () => {
                      if (sqlValue) {
                        const { code, data } = await tryDBScript({
                          db_id: form.getFieldValue('db_id'),
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
                  <Button onClick={updateSqlValue}>提交</Button>
                  <Button
                    hidden={currentSqlUid === undefined}
                    onClick={removeSqlValue}
                  >
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
          <ProForm.Group>
            <ProFormSelect
              label={'前后置'}
              width={'md'}
              name={'b_or_a'}
              options={[
                { label: '前置', value: 1 },
                { label: '后置', value: 0 },
              ]}
              required={true}
              initialValue={1}
            />
            <ProFormTextArea
              label={'描述'}
              width={'md'}
              name={'description'}
              fieldProps={{ rows: 1 }}
            />
          </ProForm.Group>
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
          <ProForm.Item name={'sql_extracts'} trigger={'onValuesChange'}>
            <EditableProTable<IBeforeSQLExtract>
              rowKey={'id'}
              search={false}
              columns={beforeColumns}
              recordCreatorProps={{
                newRecordType: 'dataSource',
                record: () => ({
                  id: Date.now(),
                }),
              }}
              editable={{
                type: 'multiple',
                editableKeys: sqlEditableKeys,
                onChange: setSqlEditableKeys,
                actionRender: (row, _, dom) => {
                  return [dom.delete, dom.cancel];
                },
              }}
            />
          </ProForm.Item>
        </ProCard>
      </ProForm>
    </ProCard>
  );
};

export default StepSql;
