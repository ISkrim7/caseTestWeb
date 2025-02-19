import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import { ProCard } from '@ant-design/pro-components';
import { FormInstance, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';

const { Text, Title } = Typography;

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const InterBeforeScript: FC<SelfProps> = ({ form, mode }) => {
  const [scriptData, setScriptData] = useState<any>();
  const [readonly, setReadonly] = useState(false);
  useEffect(() => {
    if (mode) {
      if (mode === 1) {
        setReadonly(true);
      } else {
        setReadonly(false);
      }
    }
  }, [mode]);
  useEffect(() => {
    const script = form.getFieldValue('before_script');
    if (script) {
      setScriptData(script);
    }
  }, []);
  const handleOnChange = (value: any) => {
    if (value) {
      setScriptData(value);
      form.setFieldsValue({ before_script: value });
    }
  };
  return (
    <ProCard
      title={<Title level={5}>编写py脚本 设置变量</Title>}
      subTitle={
        <Text style={{ marginLeft: 30 }} type={'secondary'}>
          like{' '}
          <Text type={'secondary'} code>
            name = faker.name()
          </Text>
        </Text>
      }
      headerBordered
    >
      <AceCodeEditor
        value={scriptData}
        onChange={handleOnChange}
        height={'40vh'}
        readonly={readonly}
        _mode={'python'}
      />
    </ProCard>
  );
};

export default InterBeforeScript;
