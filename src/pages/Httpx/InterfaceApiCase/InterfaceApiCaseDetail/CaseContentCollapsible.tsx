import {
  copyCaseContentStep,
  removeCaseContentStep,
  switchCaseContent,
} from '@/api/inter/interCase';
import MyDrawer from '@/components/MyDrawer';
import InterfaceApiDetail from '@/pages/Httpx/Interface/InterfaceApiDetail';
import GroupInterfaceTable from '@/pages/Httpx/Interface/interfaceApiGroup/GroupInterfaceTable';
import ApiCondition from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/ApiCondition';
import { IInterfaceCaseContent } from '@/pages/Httpx/types';
import { CONFIG } from '@/utils/config';
import {
  DownOutlined,
  PlayCircleOutlined,
  RightOutlined,
  StopOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Copy, DeleteTwo, Info } from '@icon-park/react';
import { message, Space, Switch, Tag, Tooltip, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';

const { Text } = Typography;

const CaseContentType = {
  API: 1,
  GROUP: 2,
  CONDITION: 3,
};

interface SelfProps {
  top?: any;
  step: number;
  moduleId?: number;
  projectId?: number;
  caseContent: IInterfaceCaseContent;
  caseId: number;
  collapsible: boolean;
  callback?: () => void;
}

const CaseContentCollapsible: FC<SelfProps> = (props) => {
  const { top, projectId, caseContent, caseId, callback } = props;

  const { InterfaceCaseContentType } = CONFIG;

  const [showOption, setShowOption] = useState(false);
  const [showAPIDetail, setShowAPIDetail] = useState(false);

  const [conditionKey, setConditionKey] = useState('{{变量名}}');
  const [conditionValue, setConditionValue] = useState('{{变量名}}');
  const [conditionOperator, setConditionOperator] = useState('等于');

  useEffect(() => {
    if (!conditionKey || !conditionValue || !conditionOperator) {
      setConditionKey('{{变量名}}');
      setConditionValue('{{变量名}}');
      setConditionOperator('等于');
    }
  }, [conditionKey, conditionValue, conditionOperator]);

  const switchContent = (
    <Tooltip title="关闭后此步骤将不运行、只在用例场景中生效">
      <Switch
        style={{ marginLeft: 10 }}
        checkedChildren={<PlayCircleOutlined />}
        unCheckedChildren={<StopOutlined />}
        value={caseContent.enable}
        onClick={async (checked, _) => {
          const { code, data } = await switchCaseContent({
            id: caseContent.id,
            enable: checked,
          });
          if (code === 0) {
            callback?.();
          }
        }}
      />
    </Tooltip>
  );
  const copyContentStep = async () => {
    const { code, msg } = await copyCaseContentStep({
      case_id: caseId,
      content_id: caseContent.id,
    });
    if (code === 0) {
      message.success(msg);
      callback && callback();
    }
  };

  const removeContentStep = async () => {
    const { code, msg } = await removeCaseContentStep({
      case_id: caseId,
      content_step_id: caseContent.id,
    });
    if (code === 0) {
      message.success(msg);
      callback && callback();
    }
  };
  const contentRender = () => {
    switch (caseContent.content_type) {
      case CaseContentType.API:
        return (
          <>
            <Tag
              color={InterfaceCaseContentType[caseContent.content_type].color}
            >
              {InterfaceCaseContentType[caseContent.content_type].text}
            </Tag>
            <Tag
              color={InterfaceCaseContentType[caseContent.content_type].color}
            >
              {caseContent.content_desc}
            </Tag>
            <Text strong>{caseContent.content_name}</Text>
          </>
        );
      case CaseContentType.GROUP:
        return (
          <>
            <Tag
              color={InterfaceCaseContentType[caseContent.content_type].color}
            >
              {InterfaceCaseContentType[caseContent.content_type].text}
            </Tag>
            <Text strong>{caseContent.content_name}</Text>
          </>
        );
      case CaseContentType.CONDITION:
        return (
          <>
            <Tag
              color={InterfaceCaseContentType[caseContent.content_type].color}
            >
              {InterfaceCaseContentType[caseContent.content_type].text}
            </Tag>
            <Text type={'warning'}> {conditionKey}</Text>
            <Text strong> {conditionOperator}</Text>
            <Text type={'warning'}> {conditionValue}</Text>
          </>
        );
    }
  };

  const cardBodyRender = () => {
    switch (caseContent.content_type) {
      case CaseContentType.CONDITION:
        return (
          <ApiCondition
            case_id={caseId}
            projectId={projectId}
            caseContent={caseContent}
            setKey={setConditionKey}
            setValue={setConditionValue}
            setOperator={setConditionOperator}
          />
        );
      case CaseContentType.GROUP:
        return <GroupInterfaceTable groupId={caseContent.target_id} />;
    }
  };
  return (
    <>
      <ProCard
        bordered
        collapsible
        defaultCollapsed
        collapsibleIconRender={({ collapsed }) => (
          <Space>
            <UnorderedListOutlined
              style={{ color: '#c3cad4', marginRight: 20 }}
            />
            <Tag color={'green-inverse'}>Step_{props.step}</Tag>
            {caseContent.content_type === CaseContentType.CONDITION ||
            caseContent.content_type === CaseContentType.GROUP ? (
              <>{collapsed ? <RightOutlined /> : <DownOutlined />}</>
            ) : null}
            {contentRender()}
          </Space>
        )}
        hoverable
        ref={top}
        onMouseEnter={() => {
          setShowOption(true);
        }}
        onMouseLeave={() => {
          setShowOption(false);
        }}
        onClick={(event) => {
          console.log('on click');
          if (caseContent.content_type === CaseContentType.API) {
            setShowAPIDetail(true);
            return;
          }
        }}
        extra={
          <>
            <Space hidden={!showOption}>
              {caseContent.content_type === CaseContentType.GROUP && (
                <Info
                  onClick={() =>
                    window.open(
                      `/interface/group/detail/groupId=${caseContent.target_id}`,
                    )
                  }
                  theme="multi-color"
                  size="18"
                  fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                  strokeLinejoin="bevel"
                  strokeLinecap="square"
                />
              )}
              <Copy
                onClick={copyContentStep}
                theme="multi-color"
                size="18"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
              <DeleteTwo
                onClick={removeContentStep}
                theme="multi-color"
                size="18"
                fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                strokeLinejoin="bevel"
                strokeLinecap="square"
              />
            </Space>
            {switchContent}
          </>
        }
      >
        {cardBodyRender()}
      </ProCard>

      <MyDrawer
        width={'75%'}
        name={''}
        open={showAPIDetail}
        setOpen={setShowAPIDetail}
      >
        <InterfaceApiDetail
          interfaceId={caseContent.target_id}
          callback={() => {}}
        />
        ;
      </MyDrawer>
    </>
  );
};

export default CaseContentCollapsible;
