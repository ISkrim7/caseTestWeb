import { IModuleEnum } from '@/api';
import {
  copyCaseContentStep,
  removeCaseContentStep,
  updateCaseContent,
} from '@/api/inter/interCase';
import MyDrawer from '@/components/MyDrawer';
import InterfaceApiDetail from '@/pages/Httpx/Interface/InterfaceApiDetail';
import GroupInterfaceTable from '@/pages/Httpx/Interface/interfaceApiGroup/GroupInterfaceTable';
import ApiCondition from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/ApiCondition';
import ApiScriptContent from '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail/apiScriptContent';
import { IInterfaceCaseContent } from '@/pages/Httpx/types';
import { CONFIG } from '@/utils/config';
import {
  DownOutlined,
  EditOutlined,
  PlayCircleOutlined,
  RightOutlined,
  StopOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Copy, DeleteTwo, Info } from '@icon-park/react';
import {
  Input,
  InputNumber,
  message,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';

const { Text } = Typography;

const CaseContentType = {
  API: 1,
  GROUP: 2,
  CONDITION: 3,
  WAIT: 6,
  SCRIPT: 4,
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
  apiEnvs?: { label: string; value: number | null }[];
  apiModule?: IModuleEnum[];
}

const CaseContentCollapsible: FC<SelfProps> = (props) => {
  const { top, projectId, caseContent, caseId, callback } = props;
  const timeoutRef = useRef<any>(null);

  const { InterfaceCaseContentType } = CONFIG;

  const [showOption, setShowOption] = useState(false);
  const [showAPIDetail, setShowAPIDetail] = useState(false);

  const [conditionKey, setConditionKey] = useState<string>();
  const [conditionValue, setConditionValue] = useState<string>();
  const [conditionOperator, setConditionOperator] = useState<string>();

  const [showWaitInput, setShowWaitInput] = useState(true);
  const [waitTime, setWaitTime] = useState<number>();

  const [showScriptInput, setShowScriptInput] = useState(true);
  const [scriptTextName, setScriptTextName] = useState<string>();
  const [scriptText, setScriptText] = useState<string>();
  const [saveScript, setSaveScript] = useState(false);

  useEffect(() => {
    if (
      caseContent.content_type === CaseContentType.SCRIPT ||
      caseContent.api_script_text
    ) {
      setScriptTextName(caseContent.content_name);
      setScriptText(caseContent.api_script_text);
      setShowScriptInput(false);
    }
  }, []);
  useEffect(() => {
    if (
      caseContent.content_type === CaseContentType.WAIT ||
      caseContent.api_wait_time
    ) {
      setWaitTime(caseContent.api_wait_time);
      setShowWaitInput(false);
    }
  }, [caseContent]);

  useEffect(() => {
    if (conditionKey) setConditionKey(conditionKey);
    if (conditionOperator) setConditionOperator(conditionOperator);
    if (conditionValue) setConditionValue(conditionValue);
  }, [conditionKey, conditionValue, conditionOperator]);

  const handleScriptOnChange = (value: string) => {
    clearTimeout(timeoutRef.current);
    setScriptText(value);
    timeoutRef.current = setTimeout(async () => {
      updateCaseContent({ id: caseContent.id, api_script_text: value }).then(
        async ({ code }) => {
          if (code === 0) {
            setSaveScript(true);
            setTimeout(() => {
              setSaveScript(false);
            }, 2000);
          }
        },
      );
    }, 3000);
  };

  const updateWaitTime = async (value: number | undefined) => {
    if (value) {
      const { code, data } = await updateCaseContent({
        id: caseContent.id,
        api_wait_time: value,
      });
      if (code === 0) {
        if (data.api_wait_time) setWaitTime(data.api_wait_time);
        setShowWaitInput(false);
      }
    } else {
      setShowWaitInput(true);
    }
  };

  const updateScriptTitle = async (value: string | undefined) => {
    if (value) {
      const { code, data } = await updateCaseContent({
        id: caseContent.id,
        content_name: value,
      });
      if (code === 0) {
        if (data.content_name) setScriptTextName(data.content_name);
        setShowScriptInput(false);
      }
    } else {
      setShowScriptInput(true);
    }
  };

  const WaitInputArea = () => {
    if (waitTime && !showWaitInput) {
      return (
        <>
          <Text style={{ marginRight: 10 }}>{waitTime} s</Text>
          <EditOutlined onClick={() => setShowWaitInput(true)} />
        </>
      );
    } else {
      return (
        <InputNumber
          style={{ width: '100%' }}
          variant={'underlined'}
          value={waitTime}
          min={0}
          max={10}
          onChange={(value) => {
            if (value) setWaitTime(value);
          }}
          onBlur={async () => await updateWaitTime(waitTime)}
          onPressEnter={async () => await updateWaitTime(waitTime)}
          suffix={'s'}
        />
      );
    }
  };

  const scriptArea = () => {
    if (scriptTextName && !showScriptInput) {
      return (
        <>
          <Text>{scriptTextName}</Text>
          <EditOutlined onClick={() => setShowScriptInput(true)} />
        </>
      );
    } else {
      return (
        <Input
          style={{ width: '100%' }}
          variant={'underlined'}
          value={scriptTextName}
          onChange={(e) => {
            if (e.target.value) setScriptTextName(e.target.value);
          }}
          onBlur={async () => await updateScriptTitle(scriptTextName)}
          onPressEnter={async () => await updateScriptTitle(scriptTextName)}
        />
      );
    }
  };

  const switchContent = (
    <Tooltip title="关闭后此步骤将不运行、只在用例场景中生效">
      <Switch
        style={{ marginLeft: 10 }}
        checkedChildren={<PlayCircleOutlined />}
        unCheckedChildren={<StopOutlined />}
        value={caseContent.enable}
        onClick={async (checked, _) => {
          const { code, data } = await updateCaseContent({
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
      case CaseContentType.WAIT:
        return (
          <>
            <Tag color={'orange'}>WAIT</Tag>
            {WaitInputArea()}
          </>
        );
      case CaseContentType.SCRIPT:
        return (
          <>
            <Tag color={'orange'}>SCRIPT</Tag>
            {scriptArea()}
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
      case CaseContentType.SCRIPT:
        return (
          <ApiScriptContent
            isSave={saveScript}
            script_text={scriptText}
            onChange={handleScriptOnChange}
          />
        );
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
            <Tag color={'green-inverse'}>STEP_{props.step}</Tag>
            {caseContent.content_type === CaseContentType.CONDITION ||
            caseContent.content_type == CaseContentType.SCRIPT ||
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
          addFromCase={false}
          addFromGroup={false}
          refresh={() => {}}
          interfaceId={caseContent.target_id}
          callback={() => {}}
        />
        ;
      </MyDrawer>
    </>
  );
};

export default CaseContentCollapsible;
