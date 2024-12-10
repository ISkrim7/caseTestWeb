import { updateInterApiById } from '@/api/inter';
import { copyApi2Case, removeApi2Case } from '@/api/inter/interCase';
import InterfaceApiDetail from '@/pages/Httpx/Interface/InterfaceApiDetail';
import { IInterfaceAPI } from '@/pages/Interface/types';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Switch, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  projectId?: number;
  partId?: number;
  caseApiId?: string;
  interfaceApiInfo?: IInterfaceAPI;
  refresh: () => void;
  collapsible?: boolean;
}

const CollapsibleApiCard: FC<SelfProps> = (props) => {
  const { interfaceApiInfo, caseApiId, refresh } = props;
  const [cardTitle, setCardTitle] = useState('');
  const [cardSubTitle, setSubCardTitle] = useState('');
  useEffect(() => {
    if (interfaceApiInfo) {
      setCardTitle(interfaceApiInfo.name);
      setSubCardTitle(interfaceApiInfo.desc);
    }
  }, [interfaceApiInfo]);

  const copyApi = async () => {
    if (caseApiId && interfaceApiInfo) {
      const { code } = await copyApi2Case({
        caseId: caseApiId,
        apiId: interfaceApiInfo?.id,
      });
      if (code === 0) {
        message.success('添加成功！');
        refresh();
      }
    }
  };

  const extraButton = (
    <>
      {interfaceApiInfo && (
        <>
          {interfaceApiInfo.is_common ? (
            <Tag color={'green-inverse'}>公</Tag>
          ) : null}
          <Button type={'link'} onClick={copyApi}>
            Copy To Bottom
          </Button>
          <Popconfirm
            title={'确认删除？'}
            description={'非公共Api会彻底删除'}
            okText={'确认'}
            cancelText={'点错了'}
            style={{ marginLeft: 10 }}
            onConfirm={async () => {
              await removeApi2Case({
                caseId: caseApiId!,
                apiId: interfaceApiInfo?.id,
              }).then(async ({ code }) => {
                if (code === 0) {
                  props.refresh();
                }
              });
            }}
          >
            <Button type={'link'}>Del</Button>
          </Popconfirm>
          <Switch
            style={{ marginLeft: 10 }}
            checkedChildren={<CheckCircleTwoTone />}
            unCheckedChildren={<CloseCircleTwoTone />}
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
        </>
      )}
    </>
  );

  return (
    <ProCard
      bordered
      boxShadow={true}
      title={
        <>
          {' '}
          <Tag color={'blue'}>{cardTitle}</Tag>
        </>
      }
      subTitle={cardSubTitle}
      style={{ borderRadius: '5px', marginTop: 10 }}
      collapsible={true}
      defaultCollapsed={props.collapsible}
      extra={extraButton}
    >
      <InterfaceApiDetail
        {...props}
        setTitle={setCardTitle}
        setSubCardTitle={setSubCardTitle}
        addFromCase={true}
      />
    </ProCard>
  );
};

export default CollapsibleApiCard;
