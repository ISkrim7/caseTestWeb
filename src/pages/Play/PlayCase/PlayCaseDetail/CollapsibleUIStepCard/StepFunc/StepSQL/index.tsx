import {
  addUIStepSql,
  detailUIStepSql,
  editUIStepSql,
  removeUIStepSql,
} from '@/api/play/step';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Divider, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';

interface ISelfProps {
  stepId?: number;
  callBackFunc: () => void;
}

const StepSql: FC<ISelfProps> = ({ stepId, callBackFunc }) => {
  const [sqlForm] = Form.useForm<any>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>();
  const [sql, setSql] = useState<string>();
  const [disable, setDisable] = useState(false);
  useEffect(() => {
    if (stepId) {
      detailUIStepSql({ stepId: stepId }).then(({ code, data }) => {
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
      const values = await sqlForm.getFieldsValue(true);
      values.stepId = stepId;
      values.sql_str = sql;
      if (formData) {
        values.uid = formData.uid;
        editUIStepSql(values).then(({ code, msg }) => {
          if (code === 0) {
            message.success(msg);
            setDisable(true);
            setLoading(false);
            callBackFunc();
          } else {
            setLoading(false);
            setDisable(false);
          }
        });
      } else {
        addUIStepSql(values).then(({ code, msg }) => {
          if (code === 0) {
            message.success(msg);
            setDisable(true);
            setLoading(false);
            callBackFunc();
          } else {
            setLoading(false);
            setDisable(false);
          }
        });
      }
    }
  };

  return (
    <ProCard
      title={'SQL'}
      loading={loading}
      headerBordered={true}
      subTitle={'若存在接口请求、会低于接口优先级执行'}
      extra={
        <>
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
                    removeUIStepSql({ uid: formData.uid }).then(
                      ({ code, msg }) => {
                        if (code === 0) {
                          message.success(msg);
                          sqlForm.resetFields();
                          setFormData(undefined);
                          callBackFunc();
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
            name={'description'}
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
        onChange={(value: string) => setSql(value)}
        height={'20vh'}
      />
    </ProCard>
  );
};

export default StepSql;
