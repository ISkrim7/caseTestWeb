import { copyCaseStep, removePlayStep } from '@/api/play/playCase';
import MyDrawer from '@/components/MyDrawer';
import StepFunc from '@/pages/Play/componets/StepFunc';
import { IUICaseSteps } from '@/pages/Play/componets/uiTypes';
import PlayStepDetail from '@/pages/Play/PlayStep/PlayStepDetail';
import PlayGroupStepsTable from '@/pages/Play/PlayStep/PlayStepGroup/PlayGroupStepsTable';
import {
  ApiFilled,
  ConsoleSqlOutlined,
  CopyFilled,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import {
  Button,
  message,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { FC, useState } from 'react';

const { Text } = Typography;

interface ISelfProps {
  caseId: string;
  currentProjectId?: number;
  uiStepInfo?: IUICaseSteps;
  collapsible?: boolean;
  callBackFunc: () => void;
  envs?: any[];
  step: number;
}

const Index: FC<ISelfProps> = (props) => {
  const { caseId, uiStepInfo, callBackFunc, currentProjectId, envs, step } =
    props;
  const [openStepDetailDrawer, setOpenStepDetailDrawer] = useState(false);
  const [collapsible, setCollapsible] = useState<boolean>(true);

  const copyUIStep = async () => {
    copyCaseStep({
      caseId: parseInt(caseId),
      stepId: uiStepInfo?.id!,
    }).then(async ({ code }) => {
      if (code === 0) {
        callBackFunc();
      }
    });
  };
  const removeUIStep = async () => {
    const { code, msg } = await removePlayStep({
      caseId: parseInt(caseId),
      stepId: uiStepInfo?.id!,
    });
    if (code === 0) {
      message.success(msg);
      callBackFunc();
    }
  };

  const CardExtra = (
    <>
      <Space>
        {uiStepInfo?.condition ? <Tag color={'green'}>IF</Tag> : null}

        {uiStepInfo?.interface_id ? (
          <Tag color={'green'}>
            <Space>
              <ApiFilled />
              {uiStepInfo.interface_a_or_b === 1 ? '前' : '后'}
            </Space>
          </Tag>
        ) : null}
        {uiStepInfo?.db_id ? (
          <Tag color={'green'}>
            <Space>
              <ConsoleSqlOutlined />
              {uiStepInfo.db_a_or_b === 1 ? '前' : '后'}
            </Space>
          </Tag>
        ) : null}

        {uiStepInfo?.is_group ? (
          <Tag color={'green-inverse'}>组</Tag>
        ) : (
          <>
            {uiStepInfo?.is_common_step ? (
              <Tag color={'green-inverse'}>公</Tag>
            ) : (
              <Tag color={'blue-inverse'}>私</Tag>
            )}
          </>
        )}
        <Tooltip title={'复制步骤到底步、如果是公共复制、将复制成私有'}>
          <Button
            color={'primary'}
            variant="filled"
            disabled={uiStepInfo?.is_group}
            onClick={copyUIStep}
          >
            <CopyFilled />
            COPY
          </Button>
        </Tooltip>

        <Button
          icon={<EditOutlined />}
          color={'primary'}
          variant="filled"
          disabled={uiStepInfo?.is_group}
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
  const Title = (
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
        <Tag color={'green-inverse'} style={{ marginLeft: 4 }}>
          Step_{step}
        </Tag>
        <Tag color={'#108ee9'} style={{ marginLeft: 4 }}>
          {uiStepInfo?.name}
        </Tag>
      </Space>
    </div>
  );
  return (
    <>
      <MyDrawer
        name={'Step Detail'}
        width={'auto'}
        open={openStepDetailDrawer}
        setOpen={setOpenStepDetailDrawer}
      >
        <PlayStepDetail
          caseId={parseInt(caseId)}
          stepInfo={uiStepInfo}
          callBack={() => {
            setOpenStepDetailDrawer(false);
            callBackFunc();
          }}
          readOnly={uiStepInfo?.is_common_step}
        />
      </MyDrawer>
      <ProCard
        headStyle={{
          height: 80,
          padding: '0 16px',
        }}
        bodyStyle={{
          padding: 0,
        }}
        extra={CardExtra}
        hoverable
        defaultCollapsed={props.collapsible}
        collapsible
        collapsed={collapsible}
        headerBordered
        style={{ borderRadius: '5px', marginTop: 10 }}
        subTitle={
          <div onClick={(e) => e.stopPropagation()}>
            <Space>
              <Text type={'secondary'}>{uiStepInfo?.description}</Text>
            </Space>
          </div>
        }
        title={Title}
      >
        <ProCard headerBordered>
          {uiStepInfo?.is_group ? (
            <PlayGroupStepsTable
              groupName={uiStepInfo.name!}
              groupId={uiStepInfo.id!}
            />
          ) : (
            <StepFunc
              currentProjectId={currentProjectId!}
              subStepInfo={uiStepInfo!}
              envs={envs}
              callback={callBackFunc}
            />
          )}
        </ProCard>
      </ProCard>
    </>
  );
};
export default Index;
