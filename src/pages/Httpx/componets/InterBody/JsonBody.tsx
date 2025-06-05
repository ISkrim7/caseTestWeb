import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { IInterfaceAPI } from '@/pages/Httpx/types';
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

  // useEffect(() => {
  //   console.log(mode);
  //   if (mode) {
  //     if (mode === 1) {
  //       setReadonly(true);
  //     } else {
  //       setReadonly(false);
  //     }
  //   }
  // }, [mode]);
  /***
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
    }, 2000); // 延迟1秒钟进行验证
  };
    ***/
  useEffect(() => {
    const initialBody = form.getFieldValue('body');

    // 优化点1：增加类型安全校验
    if (initialBody && typeof initialBody === 'object') {
      try {
        const formatted = JSON.stringify(initialBody, null, 2);
        setBody(formatted);
        // 优化点2：主动同步格式化后的数据
        form.setFieldValue('body', formatted);
      } catch {
        setBody('{}');
      }
    } else if (typeof initialBody === 'string') {
      // 优化点3：处理字符串类型的初始值
      try {
        JSON.parse(initialBody);
        setBody(initialBody);
      } catch {
        setBody('{}');
      }
    }
  }, []);

  const handleOnChange = (newValue: string) => {
    clearTimeout(timeoutRef.current);
    setBody(newValue);

    // 优化点4：立即更新原始值到表单
    form.setFieldValue('body', newValue);

    timeoutRef.current = setTimeout(() => {
      if (newValue) {
        try {
          // 优化点5：保留数据结构化存储
          const parsed = JSON.parse(newValue);
          form.setFieldValue('body', parsed);
          setShowError(false);
        } catch (error) {
          setShowError(true);
          // 优化点6：保留原始字符串用于错误恢复
          form.setFieldValue('body', newValue);
        }
      } else {
        form.setFieldValue('body', null);
      }
    }, 2000);

    // 优化点7：添加清理副作用
    return () => clearTimeout(timeoutRef.current);
  };

  return (
    <ProCard
      bodyStyle={{ padding: 0 }}
      style={{ marginTop: 8 }}
      extra={
        <a
          onClick={() =>
            handleOnChange(JSON.stringify(form.getFieldValue('body'), null, 2))
          }
        >
          格式化
        </a>
      }
    >
      {showError && <p style={{ color: 'red' }}>JSON 格式错误，请检查。</p>}
      <AceCodeEditor
        value={body}
        onChange={handleOnChange}
        height={'50vh'}
        readonly={readonly}
        _mode={'json'}
      />
    </ProCard>
  );
};

export default JsonBody;
