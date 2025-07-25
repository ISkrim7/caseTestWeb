import { detailInterApiById } from '@/api/inter';
import {
  associationStepInterApi,
  removeAssociationStepInterApi,
} from '@/api/play/playCase';
import MyDrawer from '@/components/MyDrawer';
import MyTabs from '@/components/MyTabs';
import InterAssertList from '@/pages/Httpx/componets/InterAssertList';
import InterBody from '@/pages/Httpx/componets/InterBody';
import InterExtractList from '@/pages/Httpx/componets/InterExtractList';
import InterHeader from '@/pages/Httpx/componets/InterHeader';
import InterParam from '@/pages/Httpx/componets/InterParam';
import InterfaceCaseChoiceApiTable from '@/pages/Httpx/InterfaceApiCaseResult/InterfaceCaseChoiceApiTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import StepApiForm from '@/pages/Play/componets/StepFunc/StepFuncAPI/StepAPIForm';
import { IUICaseSteps } from '@/pages/Play/componets/uiTypes';
import {
  ApiOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { ProCard, ProForm } from '@ant-design/pro-components';
import { Button, Divider, Empty, Form, message, Space, TabsProps } from 'antd';
import { FC, useEffect, useState } from 'react';

interface Self {
  currentProjectId: number;
  subStepInfo: IUICaseSteps;
  envs?: { label: string; value: number | null }[];
  callback: () => void;
}

const Index: FC<Self> = ({ subStepInfo, callback, currentProjectId, envs }) => {
  const [interApiForm] = Form.useForm<IInterfaceAPI>();
  const [headersLength, setHeadersLength] = useState<number>();
  const [queryLength, setQueryLength] = useState<number>();
  const [bodyLength, setBodyLength] = useState<number>();
  const [openChoiceAPIDrawer, setOpenChoiceAPIDrawer] = useState(false);
  const [currentAPIID, setCurrentAPIID] = useState<number>();

  /**
   * 关闭drawer 回显数据
   * @param value
   */
  const handleSelect = (value?: number[]) => {
    setOpenChoiceAPIDrawer(false);
    if (value) setCurrentAPIID(value[0]);
  };

  /**
   * setCurrent API ID 提起赋值
   * interface_a_or_b
   * interface_fail_stop
   */
  useEffect(() => {
    const { interface_id, interface_fail_stop, interface_a_or_b } = subStepInfo;
    if (interface_id) {
      setCurrentAPIID(interface_id);
      interApiForm.setFieldsValue({
        interface_a_or_b: interface_a_or_b,
        interface_fail_stop: interface_fail_stop,
      });
    }
  }, [subStepInfo]);

  /**
   * ☹查API 基本信息
   */
  useEffect(() => {
    if (currentAPIID) {
      detailInterApiById({ interfaceId: currentAPIID }).then(
        async ({ code, data }) => {
          if (code === 0) {
            setQueryLength(data.params?.length);
            setBodyLength(data.body_type !== 0 ? 1 : undefined);
            setHeadersLength(data.headers?.length);
            interApiForm.setFieldsValue(data);
          }
        },
      );
    }
  }, [currentAPIID]);

  const renderTab = (type: number) => {
    // 定义一个映射表，用于存储每个 type 对应的名称和长度变量
    const tabMap: { [key: number]: { name: string; lengthVar: any } } = {
      1: { name: 'Headers', lengthVar: headersLength },
      2: { name: 'Query', lengthVar: queryLength },
      3: { name: 'Body', lengthVar: bodyLength },
    };
    // 获取当前 type 对应的配置
    const tabConfig = tabMap[type];
    // 确保 lengthVar 是有效的数字
    const length =
      typeof tabConfig.lengthVar === 'number' && tabConfig.lengthVar > 0
        ? tabConfig.lengthVar
        : 0;
    // 根据长度动态渲染内容
    return (
      <span>
        {tabConfig.name}{' '}
        {length > 0 && <span style={{ color: 'green' }}>({length})</span>}
      </span>
    );
  };

  const BaseTabItems: TabsProps['items'] = [
    {
      key: '1',
      label: renderTab(1),
      children: <InterHeader form={interApiForm} readonly={true} />,
    },
    {
      key: '2',
      label: renderTab(2),
      children: <InterParam form={interApiForm} readonly={true} />,
    },
    {
      key: '3',
      label: renderTab(3),
      children: <InterBody form={interApiForm} mode={1} readonly={true} />,
    },
  ];

  const StepAPIArea = (
    <>
      <StepApiForm envs={envs} />
      <ProCard bodyStyle={{ padding: 0 }}>
        <MyTabs size={'small'} defaultActiveKey={'2'} items={BaseTabItems} />
      </ProCard>
    </>
  );
  const APITabItems: TabsProps['items'] = [
    {
      key: '2',
      label: '接口基础',
      icon: <ApiOutlined />,
      children: StepAPIArea,
    },
    {
      key: '3',
      label: '出参提取',
      icon: <EditOutlined />,
      children: <InterExtractList form={interApiForm} readonly={true} />,
    },
    {
      key: '4',
      label: '断言',
      icon: <CheckCircleOutlined />,
      children: <InterAssertList form={interApiForm} readonly={true} />,
    },
  ];
  const removeApi = async () => {
    removeAssociationStepInterApi({
      stepId: subStepInfo.id,
    }).then(async ({ code, msg }) => {
      if (code === 0) {
        message.success(msg);
        interApiForm.resetFields();
        setCurrentAPIID(undefined);
        callback();
      }
    });
  };

  const saveAPIorUpdateStep = async () => {
    await interApiForm.validateFields();
    const values = await interApiForm.getFieldsValue(true);
    const data = {
      apiId: values.id,
      interface_a_or_b: values.interface_a_or_b,
      interface_fail_stop: values.interface_fail_stop,
      stepId: subStepInfo.id,
    };
    const { code, msg } = await associationStepInterApi(data);
    if (code === 0) {
      message.success(msg);
      callback();
    }
  };

  //当是公共步骤 而且在case 下 不允许编辑
  const SaveAndChoiceArea = (
    <>
      {!subStepInfo.is_common_step && (
        <Space>
          <Button
            type="primary"
            hidden={currentAPIID === undefined}
            onClick={saveAPIorUpdateStep}
          >
            SAVE
          </Button>
          <Button
            variant="filled"
            color="danger"
            hidden={currentAPIID === undefined}
            onClick={removeApi}
          >
            REMOVE
          </Button>
          <Divider />
          <Button
            type="primary"
            variant="outlined"
            onClick={() => setOpenChoiceAPIDrawer(true)}
          >
            选择
          </Button>
        </Space>
      )}
    </>
  );
  return (
    <ProCard split={'horizontal'}>
      <MyDrawer
        name={'接口选择'}
        open={openChoiceAPIDrawer}
        setOpen={setOpenChoiceAPIDrawer}
      >
        <InterfaceCaseChoiceApiTable
          projectId={currentProjectId}
          currentStepId={subStepInfo.id}
          refresh={handleSelect}
        />
      </MyDrawer>
      <ProCard
        title={
          <a
            onClick={() => {
              window.open(
                `/interface/interApi/detail/interId=${interApiForm.getFieldValue(
                  'id',
                )}`,
              );
            }}
          >
            {subStepInfo.interface_id || currentAPIID
              ? `API_${interApiForm.getFieldValue('name')}`
              : null}
          </a>
        }
        bodyStyle={{ padding: 0 }}
        bordered={false}
        extra={SaveAndChoiceArea}
      >
        {subStepInfo.interface_id || currentAPIID ? (
          <ProForm
            form={interApiForm}
            //选择的API 不允许修改
            disabled={true}
            submitter={false}
          >
            <MyTabs size={'small'} defaultActiveKey={'2'} items={APITabItems} />
          </ProForm>
        ) : (
          <Empty description={'请选择接口'} />
        )}
      </ProCard>
    </ProCard>
  );
};
export default Index;
