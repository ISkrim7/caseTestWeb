import { ICaseInfo, ICaseStepInfo } from '@/api';
import { insertCase, updateCase } from '@/api/case';
import CaseInfoStepTable from '@/pages/CaseHub/component/CaseInfoStepTable';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { FC, useEffect, useState } from 'react';

type CaseFormType = {};
type DataSourceType = {
  id: React.Key;
  step: number;
  todo: string;
  exp: string;
};
const CaseLevelOptions = [
  { label: 'P1', value: 'P1' },
  { label: 'P2', value: 'P2' },
  {
    label: 'P3',
    value: 'P3',
  },
  { label: 'P4', value: 'P4' },
];
const CaseTypeOptions = [
  { label: '普通用例', value: 1 },
  { label: '冒烟用例', value: 0 },
];

interface SelfProps {
  currentModuleId?: number;
  projectID?: number;
  setDrawerVisible?: any;
  callback: () => void;
  caseInfo?: ICaseInfo;
  update?: boolean;
}

const CaseForm: FC<SelfProps> = ({
  callback,
  currentModuleId,
  projectID,
  caseInfo,
  update = false,
}) => {
  const [form] = Form.useForm();
  const [caseStepSource, setCaseStepInfoSource] = useState<ICaseStepInfo[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    caseStepSource.map((item: any) => item.id),
  );
  useEffect(() => {
    if (caseInfo) {
      form.setFieldsValue(caseInfo);
      const newCaseInfo = caseInfo.case_info.map((caseStepInfo) => ({
        ...caseStepInfo,
        step: undefined,
      }));
      setCaseStepInfoSource(newCaseInfo);
    }
  }, [caseInfo]);

  const onFinish = async () => {
    try {
      await form.validateFields();
    } catch (e) {
      return;
    }

    const values = form.getFieldsValue(true);
    if (caseStepSource.length === 0) {
      message.error('执行步骤不能为空');
      return;
    }
    const info: ICaseInfo = {
      ...values,
      case_info: caseStepSource.map((item, index) => ({
        ...item,
        step: index + 1,
      })),
      project_id: projectID,
      module_id: currentModuleId,
    };
    console.log(info);

    if (update) {
      const { code, data, msg } = await updateCase(info);
      if (code === 0) {
        message.success(msg);
        callback();
      }
    } else {
      const { code, data, msg } = await insertCase(info);
      if (code === 0) {
        message.success(msg);
        callback();
      }
    }
  };

  return (
    <ProCard>
      <ProForm<CaseFormType> form={form} onFinish={onFinish}>
        <ProCard style={{ marginBottom: 8 }}>
          <ProFormText
            name={'case_title'}
            label={'用例标题'}
            placeholder={'请输入用例标题'}
            required={true}
            tooltip={'最长20位'}
            rules={[{ required: true, message: '标题不能为空' }]}
          />
          <ProFormTextArea
            name={'case_desc'}
            label={'用例描述'}
            placeholder={'请输入用例描述'}
            required={true}
            fieldProps={{
              rows: 2,
            }}
            rules={[{ required: true, message: '描述不能为空' }]}
          />
        </ProCard>

        <CaseInfoStepTable
          caseStepInfo={caseStepSource}
          setStepCaseInfo={setCaseStepInfoSource}
          editableKeys={editableKeys}
          setEditableRowKeys={setEditableRowKeys}
        />
        <ProCard>
          <ProForm.Group size={'large'}>
            <ProFormSelect
              label={'用例等级'}
              required={true}
              width={'md'}
              name={'case_level'}
              options={CaseLevelOptions}
              initialValue={'P1'}
            />
            <ProFormSelect
              label={'用例类型'}
              required={true}
              width={'md'}
              name={'case_type'}
              options={CaseTypeOptions}
              initialValue={'COMMENT'}
            />
          </ProForm.Group>
        </ProCard>
        <ProCard>
          <ProFormTextArea
            style={{ width: '100%' }}
            name={'case_setup'}
            label={'用例前置'}
            required={true}
            rules={[{ required: true, message: '前置不能为空' }]}
          />
        </ProCard>
        <ProCard>
          <ProFormTextArea
            style={{ width: '100%' }}
            name={'case_mark'}
            label={'用例备注'}
            required={false}
          />
        </ProCard>
      </ProForm>
    </ProCard>
  );
};

export default CaseForm;
