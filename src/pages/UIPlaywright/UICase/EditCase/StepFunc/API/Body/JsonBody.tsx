import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { ProCard } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
interface SelfProps {
  apiForm: FormInstance<any>;
  read: boolean;
}
const JsonBody: FC<SelfProps> = ({ apiForm, read }) => {
  const [showError, setShowError] = useState(false);
  const timeoutRef = useRef<any>(null);
  const [bodyData, setBodyData] = useState<any>();
  useEffect(() => {
    if (apiForm.getFieldValue('body')) {
      setBodyData(JSON.stringify(apiForm.getFieldValue('body'), null, 2));
    }
  }, []);
  const handleOnChange = (newValue: any) => {
    // 取消之前的验证计时器
    clearTimeout(timeoutRef.current);
    setBodyData(newValue);
    // 设置新的计时器
    timeoutRef.current = setTimeout(() => {
      if (newValue) {
        try {
          apiForm.setFieldValue('body', JSON.parse(newValue));
          setShowError(false);
        } catch (error) {
          setShowError(true);
        }
      } else {
        apiForm.setFieldValue('body', null);
      }
    }, 1000); // 延迟1秒钟进行验证
  };
  return (
    <ProCard bodyStyle={{ padding: 10 }}>
      {showError && <p style={{ color: 'red' }}>JSON 格式错误，请检查。</p>}
      <AceCodeEditor
        readonly={read}
        value={bodyData}
        onChange={handleOnChange}
        height={'20vh'}
      />
    </ProCard>
  );
};

export default JsonBody;
