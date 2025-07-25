import { removePlayStep } from '@/api/play/playCase';
import MyDrawer from '@/components/MyDrawer';
import { IUICaseSteps } from '@/pages/Play/componets/uiTypes';
import PlayStepDetail from '@/pages/Play/PlayStep/PlayStepDetail';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import { FC, useState } from 'react';

const { Text } = Typography;

interface Props {
  step: number;
  conditionStepInfo: IUICaseSteps;
  callback: () => void;
}

const CollapsibleConditionStepsCard: FC<Props> = (props) => {
  const { conditionStepInfo, step, callback } = props;
  const [openStepDrawer, setOpenStepDrawer] = useState(false);

  const removeUIStep = async () => {
    const { code, msg } = await removePlayStep({
      stepId: conditionStepInfo?.id!,
    });
    if (code === 0) {
      message.success(msg);
      callback();
    }
  };
  return (
    <ProCard
      bordered
      collapsed={true}
      title={
        <Space>
          <Tag color={'green-inverse'} style={{ marginLeft: 4 }}>
            Step_{step}
          </Tag>
          <Tag color={'green'}>{conditionStepInfo.name}</Tag>
        </Space>
      }
      subTitle={<Text type={'secondary'}>{conditionStepInfo.description}</Text>}
      extra={
        <Space>
          <Button
            icon={<EditOutlined />}
            color={'primary'}
            variant="filled"
            onClick={() => setOpenStepDrawer(true)}
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
          </Popconfirm>{' '}
        </Space>
      }
    >
      <MyDrawer
        name={'step'}
        width={'auto'}
        open={openStepDrawer}
        setOpen={setOpenStepDrawer}
      >
        <PlayStepDetail stepInfo={conditionStepInfo} callBack={callback} />
      </MyDrawer>
    </ProCard>
  );
};

export default CollapsibleConditionStepsCard;
