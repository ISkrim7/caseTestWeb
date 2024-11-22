import React, { FC, useEffect, useState } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Form, FormInstance, Tabs } from 'antd';
import PostmanBody from '@/pages/Interface/Postman/PostmanBody';
import { ITryResponse, ISteps } from '@/pages/Interface/types';
import ExtractTable from '@/pages/Interface/Postman/component/ExtractTable';
import AssertsTable from '@/pages/Interface/Postman/component/AssertsTable';
import BeforeRequest from '@/pages/Interface/Postman/component/BeforeRequest';
import AfterRequest from '@/pages/Interface/Postman/component/AfterRequest';

const { TabPane } = Tabs;

interface SelfProps {
  stepsForm: React.MutableRefObject<FormInstance<ISteps>[]>;
  stepsInfo?: ISteps[];
  step: number;
  setSteps?: any;
  setTryResponse: (response: ITryResponse[]) => void;
  setLoading: (load: boolean) => void;
  currentProjectId: string;
  currentInterfaceId?: string;
}

const Index: FC<SelfProps> = (props) => {
  const { stepsForm, step, stepsInfo } = props;
  const [activeKey, setActiveKey] = useState('2');
  const [stepForm] = Form.useForm<ISteps>();
  const [currentStepInfo, setCurrentStepInfo] = useState<ISteps>();
  useEffect(() => {
    //如果是回显 拿到后端数据
    if (stepsInfo) {
      //找到当前步骤
      const _currentStepInfo = stepsInfo.find((_, i) => i === step);
      if (_currentStepInfo) {
        // 如果当前步骤有数据 就set回显
        setCurrentStepInfo(_currentStepInfo);
        stepForm.resetFields();
        stepForm.setFieldsValue(_currentStepInfo);

        if (!stepsForm.current.includes(stepForm)) {
          stepsForm.current.push(stepForm);
        }
      } else {
        //如果没有就是在这个基础上新增
        stepForm.setFieldValue('step', step);
        stepsForm.current.push(stepForm);
      }
    } else {
      //新增
      stepForm.setFieldValue('step', step);
      stepsForm.current.push(stepForm);
    }
  }, [stepsInfo, step]);

  return (
    <ProCard>
      <Tabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
        }}
      >
        <TabPane key="1" tab={<span>前置动作</span>}>
          <BeforeRequest
            stepForm={stepForm}
            stepInfo={currentStepInfo}
            currentProjectId={props.currentProjectId}
          />
        </TabPane>
        <TabPane key="2" tab={<span>接口请求</span>}>
          <PostmanBody
            {...props}
            stepForm={stepForm}
            stepInfo={currentStepInfo}
          />
        </TabPane>
        <TabPane key="3" tab={<span>出参提取</span>}>
          <ExtractTable stepForm={stepForm} stepInfo={currentStepInfo} />
        </TabPane>
        <TabPane key="4" tab={<span>断言</span>}>
          <AssertsTable stepForm={stepForm} stepInfo={currentStepInfo} />
        </TabPane>
        <TabPane key="5" tab={<span>后置动作</span>}>
          <AfterRequest
            stepForm={stepForm}
            stepInfo={currentStepInfo}
            currentProjectId={props.currentProjectId}
          />
        </TabPane>
      </Tabs>
    </ProCard>
  );
};

export default Index;
