import {
  addUICaseStepApi,
  deleteUICaseStepApi,
  getUICaseStepAPIInfo,
  updateUICaseStepApi,
} from '@/api/aps';
import Assert from '@/pages/UIPlaywright/UICase/EditCase/StepFunc/API/Assert';
import Body from '@/pages/UIPlaywright/UICase/EditCase/StepFunc/API/Body';
import Extract from '@/pages/UIPlaywright/UICase/EditCase/StepFunc/API/Extract';
import Param from '@/pages/UIPlaywright/UICase/EditCase/StepFunc/API/Param';
import { IUICaseStepAPI } from '@/pages/UIPlaywright/uiTypes';
import { CONFIG } from '@/utils/config';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Divider, Form, message, Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  stepId: number;
  reload: () => void;
}

const Index: FC<SelfProps> = ({ stepId, reload }) => {
  const [apiForm] = Form.useForm<IUICaseStepAPI>();
  const { API_REQUEST_METHOD } = CONFIG;
  const [apiData, setApiData] = useState<IUICaseStepAPI>();
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stepId) {
      getUICaseStepAPIInfo({ stepId: stepId }).then(({ code, data }) => {
        if (code === 0) {
          setApiData(data);
          apiForm.setFieldsValue(data);
        }
      });
    }
  }, [stepId]);
  useEffect(() => {
    if (apiData) {
      setDisable(true);
      setLoading(false);
    } else {
      setLoading(false);
      setDisable(false);
    }
  }, [apiData]);

  const onSave = async () => {
    let isValid = true;

    try {
      await apiForm.validateFields();
    } catch (error) {
      isValid = false;
      message.error('表单数据存在错误，请检查');
      return;
    }
    if (isValid) {
      setLoading(true);
      //新增
      const apiInfo = apiForm.getFieldsValue(true);
      apiInfo.stepId = stepId;
      //修改
      if (apiData) {
        apiInfo.uid = apiData.uid;
        updateUICaseStepApi(apiInfo).then(({ code, msg }) => {
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
        addUICaseStepApi(apiInfo).then(({ code, msg }) => {
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
  const CardExtra = () => {
    return (
      <>
        {!disable ? (
          <Button onClick={onSave} type={'primary'}>
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
                if (apiData?.uid) {
                  deleteUICaseStepApi({ uid: apiData.uid }).then(
                    ({ code, msg }) => {
                      if (code === 0) {
                        message.success(msg);
                        apiForm.resetFields();
                        setApiData(undefined);
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
    );
  };

  const addonAfter = (
    <>
      <ProFormSelect
        noStyle
        className={'method'}
        name={'method'}
        label={'method'}
        initialValue={'GET'}
        options={API_REQUEST_METHOD}
        required={true}
        rules={[{ required: true, message: 'method 不能为空' }]}
      />
    </>
  );

  return (
    <ProCard split={'horizontal'} extra={<CardExtra />} loading={loading}>
      <ProForm
        form={apiForm}
        submitter={false}
        disabled={disable}
        loading={loading}
      >
        <ProCard bodyStyle={{ padding: 0 }}>
          <Tabs size={'small'}>
            <Tabs.TabPane key={'a'} tab={'请求信息'}>
              <ProForm.Group>
                <ProFormText
                  label={'步骤名称'}
                  name={'name'}
                  width={'md'}
                  required={true}
                  rules={[{ required: true, message: '步骤名称不能为空' }]}
                />
                <ProFormText
                  label={'URL'}
                  name={'url'}
                  width={'md'}
                  rules={[
                    { required: true, message: '请输入请求url' },
                    { pattern: new RegExp('^\\/.*'), message: 'url 格式错误' },
                  ]}
                  addonAfter={addonAfter}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormRadio.Group
                  required={true}
                  label={'该UI步骤前后运行'}
                  radioType={'radio'}
                  name={'b_or_a'}
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
                <ProFormRadio.Group
                  required={true}
                  label={'接口断言失败是否继续执行UI'}
                  radioType={'radio'}
                  name={'go_on'}
                  width={'md'}
                  initialValue={1}
                  rules={[{ required: true, message: '不能为空' }]}
                  options={[
                    {
                      label: '是',
                      value: 1,
                    },
                    {
                      label: '否',
                      value: 0,
                    },
                  ]}
                />
                <ProFormTextArea
                  label={'步骤描述'}
                  name={'desc'}
                  width={'md'}
                />
              </ProForm.Group>
              <Tabs defaultActiveKey={'1'}>
                <Tabs.TabPane key={'1'} tab={'Params'}>
                  <Param apiForm={apiForm} apiData={apiData} />
                </Tabs.TabPane>
                <Tabs.TabPane key={'2'} tab={'Body'}>
                  <ProForm.Item name={'body'}>
                    <Body apiForm={apiForm} read={disable} />
                  </ProForm.Item>
                </Tabs.TabPane>
              </Tabs>
            </Tabs.TabPane>
            <Tabs.TabPane key={'b'} tab={'响应结果提取'}>
              <Extract apiForm={apiForm} apiData={apiData} />
            </Tabs.TabPane>
            <Tabs.TabPane key={'c'} tab={'响应断言'}>
              <Assert apiForm={apiForm} apiData={apiData} />
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
      </ProForm>
    </ProCard>
  );
};

export default Index;
