import {
  addUIStepApi,
  detailUIStepApi,
  editUIStepApi,
  removeUIStepApi,
} from '@/api/play/step';
import { IUICaseStepAPI, IUICaseSteps } from '@/pages/Play/componets/uiTypes';
import Assert from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard/StepFunc/StepAPI/Assert';
import Body from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard/StepFunc/StepAPI/Body';
import Extract from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard/StepFunc/StepAPI/Extract';
import Param from '@/pages/Play/PlayCase/PlayCaseDetail/CollapsibleUIStepCard/StepFunc/StepAPI/Param';
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

interface ISelfProps {
  stepInfo?: IUICaseSteps;
  callBackFunc: () => void;
  currentProjectId?: number;
  apiEnv?: any[];
}

const StepApi: FC<ISelfProps> = ({
  stepInfo,
  callBackFunc,
  currentProjectId,
  apiEnv,
}) => {
  const [apiForm] = Form.useForm<IUICaseStepAPI>();
  const { API_REQUEST_METHOD } = CONFIG;
  const [apiData, setApiData] = useState<IUICaseStepAPI>();
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [apiEnvs, setApiEnvs] = useState<
  //   { label: string; value: number | null }[]
  // >([]);
  useEffect(() => {
    if (stepInfo && stepInfo.has_api) {
      detailUIStepApi({ stepId: stepInfo.id }).then(({ code, data }) => {
        if (code === 0) {
          setApiData(data);
          apiForm.setFieldsValue(data);
        }
      });
    }
  }, [stepInfo, currentProjectId]);

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
    try {
      await apiForm.validateFields();
    } catch (error) {
      message.error('表单数据存在错误，请检查');
      return;
    }
    setLoading(true);
    //新增
    const values = apiForm.getFieldsValue(true);
    values.stepId = stepInfo?.id;
    //修改
    if (apiData) {
      values.uid = apiData.uid;
      editUIStepApi(values).then(({ code, msg }) => {
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
      //新增
      addUIStepApi(values).then(({ code, msg }) => {
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
                  removeUIStepApi({ uid: apiData.uid }).then(
                    ({ code, msg }) => {
                      if (code === 0) {
                        message.success(msg);
                        apiForm.resetFields();
                        setApiData(undefined);
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
              {apiEnv && (
                <ProForm.Group>
                  <ProFormText
                    label={'步骤名称'}
                    name={'name'}
                    required={true}
                    rules={[{ required: true, message: '步骤名称不能为空' }]}
                  />
                  <ProFormText
                    addonBefore={
                      <ProFormSelect
                        noStyle
                        name={'env_id'}
                        options={apiEnv}
                        showSearch={true}
                        required={true}
                        placeholder={'环境选择'}
                      />
                    }
                    label={'URL'}
                    name={'url'}
                    width={'md'}
                    rules={[
                      { required: true, message: '请输入请求url' },
                      {
                        pattern: new RegExp('^\\/.*'),
                        message: 'url 格式错误',
                      },
                    ]}
                    addonAfter={addonAfter}
                  />
                </ProForm.Group>
              )}
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
                  name={'description'}
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

export default StepApi;
