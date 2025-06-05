import { tryInterScript, updateInterApiById } from '@/api/inter';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import MyDrawer from '@/components/MyDrawer';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import {
  Button,
  FormInstance,
  List,
  message,
  Popover,
  Space,
  Splitter,
  Typography,
} from 'antd';
import { FC, useEffect, useState } from 'react';

const { Text, Title, Paragraph } = Typography;

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
}

const demoScript = [
  {
    label: '设置一个变量',
    value: 'key = 1',
  },
  {
    label: '获取时间戳 （内置）',
    value:
      "ts = timestamp(); # 参数params ['+1s', '-1s', '+1m', '-1m', '+1h', '-1h']",
    desc: 'return 1748590765290',
  },
  {
    label: '获取日期 （内置）',
    value:
      "date_value = date() #参数: ['+1d', '-1d', '+1m', '-1m', '+1y', '-1y'] ",
    desc: 'return 2025-05-30 ',
  },
  {
    label: '打印',
    value: 'log("xx")',
    desc: '打印内容、只适用于业务日志',
  },
  {
    label: 'faker 生成随机数据',
    value: 'name = faker.pystr()',
    desc: 'return xxx',
  },
];
const InterBeforeScript: FC<SelfProps> = ({ form }) => {
  const [scriptData, setScriptData] = useState<any>();
  const [showButton, setShowButton] = useState(false);
  const [open, setOpen] = useState(false);
  const [tryData, setTryData] = useState<any>();
  useEffect(() => {
    const script = form.getFieldValue('before_script');
    if (script) {
      setShowButton(true);
      setScriptData(script);
    }
  }, []);
  const handleOnChange = (value: any) => {
    if (value) {
      setScriptData(value);
      setShowButton(true);
      form.setFieldsValue({ before_script: value });
    }
  };

  const Desc = (
    <ul>
      <li>
        <Text type={'secondary'}>
          like{' '}
          <Text type={'secondary'} code copyable>
            name = faker.name()
          </Text>
        </Text>
      </li>
      <li>
        <Text type={'secondary'}>
          所有{' '}
          <Text type={'secondary'} code>
            =
          </Text>
          前变量名 会被替换成变量
        </Text>
      </li>
      <li>
        <Text type={'secondary'}>非常规变量值将会被过滤</Text>
      </li>
    </ul>
  );

  const useDemoScript = (value: string) => {
    setScriptData((prev: string) => {
      if (prev === undefined) {
        return value;
      } else {
        return prev + '\n' + value;
      }
    });
    setShowButton(true);
    form.setFieldsValue({ before_script: scriptData });
  };
  return (
    <>
      <MyDrawer name={'script response'} open={open} setOpen={setOpen}>
        <AceCodeEditor value={tryData} height={'100vh'} _mode={'json'} />
      </MyDrawer>
      <ProCard
        title={
          <Title level={5}>
            <Popover content={Desc}>
              编写py脚本 设置变量{' '}
              <QuestionCircleOutlined style={{ marginLeft: 20 }} />
            </Popover>
          </Title>
        }
        headerBordered
        extra={
          <Space>
            {showButton && (
              <>
                <Button
                  disabled={false}
                  type={'primary'}
                  onClick={async () => {
                    const { code, data } = await tryInterScript(scriptData);
                    if (code === 0) {
                      setTryData(JSON.stringify(data, null, 2));
                      setOpen(true);
                    }
                  }}
                >
                  Try
                </Button>

                <Button
                  disabled={false}
                  type={'primary'}
                  onClick={async () => {
                    const InterfaceId = form.getFieldValue('id');
                    if (scriptData && InterfaceId) {
                      const { code, msg } = await updateInterApiById({
                        id: InterfaceId,
                        before_script: scriptData,
                      });
                      if (code === 0) {
                        message.success(msg);
                      }
                    }
                  }}
                >
                  Save
                </Button>
                <Button
                  disabled={false}
                  type={'primary'}
                  onClick={async () => {
                    const InterfaceId = form.getFieldValue('id');
                    form.setFieldValue('before_script', null);
                    setScriptData('');
                    if (scriptData && InterfaceId) {
                      const { code, msg } = await updateInterApiById({
                        id: InterfaceId,
                        before_script: null,
                      });
                      if (code === 0) {
                        message.success(msg);
                      }
                    }
                  }}
                >
                  Remove
                </Button>
              </>
            )}
          </Space>
        }
      >
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel
            collapsible={true}
            defaultSize="80%"
            min="80%"
            max="100%"
          >
            <ProCard style={{ height: '100%' }} bodyStyle={{ padding: 0 }}>
              <AceCodeEditor
                value={scriptData}
                onChange={handleOnChange}
                height={'60vh'}
                _mode={'python'}
              />
            </ProCard>
          </Splitter.Panel>
          <Splitter.Panel
            collapsible={true}
            defaultSize="20%"
            min="0%"
            max="20%"
          >
            <ProCard style={{ height: '100%' }}>
              <List
                itemLayout="horizontal"
                dataSource={demoScript}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <a onClick={() => useDemoScript(item.value)}>
                          {item.label}
                        </a>
                      }
                      description={item.desc || ''}
                    />
                  </List.Item>
                )}
              />
            </ProCard>
          </Splitter.Panel>
        </Splitter>
      </ProCard>
    </>
  );
};

export default InterBeforeScript;
