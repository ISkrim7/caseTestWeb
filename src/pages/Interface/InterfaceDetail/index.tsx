import { getApiDetail, putApi, runApi } from '@/api/interface';
import InterfaceEditor from '@/pages/Interface/InterfaceEditor';
import InterResponse from '@/pages/Interface/InterResponse';
import { IInterface, ISteps } from '@/pages/Interface/types';
import Single from '@/pages/Report/History/Single';
import { ForwardOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import {
  Button,
  Dropdown,
  Form,
  FormInstance,
  MenuProps,
  message,
  Space,
  Spin,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'umi';

const Index = () => {
  const { uid, projectID } = useParams<{
    uid: string;
    projectID: string;
    casePartID: string;
  }>();
  const [load, setLoad] = useState<boolean>(false);
  const [openResult, setOpenResult] = useState(false);
  const [interfaceForm] = Form.useForm<IInterface>();
  const [steps, setSteps] = useState<ISteps[]>();
  const [responseUid, setResponseUid] = useState<string>();
  const [edit, setEdit] = useState(0);
  const stepsFormList = useRef<FormInstance<ISteps>[]>([]);

  useEffect(() => {
    fetchApiDetail().then(() => {});
  }, [edit]);

  const fetchApiDetail = async () => {
    setLoad(true);

    const { code, data } = await getApiDetail({ uid: uid! });
    if (code === 0) {
      setLoad(false);

      interfaceForm.setFieldsValue(data);
      setSteps(data.steps || []);
    }
  };

  const submit = async () => {
    const value = await interfaceForm.validateFields();
    const editInfo: IInterface = {
      ...value,
      steps: stepsFormList.current.map((stepForm) => {
        // stepForm.validateFields().catch((err)=>{
        //     err.errorFields.map((item: any) => {
        //         const errorStep = err.values.name;
        //         message.error(`步骤${errorStep}:` + item.errors[0]);
        //         return Promise.resolve();
        //     });
        // }
        return stepForm.getFieldsValue(true);
      }),
      uid: uid!,
    };
    console.log('submit', editInfo);
    setLoad(true);
    const { code, msg } = await putApi(editInfo);
    if (code === 0) {
      message.success(msg);
      setEdit(edit + 1);
    }
    setLoad(false);
  };

  const runClick = async () => {
    setOpenResult(true);
    const { code, data, msg } = await runApi({ uid: uid! });
    if (code === 0) {
      setResponseUid(data);
    } else {
      message.error(msg);
    }
  };

  const handleMenuClick: MenuProps['onClick'] = async () => {
    setOpenResult(true);
    const { code, data, msg } = await runApi({
      uid: uid!,
      withStructureLog: true,
    });
    if (code === 0) {
      setResponseUid(data);
    } else {
      message.error(msg);
    }
  };
  return (
    <div>
      <InterResponse
        roomId={responseUid}
        open={openResult}
        setOpen={setOpenResult}
      />
      <Spin tip={'努力加载中。。'} size={'large'} spinning={load}>
        <ProCard
          type={'inner'}
          bodyStyle={{ height: 'auto' }}
          extra={
            <Space>
              <Dropdown.Button
                type={'primary'}
                menu={{
                  items: [
                    {
                      label: '以输出构造日志运行',
                      key: '1',
                      icon: <ForwardOutlined style={{ color: 'orange' }} />,
                    },
                  ],
                  onClick: handleMenuClick,
                }}
                onClick={runClick}
              >
                Run
              </Dropdown.Button>
              <Button type={'primary'} onClick={submit}>
                提交修改
              </Button>
            </Space>
          }
        >
          <InterfaceEditor
            interfaceForm={interfaceForm}
            stepsInfo={steps}
            setSteps={setSteps}
            stepsForm={stepsFormList}
            currentProjectId={projectID!}
            currentInterfaceId={uid}
          />
        </ProCard>

        {uid ? (
          <ProCard>
            <Single interfaceUid={uid} />
          </ProCard>
        ) : null}
      </Spin>
    </div>
  );
};

export default Index;
