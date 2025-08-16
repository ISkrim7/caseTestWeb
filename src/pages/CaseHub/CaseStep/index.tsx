import CaseSubSteps from '@/pages/CaseHub/CaseStep/CaseSubSteps';
import { CaseStepInfo, CaseSubStep } from '@/pages/CaseHub/type';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, Space } from 'antd';
import { useEffect, useState } from 'react';

const Index = () => {
  const [form] = Form.useForm<CaseStepInfo>();
  const [collapsible, setCollapsible] = useState<boolean>(true);
  const [caseSubStepDataSource, setCaseSubStepDataSource] = useState<
    CaseSubStep[]
  >([]);

  const CardTitle = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{ marginRight: 8, cursor: 'pointer' }}
        onClick={() => setCollapsible(!collapsible)}
      >
        {collapsible ? <RightOutlined /> : <DownOutlined />}
      </div>
      <Space size={'large'} style={{ marginLeft: 10 }}>
        <ProFormText
          style={{ fontWeight: 'bold' }}
          fieldProps={{
            variant: 'outlined',
            style: {
              borderRadius: 20,
              height: 'auto',
              width: '500px', // 添加宽度限制
            },
          }}
          allowClear
          noStyle={true}
          name={'case_title'}
          placeholder={'请输入用例标题'}
          required={true}
          tooltip={'最长20位'}
          rules={[{ required: true, message: '标题不能为空' }]}
        />
        <ProFormRadio.Group
          noStyle
          style={{ borderRadius: 20 }}
          name="case_level"
          radioType="button"
          required={true}
          fieldProps={{
            buttonStyle: 'solid',
          }}
          initialValue={'P1'}
          options={[
            {
              label: 'P0',
              value: 'P0',
            },
            {
              label: 'P1',
              value: 'P1',
            },
            {
              label: 'P2',
              value: 'P2',
            },
            {
              label: 'P3',
              value: 'P3',
            },
          ]}
        />
        <ProFormSelect
          noStyle
          style={{
            borderRadius: 20,
            height: 'auto',
          }}
          name={'case_type'}
          initialValue={'普通'}
          options={[
            {
              label: '普通',
              value: '普通',
            },
            {
              label: '冒烟',
              value: '冒烟',
            },
          ]}
        />
        <ProFormSelect
          allowClear={true}
          noStyle
          style={{
            borderRadius: 20,
            height: 'auto',
          }}
          name={'fieldB'}
          initialValue={'A'}
          options={[
            {
              label: 'A',
              value: 'A',
            },
            {
              label: 'B',
              value: 'B',
            },
          ]}
        />
      </Space>
    </div>
  );

  const addSubStepLine = () => {
    // 如果当前是折叠状态，则展开
    if (collapsible) {
      setCollapsible(false);
    }
    const newCaseSubStepDataSource: CaseSubStep = {
      id: Date.now().toString(),
      do: `请填写步骤描述`,
      exp: '请填写预期描述',
    };
    setCaseSubStepDataSource([
      ...caseSubStepDataSource,
      newCaseSubStepDataSource,
    ]);
  };
  const ExtraOpt = (
    <Space>
      <Button onClick={addSubStepLine}>+ 添加步骤</Button>
      <Button>复制</Button>
      <Button>删除</Button>
    </Space>
  );
  useEffect(() => {
    if (caseSubStepDataSource) {
      console.log('==========', caseSubStepDataSource);
    }
  }, [caseSubStepDataSource]);
  // 监听表单值变化
  const handleValuesChange = (changedValues: any, allValues: any) => {
    console.log('表单值变化:', changedValues);
    console.log('当前所有值:', allValues);
    // 这里可以处理数据或触发其他操作
  };

  return (
    <ProForm<CaseStepInfo>
      form={form}
      submitter={false}
      onValuesChange={handleValuesChange}
    >
      <ProCard
        hoverable // 添加悬停效果
        title={CardTitle}
        extra={ExtraOpt}
        subTitle={null}
        split="vertical"
        bordered
        boxShadow={true}
        bodyStyle={{
          padding: 10,
        }}
        collapsible={false}
        collapsed={collapsible}
        defaultCollapsed={true}
        headerBordered
        headStyle={{
          height: 80,
        }}
      >
        <CaseSubSteps
          caseSubStepDataSource={caseSubStepDataSource}
          setCaseSubStepDataSource={setCaseSubStepDataSource}
        />
      </ProCard>
    </ProForm>
  );
};

export default Index;
