import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { IInterfaceAPI } from '@/pages/Interface/types';
import { ProCard } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';

interface SelfProps {
  form: FormInstance<IInterfaceAPI>;
  mode: number;
}

const JsonBody: FC<SelfProps> = ({ form, mode }) => {
  const [body, setBody] = useState<any>();
  const timeoutRef = useRef<any>(null);
  const [showError, setShowError] = useState(false);
  const [readonly, setReadonly] = useState(false);

  useEffect(() => {
    console.log(mode);
    if (mode) {
      if (mode === 1) {
        setReadonly(true);
      } else {
        setReadonly(false);
      }
    }
  }, [mode]);
  useEffect(() => {
    const body = form.getFieldValue('body');
    if (body) {
      setBody(JSON.stringify(body, null, 2));
    }
  }, []);
  const handleOnChange = (newValue: any) => {
    // 取消之前的验证计时器
    console.log('handleOnChange', newValue);
    clearTimeout(timeoutRef.current);
    setBody(newValue);
    // 设置新的计时器
    timeoutRef.current = setTimeout(() => {
      if (newValue) {
        try {
          form.setFieldValue('body', JSON.parse(newValue));
          setShowError(false);
        } catch (error) {
          setShowError(true);
        }
      } else {
        form.setFieldValue('body', null);
      }
    }, 1000); // 延迟1秒钟进行验证
  };
  return (
    <ProCard bodyStyle={{ padding: 0 }} style={{ marginTop: 8 }}>
      {showError && <p style={{ color: 'red' }}>JSON 格式错误，请检查。</p>}
      <AceCodeEditor
        value={body}
        onChange={handleOnChange}
        height={'50vh'}
        readonly={readonly}
        _mode={'python'}
      />
    </ProCard>
  );
};

export default JsonBody;
