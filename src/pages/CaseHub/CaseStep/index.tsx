import MyDrawer from '@/components/MyDrawer';
import { CaseHubConfig } from '@/pages/CaseHub/CaseConfig';
import CaseSubSteps from '@/pages/CaseHub/CaseStep/CaseSubSteps';
import DynamicInfo from '@/pages/CaseHub/CaseStep/DynamicInfo';
import { CaseStepInfo, CaseSubStep } from '@/pages/CaseHub/type';
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
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  Form,
  MenuProps,
  Space,
  Tag,
} from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface Props {
  caseStepData: CaseStepInfo;
  setCheckSubSteps: React.Dispatch<React.SetStateAction<number[]>>;
}

const Index: FC<Props> = ({ caseStepData, setCheckSubSteps }) => {
  const [form] = Form.useForm<CaseStepInfo>();
  const [collapsible, setCollapsible] = useState<boolean>(true);
  const [caseSubStepDataSource, setCaseSubStepDataSource] = useState<
    CaseSubStep[]
  >([]);
  const [tagVisible, setTagVisible] = useState(true);
  const [levelVisible, setLevelVisible] = useState(true);
  const [typeVisible, setTypeVisible] = useState(true);
  const [tag, setTag] = useState<string>();
  const [level, setLevel] = useState<string>('P2');
  const [type, setType] = useState<number>(2);
  const [openDynamic, setOpenDynamic] = useState(false);
  const {
    CASE_LEVEL_OPTION,
    CASE_STEP_STATUS_TEXT_ENUM,
    CASE_STEP_STATUS_COLOR_ENUM,
    CASE_TYPE_OPTION,
    CASE_TYPE_ENUM,
    CASE_LEVEL_COLOR_ENUM,
  } = CaseHubConfig;
  useEffect(() => {
    if (caseStepData) {
      form.setFieldsValue(caseStepData);
      if (caseStepData.case_step_tag) {
        setTag(caseStepData.case_step_tag);
        setTagVisible(false);
      }
      if (caseStepData.case_step_level) {
        setLevel(caseStepData.case_step_level);
        setLevelVisible(false);
      }
      if (caseStepData.case_step_type) {
        setType(caseStepData.case_step_type);
        setTypeVisible(false);
      }
      if (caseStepData.case_sub_step) {
        setCaseSubStepDataSource(caseStepData.case_sub_step);
      }
    }
  }, [caseStepData]);
  const CardTitle = (
    <div
      key={caseStepData.id}
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
      <Space size={'small'}>
        <Checkbox
          onChange={(e) => {
            const checked = e.target.checked;
            const subStepId = caseStepData.id;
            setCheckSubSteps((pre) =>
              checked
                ? pre.includes(subStepId)
                  ? pre
                  : [...pre, subStepId]
                : pre.filter((id) => id !== subStepId),
            );
          }}
        />
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
      </Space>

      <Space size={'small'} style={{ marginLeft: 10 }}>
        <Tag>{form.getFieldValue('uid')}</Tag>
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
          noStyle
          name={'case_step_name'}
          placeholder={'请输入用例标题'}
          required
          tooltip={'最长20位'}
          rules={[{ required: true, message: '标题不能为空' }]}
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
      {tagVisible ? (
        <ProFormText
          noStyle={true}
          name={'case_step_tag'}
          placeholder="标签"
          fieldProps={{
            onChange: (e) => {
              if (e.target.value) setTag(e.target.value);
            },
            onBlur: (e) => {
              const tagValue = form.getFieldValue('case_step_tag');
              if (tagValue && tag) {
                setTag(tagValue);
                setTagVisible(false);
              }
            },
            onPressEnter: (e) => {
              const tagValue = form.getFieldValue('case_step_tag');
              if (tagValue && tag) {
                setTag(tagValue);
                setTagVisible(false);
              }
            },
          }}
        />
      ) : (
        <Tag
          onClick={() => {
            setTagVisible(true);
          }}
          style={{
            textOverflow: 'ellipsis',
            textAlign: 'center',
          }}
          color="#2db7f5"
          // onClose={() => {
          //   setTagVisible(true);
          // }}
        >
          {tag && tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
        </Tag>
      )}
      {levelVisible ? (
        <ProFormSelect
          noStyle
          style={{ borderRadius: 20 }}
          name="case_step_level"
          required
          onChange={(value: string) => {
            setLevel(value);
            setLevelVisible(false);
          }}
          initialValue={'P1'}
          options={CASE_LEVEL_OPTION}
        />
      ) : (
        <Tag
          color={CASE_LEVEL_COLOR_ENUM[level]}
          onClick={() => setLevelVisible(true)}
        >
          {level}
        </Tag>
      )}
      {typeVisible ? (
        <ProFormSelect
          noStyle
          style={{
            borderRadius: 20,
            height: 'auto',
          }}
          onChange={(value: number) => {
            setType(value);
            setTypeVisible(false);
          }}
          name={'case_step_type'}
          initialValue={2}
          // valueEnum={CASE_TYPE_ENUM}
          options={CASE_TYPE_OPTION}
        />
      ) : (
        <Tag onClick={() => setTypeVisible(true)}>{CASE_TYPE_ENUM[type]}</Tag>
      )}
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
        text={CASE_STEP_STATUS_TEXT_ENUM[caseStepData.case_step_status]}
        color={CASE_STEP_STATUS_COLOR_ENUM[caseStepData.case_step_status]}
      >
        <ProCard
          hoverable
          title={CardTitle}
          extra={ExtraOpt}
          split="vertical"
          bordered
          bodyStyle={{
            padding: 10,
          }}
          collapsible
          collapsed={collapsible}
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
