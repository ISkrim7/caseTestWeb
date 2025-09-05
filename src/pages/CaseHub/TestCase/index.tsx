import {
  copyTestCase,
  handleAddTestCaseStep,
  queryTestCaseSupStep,
  removeTestCase,
  saveTestCase,
  updateTestCase,
} from '@/api/case/testCase';
import MyDrawer from '@/components/MyDrawer';
import { CaseHubConfig } from '@/pages/CaseHub/CaseConfig';
import CaseLevelSelect from '@/pages/CaseHub/component/CaseLevelSelect';
import CaseTagSelect from '@/pages/CaseHub/component/CaseTagSelect';
import CaseTypeSelect from '@/pages/CaseHub/component/CaseTypeSelect';
import CaseSubSteps from '@/pages/CaseHub/TestCase/CaseSubSteps';
import DynamicInfo from '@/pages/CaseHub/TestCase/DynamicInfo';
import { CaseSubStep, ITestCase } from '@/pages/CaseHub/type';
import {
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  MessageOutlined,
  MoreOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  Form,
  MenuProps,
  message,
  Space,
  Tag,
} from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface Props {
  top: any;
  reqId?: string;
  tags?: { label: string; value: string }[];
  setTags: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  testcaseData?: ITestCase;
  // setCheckSubSteps: React.Dispatch<React.SetStateAction<number[]>>;
  callback: () => void;
  collapsible: boolean;
}

const Index: FC<Props> = (props) => {
  const { top, callback, testcaseData, reqId, tags, setTags } = props;
  let timeout: NodeJS.Timeout | null = null;
  const [form] = Form.useForm<ITestCase>();
  const [collapsible, setCollapsible] = useState<boolean>(true);
  const [caseSubStepDataSource, setCaseSubStepDataSource] = useState<
    CaseSubStep[]
  >([]);
  const [openDynamic, setOpenDynamic] = useState(false);
  const { CASE_STATUS_TEXT_ENUM, CASE_STATUS_COLOR_ENUM } = CaseHubConfig;
  const [status, setStatus] = useState(0);
  useEffect(() => {
    if (testcaseData) {
      form.setFieldsValue(testcaseData);
    }
  }, [testcaseData]);
  useEffect(() => {
    if (!collapsible) {
      if (testcaseData?.id) {
        queryTestCaseSupStep(testcaseData.id.toString()).then(
          async ({ code, data, msg }) => {
            if (code === 0) {
              setCaseSubStepDataSource(data);
            }
          },
        );
      }
    }
  }, [collapsible, status]);

  const reloadCaseStep = () => {
    setStatus(status + 1);
  };

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
      <Space size={'small'}>
        <Checkbox
        // onChange={(e) => {
        //   const checked = e.target.checked;
        //   const subStepId = testcaseData!.id;
        //   setCheckSubSteps((pre) =>
        //     checked
        //       ? pre.includes(subStepId)
        //         ? pre
        //         : [...pre, subStepId]
        //       : pre.filter((id) => id !== subStepId),
        //   );
        // {/*}}*/}
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
        <Tag color={'#87d068'}>{testcaseData?.uid}</Tag>
        <ProFormText
          style={{ fontWeight: 'bold', width: 'auto' }}
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
          name={'case_name'}
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
    if (testcaseData?.id) {
      handleAddTestCaseStep({ caseId: testcaseData!.id }).then(
        async ({ code }) => {
          if (code === 0) {
            reloadCaseStep();
          }
        },
      );
    }
    // const newCaseSubStepDataSource: CaseSubStep = {
    //   uid: Date.now().toString(),
    //   action: `请填写步骤描述`,
    //   expected_result: '请填写预期描述',
    // };
    // setCaseSubStepDataSource((item) => [...item, newCaseSubStepDataSource]);
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

  const copyStepCase = async () => {
    if (testcaseData?.id) {
      const { code, msg } = await copyTestCase({
        requirementId: reqId ? parseInt(reqId) : null,
        caseId: testcaseData.id,
      });
      if (code === 0) {
        message.success(msg);
        callback();
      }
    }
  };
  const deleteStepCase = async () => {
    if (testcaseData?.id) {
      const { code, msg } = await removeTestCase({
        requirementId: reqId ? parseInt(reqId) : null,
        caseId: testcaseData.id,
      });
      if (code === 0) {
        message.success(msg);
        callback();
      }
    }
  };

  const ExtraOpt = (
    <Space style={{ marginRight: 30 }}>
      <CaseTagSelect
        tags={tags}
        setTags={setTags}
        testcaseData={testcaseData}
      />
      <CaseLevelSelect testcaseData={testcaseData} />
      <CaseTypeSelect testcaseData={testcaseData} />
      <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
        <Button type={'primary'} icon={<MoreOutlined />} />
      </Dropdown>
      <Button onClick={addSubStepLine} type={'primary'}>
        <PlusOutlined /> 添加步骤
      </Button>
    </Space>
  );

  // 监听表单值变化
  const handleValuesChange = async (
    changedValues: any,
    allValues: ITestCase,
  ) => {
    const values = form.getFieldsValue(true);
    console.log('all', values);
    console.log('表单值变化:', changedValues);
    if (timeout) {
      clearTimeout(timeout);
    }

    if (form.getFieldValue('id')) {
      changedValues.id = values.id;
      timeout = setTimeout(async () => {
        console.log('发送更新请求，当前值：', allValues);

        const { code, data, msg } = await updateTestCase(values);
        if (code === 0) {
          message.success(msg);
        }
      }, 3000); // 延时3秒
    } else {
      timeout = setTimeout(async () => {
        console.log('发送插入请求，当前值：', values);
        if (values.case_name && values.case_tag) {
          console.log(allValues);
          const { code, data, msg } = await saveTestCase(values);
          if (code === 0) {
            message.success(msg);
          }
        }
      }, 3000); // 延时3秒
    }
  };

  return (
    <ProForm<ITestCase>
      form={form}
      submitter={false}
      onValuesChange={handleValuesChange}
    >
      <Badge.Ribbon
        text={CASE_STATUS_TEXT_ENUM[testcaseData!.case_status!]}
        color={CASE_STATUS_COLOR_ENUM[testcaseData!.case_status!]}
      >
        <ProCard
          ref={top}
          hoverable
          title={CardTitle}
          extra={ExtraOpt}
          split="vertical"
          bordered
          bodyStyle={{
            padding: 10,
          }}
          defaultCollapsed={props.collapsible}
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
            callback={reloadCaseStep}
            setCaseSubStepDataSource={setCaseSubStepDataSource}
          />
        </ProCard>
      </Badge.Ribbon>
      <MyDrawer
        name={'动态'}
        width={'40%'}
        open={openDynamic}
        setOpen={setOpenDynamic}
      >
        <DynamicInfo caseId={testcaseData?.id} />
      </MyDrawer>
    </ProForm>
  );
};
export default Index;
