import { detailInterApiById } from '@/api/inter';
import { queryEnvByProjectIdFormApi } from '@/components/CommonFunc';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { CONFIG } from '@/utils/config';
import {
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, Tabs } from 'antd';
import { useEffect, useState } from 'react';

import InterBody from '@/pages/Httpx/componets/InterBody';
import InterHeader from '@/pages/Httpx/componets/InterHeader';
import InterParam from '@/pages/Httpx/componets/InterParam';

const Index = () => {
  const [openChoice, setOpenChoice] = useState(false);
  const { API_REQUEST_METHOD } = CONFIG;
  const [envs, setEnvs] = useState<{ label: string; value: number | null }[]>(
    [],
  );
  const [choiceInterfaceId, setChoiceInterfaceId] = useState<number>();
  const [interApiForm] = Form.useForm<IInterfaceAPI>();

  useEffect(() => {
    if (choiceInterfaceId) {
      setOpenChoice(false);
      console.log('==', choiceInterfaceId);
      detailInterApiById({ interfaceId: choiceInterfaceId }).then(
        async ({ code, data }) => {
          if (code === 0) {
            interApiForm.setFieldsValue(data);
            queryEnvByProjectIdFormApi(data.project_id, setEnvs, true).then();
          }
        },
      );
    }
  }, [choiceInterfaceId]);

  return (
    <ProCard
      extra={<Button onClick={() => setOpenChoice(true)}>选择接口</Button>}
    >
      <ProForm form={interApiForm} submitter={false}>
        <ProForm.Group>
          <ProFormText
            label={'接口名称'}
            name={'name'}
            width={'md'}
            required={true}
            rules={[{ required: true, message: '步骤名称不能为空' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            label={'URL'}
            addonBefore={
              <ProFormSelect
                noStyle
                name={'env_id'}
                options={envs}
                required={true}
                placeholder={'环境选择'}
                label={'Env'}
                fieldProps={{}}
              />
            }
            name={'url'}
            width={'md'}
            addonAfter={
              <ProFormSelect
                noStyle
                className={'method'}
                name={'method'}
                label={'method'}
                initialValue={'POST'}
                options={API_REQUEST_METHOD}
                required={true}
                rules={[{ required: true, message: 'method 不能为空' }]}
              />
            }
          />
        </ProForm.Group>
        <ProCard bodyStyle={{ padding: 0 }}>
          <Tabs defaultActiveKey={'0'} type="card">
            <Tabs.TabPane key={'0'} tab={'Setting'}>
              <ProForm.Group>
                <ProFormDigit
                  label={'并发数'}
                  width={'md'}
                  name={'perf_user'}
                />
                <ProFormDigit
                  label={'时长'}
                  width={'md'}
                  name={'perf_time'}
                  addonAfter={'s'}
                />
              </ProForm.Group>
            </Tabs.TabPane>
            <Tabs.TabPane key={'2'} tab={'Headers'}>
              <InterHeader form={interApiForm} />
            </Tabs.TabPane>
            <Tabs.TabPane key={'1'} tab={'Query'}>
              <InterParam form={interApiForm} />
            </Tabs.TabPane>
            <Tabs.TabPane key={'3'} tab={'Body'}>
              <InterBody form={interApiForm} mode={1} />
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
      </ProForm>
    </ProCard>
  );
};

export default Index;
