import { updateInterApiById } from '@/api/inter';
import { copyApi2Case, removeApi2Case } from '@/api/inter/interCase';
import {
  copyInterfaceGroupApi,
  removeInterfaceGroupApis,
} from '@/api/inter/interGroup';
import InterfaceApiDetail from '@/pages/Httpx/Interface/InterfaceApiDetail';
import GroupInterfaceTable from '@/pages/Httpx/Interface/interfaceApiGroup/GroupInterfaceTable';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import {
  CopyFilled,
  DeleteOutlined,
  DownOutlined,
  PlayCircleOutlined,
  RightOutlined,
  StopOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import {
  Button,
  message,
  Popconfirm,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { FC, useEffect, useState } from 'react';

const { Text } = Typography;

interface SelfProps {
  projectId?: number;
  partId?: number;
  caseApiId?: string;
  groupId?: string;
  interfaceApiInfo?: IInterfaceAPI;
  refresh: () => void;
  collapsible?: boolean;
}

const CollapsibleApiCard: FC<SelfProps> = (props) => {
  const { interfaceApiInfo, groupId, caseApiId, refresh } = props;
  const [cardTitle, setCardTitle] = useState('');
  const [cardSubTitle, setSubCardTitle] = useState('');
  const [addFormCase, setAddFormCase] = useState(false);
  const [addFormGroup, setAddFormGroup] = useState(false);

  useEffect(() => {
    if (groupId) {
      setAddFormGroup(true);
      setAddFormCase(false);
    } else if (caseApiId) {
      setAddFormGroup(false);
      setAddFormCase(true);
    } else {
      setAddFormGroup(false);
      setAddFormCase(false);
    }
  }, [groupId, caseApiId]);
  useEffect(() => {
    if (interfaceApiInfo) {
      setCardTitle(interfaceApiInfo.name);
      setSubCardTitle(interfaceApiInfo.url);
    }
  }, [interfaceApiInfo]);

  //复制api 添加到底部
  const copyApi = async () => {
    const handleCopy = async (apiFunction: any, params: any) => {
      try {
        const { code } = await apiFunction(params);
        if (code === 0) {
          message.success('添加成功！');
          refresh();
        }
      } catch (error) {
        console.error('复制 API 失败:', error);
        message.error('复制 API 失败，请稍后再试。');
      }
    };

    if (caseApiId && interfaceApiInfo?.id) {
      await handleCopy(copyApi2Case, {
        caseId: caseApiId,
        apiId: interfaceApiInfo.id,
      });
    }

    if (groupId && interfaceApiInfo?.id) {
      await handleCopy(copyInterfaceGroupApi, {
        groupId: groupId,
        apiId: interfaceApiInfo.id,
      });
    }
  };

  //删除api 删除关联
  const removeApi = async () => {
    if (caseApiId && interfaceApiInfo) {
      await removeApi2Case({
        caseId: caseApiId!,
        apiId: interfaceApiInfo?.id,
      }).then(async ({ code }) => {
        if (code === 0) {
          props.refresh();
        }
      });
    }
    if (groupId && interfaceApiInfo) {
      const { code } = await removeInterfaceGroupApis({
        groupId: groupId,
        apiId: interfaceApiInfo?.id,
      });
      if (code === 0) {
        props.refresh();
      }
    }
  };

  const extraButton = (
    <div style={{ marginRight: 10 }}>
      {interfaceApiInfo && (
        <>
          <Space>
            {interfaceApiInfo.is_group ? (
              <Tag color={'green-inverse'}>组</Tag>
            ) : null}
            {interfaceApiInfo.is_common ? (
              <Tag color={'green-inverse'}>公</Tag>
            ) : null}
            {interfaceApiInfo.is_group ? null : (
              <Button color={'primary'} variant="filled" onClick={copyApi}>
                <CopyFilled />
                Copy
              </Button>
            )}

            <Popconfirm
              title={'确认删除？'}
              description={'非公共Api&Group会彻底删除'}
              okText={'确认'}
              cancelText={'点错了'}
              style={{ marginLeft: 10 }}
              onConfirm={removeApi}
            >
              <Button color={'primary'} variant={'filled'}>
                <DeleteOutlined />
                DEL
              </Button>
            </Popconfirm>
            <Tooltip title="关闭后此步骤将不运行、只在用例场景中生效">
              <Switch
                style={{ marginLeft: 10 }}
                checkedChildren={<PlayCircleOutlined />}
                unCheckedChildren={<StopOutlined />}
                value={interfaceApiInfo.enable}
                onClick={async (checked, _) => {
                  // @ts-ignore
                  const { code } = await updateInterApiById({
                    id: interfaceApiInfo?.id,
                    enable: checked,
                  });
                  if (code === 0) {
                    refresh();
                  }
                }}
              />
            </Tooltip>
          </Space>
        </>
      )}
    </div>
  );

  return (
    <ProCard
      collapsibleIconRender={({ collapsed }) => (
        <>
          <UnorderedListOutlined style={{ color: '#c3cad4', marginLeft: 10 }} />{' '}
          {collapsed ? <RightOutlined /> : <DownOutlined />}
        </>
      )}
      // boxShadow={true}
      hoverable
      title={
        <>
          <Tag color={'#108ee9'} style={{ marginLeft: 4 }}>
            {cardTitle}
          </Tag>
        </>
      }
      subTitle={<Text type={'secondary'}>{cardSubTitle}</Text>}
      style={{ borderRadius: '5px', marginTop: 10 }}
      collapsible={true}
      ghost={true}
      defaultCollapsed={props.collapsible}
      extra={extraButton}
    >
      {interfaceApiInfo?.is_group ? (
        <GroupInterfaceTable groupId={interfaceApiInfo?.group_id!} />
      ) : (
        <InterfaceApiDetail
          {...props}
          setTitle={setCardTitle}
          setSubCardTitle={setSubCardTitle}
          addFromCase={addFormCase}
          addFromGroup={addFormGroup}
        />
      )}
    </ProCard>
  );
};

export default CollapsibleApiCard;
