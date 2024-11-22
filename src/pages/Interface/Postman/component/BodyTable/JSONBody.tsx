import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { ISteps } from '@/pages/Interface/types';
import { ProCard } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';

interface SelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
  step: number;
}

const JsonBody: FC<SelfProps> = (props) => {
  const { stepForm, stepInfo } = props;
  const timeoutRef = useRef<any>(null);
  const [bodyData, setBodyData] = useState<any>();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (stepInfo) {
      const body = stepInfo.body;
      const t = stepInfo.bodyType;
      if (t === 1 && body) {
        setBodyData(JSON.stringify(body, null, 2));
      }
    }
  }, [stepInfo]);

  const handleOnChange = (newValue: any) => {
    // 取消之前的验证计时器
    console.log('handleOnChange', newValue);
    clearTimeout(timeoutRef.current);
    setBodyData(newValue);
    // 设置新的计时器
    timeoutRef.current = setTimeout(() => {
      if (newValue) {
        try {
          stepForm.setFieldValue('body', JSON.parse(newValue));
          setShowError(false);
        } catch (error) {
          setShowError(true);
        }
      } else {
        stepForm.setFieldValue('body', null);
      }
    }, 1000); // 延迟1秒钟进行验证
  };
  return (
    <ProCard bodyStyle={{ padding: 10 }}>
      {showError && <p style={{ color: 'red' }}>JSON 格式错误，请检查。</p>}
      <AceCodeEditor
        value={bodyData}
        onChange={handleOnChange}
        height={'70vh'}
      />
    </ProCard>
  );
};

export default JsonBody;
