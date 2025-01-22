import { copyStep, removeStep } from '@/api/play/step';
import MyDrawer from '@/components/MyDrawer';
import PlayStepDetail from '@/pages/Play/PlayCase/PlayStepDetail';
import { IUICaseSteps } from '@/pages/UIPlaywright/uiTypes';
import { ProCard } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tabs, Tag } from 'antd';
import { FC, useState } from 'react';

interface ISelfProps {
  caseId: string;
  uiStepInfo?: IUICaseSteps;
  collapsible?: boolean;
  callBackFunc: () => void;
}

const Index: FC<ISelfProps> = ({
  caseId,
  uiStepInfo,
  callBackFunc,
  collapsible,
}) => {
  const [openStepDrawer, setOpenStepDrawer] = useState(false);

  const copyUIStep = async () => {
    const { code } = await copyStep({
      caseId: caseId,
      stepId: uiStepInfo?.id!,
    });
    if (code === 0) {
      callBackFunc();
    }
  };
  const removeUIStep = async () => {
    const { code, msg } = await removeStep({
      caseId: caseId,
      stepId: uiStepInfo?.id!,
    });
    if (code === 0) {
      message.success(msg);
      callBackFunc();
    }
  };
  const CardExtra = (
    <>
      {uiStepInfo?.is_common_step ? (
        <Tag color={'green-inverse'}>公</Tag>
      ) : null}
      <Button type={'link'} onClick={copyUIStep}>
        Copy To Bottom
      </Button>
      <Button
        type={'link'}
        onClick={() => {
          setOpenStepDrawer(true);
        }}
      >
        Detail
      </Button>

      <Popconfirm
        title={'确认删除？'}
        description={'非公共步骤会彻底删除'}
        okText={'确认'}
        cancelText={'点错了'}
        style={{ marginLeft: 10 }}
        onConfirm={removeUIStep}
      >
        <Button type={'link'}>Del</Button>
      </Popconfirm>
    </>
  );
  return (
    <>
      <MyDrawer
        name={'Add Step'}
        width={'auto'}
        open={openStepDrawer}
        setOpen={setOpenStepDrawer}
      >
        <PlayStepDetail
          stepId={uiStepInfo?.id!}
          func={() => {
            setOpenStepDrawer(false);
          }}
        />
      </MyDrawer>
      <ProCard
        extra={CardExtra}
        bordered
        boxShadow={true}
        collapsible={true}
        defaultCollapsed={collapsible}
        subTitle={<span>{uiStepInfo?.description}</span>}
        title={
          <>
            <Tag color={'#108ee9'}>{uiStepInfo?.name}</Tag>
          </>
        }
      >
        <ProCard>
          <Tabs tabPosition={'left'} size={'small'}>
            <Tabs.TabPane key={'1'} tab={'接口请求'}>
              {/*<API {...props} />*/}
            </Tabs.TabPane>
            <Tabs.TabPane key={'2'} tab={'执行SQL'}>
              {/*<SQL {...props} />*/}
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
      </ProCard>
    </>
  );
};
export default Index;
