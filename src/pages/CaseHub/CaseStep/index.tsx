import MyDrawer from '@/components/MyDrawer';
import CaseSubSteps from '@/pages/CaseHub/CaseStep/CaseSubSteps';
import DynamicInfo from '@/pages/CaseHub/CaseStep/DynamicInfo';
import { CaseStepInfo, CaseSubStep } from '@/pages/CaseHub/type';
import { CONFIG } from '@/utils/config';
import {
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  MessageOutlined,
  MoreOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Badge, Button, Dropdown, Form, MenuProps, Space, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface Props {
  caseStepData: CaseStepInfo;
}

const Index: FC<Props> = ({ caseStepData }) => {
  const [form] = Form.useForm<CaseStepInfo>();
  const [collapsible, setCollapsible] = useState<boolean>(true);
  const [caseSubStepDataSource, setCaseSubStepDataSource] = useState<
    CaseSubStep[]
  >([]);
  const [inputVisible, setInputVisible] = useState(true);
  const [tag, setTag] = useState<string>();
  const [openDynamic, setOpenDynamic] = useState(false);
  const { CASE_STEP_STATUS_TEXT, CASE_STEP_STATUS_COLOR } = CONFIG;
  useEffect(() => {
    if (caseStepData) {
      form.setFieldsValue(caseStepData);
      if (caseStepData.case_step_tag) {
        setTag(caseStepData.case_step_tag);
        setInputVisible(false);
      }
      if (caseStepData.case_sub_step) {
        setCaseSubStepDataSource(caseStepData.case_sub_step);
      }
    }
  }, [caseStepData]);
  const CardTitle = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minHeight: 32,
        flexWrap: 'nowrap',
        overflow: 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          marginRight: 8,
          cursor: 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => setCollapsible(!collapsible)}
      >
        {collapsible ? <RightOutlined /> : <DownOutlined />}
      </div>
      <Space size={'small'} style={{ marginLeft: 10 }}>
        <Tag>{form.getFieldValue('uid')}</Tag>
        {inputVisible ? (
          <ProFormText
            noStyle={true}
            name={'case_step_tag'}
            // width="sm"
            placeholder="标签"
            fieldProps={{
              onChange: (e) => {
                if (e.target.value) setTag(e.target.value);
              },
              onBlur: (e) => {
                if (e.target.value) setTag(e.target.value);
              },
              onPressEnter: (e) => {
                const tagValue = form.getFieldValue('case_step_tag');
                if (tagValue && tag) {
                  setTag(tagValue);
                  setInputVisible(false);
                }
              },
            }}
          />
        ) : (
          <div
            style={{
              width: 100,
            }}
          >
            <Tag
              onClick={() => {
                setInputVisible(true);
              }}
              style={{
                textOverflow: 'ellipsis',
                textAlign: 'center',
              }}
              color="#2db7f5"
              // onClose={() => {
              //   setInputVisible(true);
              // }}
            >
              {tag && tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
            </Tag>
          </div>
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
      id: Date.now(),
      do: `请填写步骤描述`,
      exp: '请填写预期描述',
    };
    setCaseSubStepDataSource((item) => [...item, newCaseSubStepDataSource]);
  };

  const menuItems: MenuProps['items'] = [
    {
      label: '动态',
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

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    console.log('click', e);
    switch (e.key) {
      case '1':
        setOpenDynamic(true);
        return;
      case '2':
        await copyStepCase();
        return;
      case '3':
        await deleteStepCase();
    }
  };

  const copyStepCase = async () => {};
  const deleteStepCase = async () => {};
  const ExtraOpt = (
    <Space style={{ marginRight: 20 }}>
      <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
        <Button type={'primary'} icon={<MoreOutlined />} />
      </Dropdown>
      <Button onClick={addSubStepLine} type={'primary'}>
        <PlusOutlined /> 添加步骤
      </Button>
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
      <Badge.Ribbon
        text={CASE_STEP_STATUS_TEXT[caseStepData.case_step_status]}
        color={CASE_STEP_STATUS_COLOR[caseStepData.case_step_status]}
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
            padding: '0 16px',
          }}
        >
          <CaseSubSteps
            caseSubStepDataSource={caseSubStepDataSource}
            setCaseSubStepDataSource={setCaseSubStepDataSource}
          />
        </ProCard>
      </Badge.Ribbon>
      <MyDrawer
        name={'动态'}
        width={'30%'}
        open={openDynamic}
        setOpen={setOpenDynamic}
      >
        <DynamicInfo />
      </MyDrawer>
    </ProForm>
  );
};

export default Index;
