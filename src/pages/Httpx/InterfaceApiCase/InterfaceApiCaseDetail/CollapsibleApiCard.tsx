import { removeApi2Case } from '@/api/inter/interCase';
import InterfaceApiDetail from '@/pages/Httpx/Interface/InterfaceApiDetail';
import { IInterfaceAPI } from '@/pages/Interface/types';
import { ProCard } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  projectId?: number;
  partId?: number;
  caseApiId?: string;
  interfaceApiInfo?: IInterfaceAPI;
}

const CollapsibleApiCard: FC<SelfProps> = (props) => {
  const [cardTitle, setCardTitle] = useState('');
  const [cardSubTitle, setSubCardTitle] = useState('');

  const [editing, setEditing] = useState();
  useEffect(() => {
    if (props.interfaceApiInfo) {
      setCardTitle(props.interfaceApiInfo.name);
      setSubCardTitle(props.interfaceApiInfo.desc);
    }
  }, [props.interfaceApiInfo]);

  const deleteButton = (
    <Popconfirm
      title={'确认删除？'}
      description={'非公共Api会彻底删除'}
      okText={'确认'}
      cancelText={'点错了'}
      onConfirm={async () => {
        await removeApi2Case({
          caseId: props.caseApiId!,
          apiId: props.interfaceApiInfo?.id,
        });
      }}
    >
      {props.interfaceApiInfo && <a>del</a>}
    </Popconfirm>
  );

  return (
    <ProCard
      bordered
      boxShadow={true}
      title={`${cardTitle}`}
      subTitle={cardSubTitle}
      style={{ borderRadius: '5px', marginTop: 5 }}
      collapsible={true}
      defaultCollapsed={true}
      extra={deleteButton}
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
