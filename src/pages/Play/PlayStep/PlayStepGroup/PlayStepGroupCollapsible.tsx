import { copySubSteps, removeSubSteps } from '@/api/play/playCase';
import MyDrawer from '@/components/MyDrawer';
import StepFunc from '@/pages/Play/componets/StepFunc';
import { IUICaseSteps } from '@/pages/Play/componets/uiTypes';
import PlayStepDetail from '@/pages/Play/PlayStep/PlayStepDetail';
import {
  ApiFilled,
  CopyFilled,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import { FC, useState } from 'react';

const { Text } = Typography;

interface ISelfProps {
  groupId: number;
  currentProjectId?: number;
  subStepInfo?: IUICaseSteps;
  collapsible?: boolean;
  callBackFunc: () => void;
  step: number;
  envs?: { label: string; value: number | null }[];
}

const PlayStepGroupCollapsible: FC<ISelfProps> = (props) => {
  const {
    step,
    envs,
    currentProjectId,
    callBackFunc,
    collapsible,
    groupId,
    subStepInfo,
  } = props;
  const [openStepDetailDrawer, setOpenStepDetailDrawer] = useState(false);

  const copyUIStep = async () => {
    copySubSteps({ stepId: subStepInfo?.id! }).then(async ({ code }) => {
      if (code === 0) {
        callBackFunc();
      }
    });
  };
  const removeUIStep = async () => {
    const { code, msg } = await removeSubSteps({
      stepId: subStepInfo?.id!,
    });
    if (code === 0) {
      message.success(msg);
      callBackFunc();
    }
  };

  const CardExtra = (
    <>
      <Space>
        {subStepInfo?.interface_id ? (
          <Tag color={'green'}>
            <ApiFilled />
            {subStepInfo.interface_a_or_b === 1 ? '前' : '后'}
          </Tag>
        ) : null}
        <Button color={'primary'} variant="filled" onClick={copyUIStep}>
          <CopyFilled />
          COPY
        </Button>
        <Button
          icon={<EditOutlined />}
          color={'primary'}
          variant="filled"
          onClick={() => {
            setOpenStepDetailDrawer(true);
          }}
        >
          DETAIL
        </Button>
        <Popconfirm
          title={'确认删除？'}
          description={'非公共步骤会彻底删除'}
          okText={'确认'}
          cancelText={'点错了'}
          onConfirm={removeUIStep}
        >
          <Button
            color={'danger'}
            variant={'filled'}
            style={{ marginRight: 10 }}
          >
            <DeleteOutlined />
            DEL
          </Button>
        </Popconfirm>
      </Space>
    </>
  );
  return (
    <ProCard
      extra={CardExtra}
      collapsibleIconRender={({ collapsed }) => (
        <>
          <UnorderedListOutlined style={{ color: '#c3cad4', marginLeft: 10 }} />{' '}
          {collapsed ? <RightOutlined /> : <DownOutlined />}
          <Tag color={'green-inverse'} style={{ marginLeft: 4 }}>
            Step_{step}
          </Tag>
        </>
      )}
      hoverable
      collapsible={true}
      ghost={true}
      style={{ borderRadius: '5px', marginTop: 10 }}
      defaultCollapsed={collapsible}
      subTitle={
        <Space>
          <Text type={'secondary'}>{subStepInfo?.description}</Text>
        </Space>
      }
      title={
        <>
          <Tag color={'#108ee9'} style={{ marginLeft: 4 }}>
            {subStepInfo?.name}
          </Tag>
        </>
      }
    >
      <MyDrawer
        name={'Step Detail'}
        width={'auto'}
        open={openStepDetailDrawer}
        setOpen={setOpenStepDetailDrawer}
      >
        <PlayStepDetail
          groupId={groupId}
          stepInfo={subStepInfo}
          isCommonStep={false}
          callBack={() => {
            setOpenStepDetailDrawer(false);
            callBackFunc();
          }}
        />
      </MyDrawer>
      <StepFunc
        currentProjectId={currentProjectId!}
        subStepInfo={subStepInfo!}
        envs={envs}
        callback={callBackFunc}
      />
    </ProCard>
  );
};

export default PlayStepGroupCollapsible;
