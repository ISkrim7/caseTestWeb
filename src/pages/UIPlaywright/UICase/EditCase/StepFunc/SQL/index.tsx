import {
  addUIStepSQL,
  deleteUICaseStepSql,
  getUICaseStepSQLInfo,
  updateUICaseStepSQL,
} from '@/api/aps';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Divider, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  stepId: number;
  reload: () => void;
}

const Index: FC<SelfProps> = ({ stepId, reload }) => {
  const [sqlForm] = Form.useForm<any>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>();
  const [sql, setSql] = useState<string>();
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (stepId) {
      getUICaseStepSQLInfo({ stepId: stepId }).then(({ code, data }) => {
        if (code === 0) {
          if (data && data.sql_str) {
            setSql(data.sql_str);
            setFormData(data);
            sqlForm.setFieldsValue(data);
          }
        }
      });
    }
  }, [stepId]);

  useEffect(() => {
    if (formData) {
      setDisable(true);
      setLoading(false);
    } else {
      setDisable(false);
      setLoading(false);
    }
  }, [formData]);
  const reverseString = (str: string) => {
    return str
      .split('') // 将字符串分割成字符数组
      .reverse() // 反转数组
      .join(''); // 将字符数组重新合并成字符串
  };
  const onSave = async () => {
    let isValid = true;
    try {
      await sqlForm.validateFields();
    } catch (error) {
      isValid = false;
      message.error('表单数据存在错误，请检查');
      return;
    }
    if (!sql) return message.error('SQL不能为空');
    if (isValid) {
      setLoading(true);
      const formBody = await sqlForm.getFieldsValue(true);

      formBody.sql_str = reverseString(sql);
      formBody.stepId = stepId;
      if (formData) {
        formBody.uid = formData.uid;
        updateUICaseStepSQL(formBody).then(({ code, msg }) => {
          if (code === 0) {
            message.success(msg);
            setDisable(true);
            setLoading(false);
            reload();
          } else {
            setLoading(false);
            setDisable(false);
          }
        });
      } else {
        addUIStepSQL(formBody).then(({ code, msg }) => {
          if (code === 0) {
            message.success(msg);
            setDisable(true);
            setLoading(false);
            reload();
          } else {
            setLoading(false);
            setDisable(false);
          }
        });
      }
    }
  };

  const onSqlChange = (value: string) => {
    setSql(value);
  };
  return (
    <ProCard
      title={'SQL'}
      loading={loading}
      headerBordered={true}
      subTitle={'若存在接口请求、会低于接口优先级执行'}
      extra={
        <>
          <a
            onClick={() => {
              window.open(
                'https://doc.weixin.qq.com/doc/w3_AfsAOgZMAI84V9KjJUWRNuouNEwNR?scode=APwAJgfkAHAUxLDnHAAfsAOgZMAI8',
              );
            }}
          >
            使用说明
          </a>
          <Divider type="vertical" />
          {!disable ? (
            <Button type={'primary'} onClick={onSave}>
              保存
            </Button>
          ) : (
            <>
              <Button onClick={() => setDisable(false)} type={'primary'}>
                修改
              </Button>
              <Divider type="vertical" />
              <Button
                onClick={async () => {
                  if (formData?.uid) {
                    deleteUICaseStepSql({ uid: formData.uid }).then(
                      ({ code, msg }) => {
                        if (code === 0) {
                          message.success(msg);
                          sqlForm.resetFields();
                          setFormData(undefined);
                          reload();
                        }
                      },
                    );
                  }
                }}
              >
                删除
              </Button>
            </>
          )}
        </>
      }
    >
      <ProForm disabled={disable} form={sqlForm} submitter={false}>
        <ProForm.Group>
          <ProFormRadio.Group
            required={true}
            label={'该UI步骤前后运行'}
            radioType={'radio'}
            name={'b_or_a'}
            initialValue={1}
            width={'md'}
            rules={[{ required: true, message: '不能为空' }]}
            options={[
              {
                label: '前置运行',
                value: 1,
              },
              {
                label: '后置运行',
                value: 0,
              },
            ]}
          />
          <ProFormTextArea
            label={'步骤描述'}
            name={'desc'}
            width={'md'}
            fieldProps={{
              placeholder: '请输入步骤描述',
              rows: 1,
            }}
          />
        </ProForm.Group>
      </ProForm>
      <AceCodeEditor
        _mode={'json'}
        value={sql}
        readonly={disable}
        onChange={onSqlChange}
        height={'20vh'}
      />
    </ProCard>
  );
};

export default Index;
