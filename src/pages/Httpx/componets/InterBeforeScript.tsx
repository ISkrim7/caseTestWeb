import { tryInterScript, updateInterApiById } from '@/api/inter';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import MyDrawer from '@/components/MyDrawer';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import {
  Button,
  FormInstance,
  message,
  Popover,
  Space,
  Typography,
} from 'antd';
import { FC, useEffect, useState } from 'react';

const { Text, Title, Paragraph } = Typography;

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
}

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
        <AceCodeEditor
          value={scriptData}
          onChange={handleOnChange}
          height={'40vh'}
          _mode={'python'}
        />
      </ProCard>
    </>
  );
};

export default InterBeforeScript;
