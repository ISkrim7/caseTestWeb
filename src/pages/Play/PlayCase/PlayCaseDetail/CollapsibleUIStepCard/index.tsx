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
  UnorderedListOutlined,
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
import React, { FC, useState } from 'react';

const { Text } = Typography;

interface ISelfProps {
  caseId: string;
  currentProjectId?: number;
  uiStepInfo?: IUICaseSteps;
  collapsible?: boolean;
  callBackFunc: () => void;
  envs?: any[];
  step: number;
  setDraggableDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Index: FC<ISelfProps> = ({
  caseId,
  uiStepInfo,
  callBackFunc,
  collapsible,
  currentProjectId,
  envs,
  step,
  setDraggableDisabled,
}) => {
  const [openStepDetailDrawer, setOpenStepDetailDrawer] = useState(false);
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
        extra={CardExtra}
        collapsibleIconRender={({ collapsed }) => {
          if (collapsed) {
            setDraggableDisabled(true);
            return (
              <Space>
                <UnorderedListOutlined
                  style={{ color: '#c3cad4', marginLeft: 10 }}
                />
                <RightOutlined />
                <Tag color={'green-inverse'} style={{ marginLeft: 4 }}>
                  Step_{step}
                </Tag>
              </Space>
            );
          } else {
            setDraggableDisabled(false);
            return (
              <Space>
                <UnorderedListOutlined
                  style={{ color: '#c3cad4', marginLeft: 10 }}
                />
                <DownOutlined />
                <Tag color={'green-inverse'} style={{ marginLeft: 4 }}>
                  Step_{step}
                </Tag>
              </Space>
            );
          }
        }}
        hoverable
        collapsible={true}
        ghost={true}
        style={{ borderRadius: '5px', marginTop: 10 }}
        defaultCollapsed={collapsible}
        subTitle={
          <Space>
            <Text type={'secondary'}>{uiStepInfo?.description}</Text>
          </Space>
        }
        title={
          <>
            <Tag color={'#108ee9'} style={{ marginLeft: 4 }}>
              {uiStepInfo?.name}
            </Tag>
          </>
        }
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
