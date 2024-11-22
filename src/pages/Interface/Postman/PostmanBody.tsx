import { queryHost } from '@/api/host';
import { getInterfaceStepVariables, tryApi } from '@/api/interface';
import BodyTable from '@/pages/Interface/Postman/component/BodyTable';
import HeadersTable from '@/pages/Interface/Postman/component/HeadersTable';
import ParamsTable from '@/pages/Interface/Postman/component/ParamsTable';
import { ISteps, ITryResponse } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, FormInstance, message, Tabs } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  stepsForm: React.MutableRefObject<FormInstance<ISteps>[]>;
  stepInfo?: ISteps;
  step: number;
  setSteps?: any;
  stepForm: FormInstance<ISteps>;
  setTryResponse: (response: ITryResponse[]) => void;
  setLoading: (load: boolean) => void;
  currentInterfaceId?: string;
}

const PostmanBody: FC<SelfProps> = (props) => {
  const {
    stepForm,
    stepsForm,
    step,
    setLoading,
    setTryResponse,
    currentInterfaceId,
  } = props;
  const { API_REQUEST_METHOD } = CONFIG;
  const [hosts, setHosts] = useState<{ value: string; label: any }[]>([]);
  const [variables, setVariables] = useState<
    { label: string; value: string; style: any }[]
  >([]);
  /**
   * 请求hosts setHosts
   */
  useEffect(() => {
    queryHost().then(({ code, data }) => {
      if (code === 0) {
        const _host = data.map((v: any) => ({
          value: v.uid,
          label: <span style={{ color: 'blue' }}>{v.name}</span>,
        }));
        setHosts(_host);
      }
    });
  }, []);

  const fetchStepVariables = async () => {
    const { code, data } = await getInterfaceStepVariables({
      interfaceId: currentInterfaceId!,
      step: step.toString(),
    });
    if (code === 0) {
      return data;
    }
  };

  useEffect(() => {
    if (currentInterfaceId) {
      fetchStepVariables().then((data) => {
        if (data) {
          const Var = data.map((item) => {
            return {
              label: `${item.key}${item.value ? ` - ${item.value}` : ''}`,
              value: item.key + '}}',
              style: { color: 'orange' },
            };
          });
          setVariables(Var);
        }
      });
    }
  }, [step]);

  const addonBefore = (
    <>
      <ProFormSelect
        style={{ color: 'burlywood' }}
        noStyle
        name={'host'}
        options={hosts}
        required={true}
        placeholder={'host选择'}
        rules={[{ required: true, message: 'host 不能为空' }]}
        label={'host'}
      />
    </>
  );
  /**
   * 调试请求
   */
  const tryFetch = async () => {
    const forms = stepsForm.current.slice(0, step + 1);
    let isValid = true;
    setLoading(true);

    for (const form of forms) {
      try {
        await form.validateFields();
      } catch (error) {
        isValid = false;
        message.error('表单数据不能为空');
        break;
      }
    }

    if (isValid) {
      setTryResponse([]);
      const { code, data, msg } = await tryApi({
        steps: forms.map((form) => form.getFieldsValue(true)),
      });
      setLoading(false);
      if (code === 0) {
        console.log(data);
        setTryResponse(data);
      }
    } else {
      setLoading(false);
    }
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
      <Button
        type={'primary'}
        onClick={tryFetch}
        style={{ borderRadius: '10px', marginLeft: 40 }}
      >
        Try
      </Button>
    </>
  );
  const urlRegex = new RegExp('^\\/.*');

  return (
    <ProCard split={'horizontal'}>
      <ProForm form={stepForm} submitter={false}>
        <ProFormText name={'step'} hidden />
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
            addonBefore={addonBefore}
            name={'url'}
            width={'md'}
            rules={[
              { required: true, message: '请输入请求url' },
              { pattern: urlRegex, message: 'url 格式错误' },
            ]}
            addonAfter={addonAfter}
          />
        </ProForm.Group>
        <ProForm.Group style={{ display: 'flex' }}>
          <ProFormTextArea label={'步骤描述'} name={'desc'} width={'lg'} />
        </ProForm.Group>
        <ProCard bodyStyle={{ padding: 0 }}>
          <Tabs defaultActiveKey={'1'}>
            <Tabs.TabPane key={'1'} tab={'Params'}>
              <ParamsTable {...props} variables={variables} />
            </Tabs.TabPane>
            <Tabs.TabPane key={'2'} tab={'Headers'}>
              <HeadersTable {...props} variables={variables} />
            </Tabs.TabPane>
            <Tabs.TabPane key={'3'} tab={'Body'}>
              <ProForm.Item name={'body'}>
                <BodyTable {...props} />
              </ProForm.Item>
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
      </ProForm>
    </ProCard>
  );
};

export default PostmanBody;
