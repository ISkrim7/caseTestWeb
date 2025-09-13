import { queryTestCaseSupStep } from '@/api/case/testCase';
import { CaseHubConfig } from '@/pages/CaseHub/CaseConfig';
import CaseSubSteps from '@/pages/CaseHub/TestCase/CaseSubSteps';
import { CaseSubStep, ITestCase } from '@/pages/CaseHub/type';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import { FC, useEffect, useState } from 'react';

interface Props {
  testcase?: ITestCase;
  callback: () => void;
}

const TestCaseDetail: FC<Props> = ({ testcase, callback }) => {
  const [caseForm] = Form.useForm<ITestCase>();

  const [testCaseSteps, setTestCaseSteps] = useState<CaseSubStep[]>([]);
  const [editStatus, setEditStatus] = useState<number>(0);
  const { CASE_LEVEL_OPTION, CASE_TYPE_OPTION } = CaseHubConfig;

  const reload = () => {
    setEditStatus(editStatus + 1);
  };

  useEffect(() => {
    if (testcase) {
      caseForm.setFieldsValue(testcase);
      queryTestCaseSupStep(testcase.id!.toString()).then(
        async ({ code, data, msg }) => {
          if (code === 0) {
            setTestCaseSteps(data);
          }
        },
      );
    }
  }, [testcase, editStatus]);

  const submit = async () => {
    const values = await caseForm.validateFields();
    console.log(values);
    console.log(testCaseSteps);
  };
  return (
    <ProCard extra={<Button onClick={submit}>保存</Button>}>
      <ProForm form={caseForm} submitter={false}>
        <ProCard style={{ marginBottom: 8 }}>
          <ProFormText
            name={'case_name'}
            label={'用例标题'}
            placeholder={'请输入用例标题'}
            required={true}
            tooltip={'最长20位'}
            rules={[{ required: true, message: '标题不能为空' }]}
          />
        </ProCard>

        <ProCard>
          <ProForm.Group size={'large'}>
            <ProFormSelect
              label={'用例等级'}
              required={true}
              width={'md'}
              name={'case_level'}
              options={CASE_LEVEL_OPTION}
            />
            <ProFormSelect
              label={'用例类型'}
              required={true}
              width={'md'}
              name={'case_type'}
              options={CASE_TYPE_OPTION}
            />
          </ProForm.Group>
        </ProCard>
        <CaseSubSteps
          caseId={testcase?.id}
          caseSubStepDataSource={testCaseSteps}
          callback={reload}
          hiddenStatusBut={true}
          setCaseSubStepDataSource={setTestCaseSteps}
        />
      </ProForm>
    </ProCard>
  );
};

export default TestCaseDetail;
