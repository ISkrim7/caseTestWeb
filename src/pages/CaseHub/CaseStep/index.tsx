import CaseSubSteps from '@/pages/CaseHub/CaseStep/CaseSubSteps';
import { CaseStepInfo, CaseSubStep } from '@/pages/CaseHub/type';
import {
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  MessageOutlined,
  PlusOutlined,
  RightOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Form, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';

const Index = () => {
  const [form] = Form.useForm<CaseStepInfo>();
  const [collapsible, setCollapsible] = useState<boolean>(true);
  const [caseSubStepDataSource, setCaseSubStepDataSource] = useState<
    CaseSubStep[]
  >([]);
  const [inputVisible, setInputVisible] = useState(true);
  const [tag, setTag] = useState<string>();

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
        {inputVisible ? (
          <ProFormText
            noStyle={true}
            name={'case_step_tag'}
            width="sm"
            placeholder="标签"
            fieldProps={{
              onChange: (e) => {
                setTag(e.target.value);
              },
              onBlur: (e) => {
                setTag(e.target.value);
              },
              onPressEnter: (e) => {
                const tagValue = form.getFieldValue('case_step_tag');
                if (tagValue) {
                  setTag(tagValue);
                  setInputVisible(false);
                }
              },
            }}
          />
        ) : (
          <Tag
            onClick={() => {
              setInputVisible(true);
            }}
            color="#2db7f5"
            onClose={() => {
              setInputVisible(true);
            }}
          >
            {tag && tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
          </Tag>
        )}
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
          name={'case_step_name'}
          placeholder={'请输入用例标题'}
          required={true}
          tooltip={'最长20位'}
          rules={[{ required: true, message: '标题不能为空' }]}
        />
        <ProFormRadio.Group
          noStyle
          style={{ borderRadius: 20 }}
          name="case_step_level"
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
          name={'case_step_type'}
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
    setCaseSubStepDataSource((item) => [...item, newCaseSubStepDataSource]);
  };

  const menuItems: MenuProps['items'] = [
    {
      label: '备注',
      key: '1',
      icon: <MessageOutlined />,
    },
    {
      label: '复制',
      key: '2',
      icon: <CopyOutlined />,
    },
    {
      label: '删除',
      key: '3',
      icon: <DeleteOutlined />,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
    switch (e.key) {
      case '1':
        console.log('备注');
        return;
      case '2':
        console.log('复制');
        return;
      case '3':
        console.log('de;ete');
    }
  };
  const ExtraOpt = (
    <Space>
      <Button onClick={addSubStepLine} type={'primary'}>
        <PlusOutlined /> 添加步骤
      </Button>
      <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
        <SettingOutlined />
      </Dropdown>
    </Space>
  );
  useEffect(() => {
    if (caseSubStepDataSource) {
      console.log('==========', caseSubStepDataSource);
      form.setFieldsValue({ case_sub_step: caseSubStepDataSource });
    }
  }, [caseSubStepDataSource]);
  // 监听表单值变化
  const handleValuesChange = (changedValues: any, allValues: CaseStepInfo) => {
    const values = form.getFieldsValue(true);
    console.log('all', values);
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
        hoverable={true} // 添加悬停效果
        title={CardTitle}
        extra={ExtraOpt}
        split="vertical"
        bordered
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
