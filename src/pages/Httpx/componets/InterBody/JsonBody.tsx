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
  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // useEffect(() => {
  //   const initialBody = form.getFieldValue('body');
  //
  //   // 优化点1：增加类型安全校验
  //   if (initialBody && typeof initialBody === 'object') {
  //     try {
  //       const formatted = JSON.stringify(initialBody, null, 2);
  //       setBody(formatted);
  //       // 优化点2：主动同步格式化后的数据
  //       form.setFieldValue('body', formatted);
  //     } catch {
  //       setBody('{}');
  //     }
  //   } else if (typeof initialBody === 'string') {
  //     // 优化点3：处理字符串类型的初始值
  //     try {
  //       JSON.parse(initialBody);
  //       setBody(initialBody);
  //     } catch {
  //       setBody('{}');
  //     }
  //   }
  // }, []);
  // 初始化数据
  useEffect(() => {
    const initialBody = form.getFieldValue('body');

    if (initialBody) {
      try {
        // 统一处理：无论原始格式如何，都转换为格式化字符串
        const parsed =
          typeof initialBody === 'string'
            ? JSON.parse(initialBody)
            : initialBody;
        const formatted = JSON.stringify(parsed, null, 2);
        setBody(formatted);
      } catch {
        // 无效JSON时保留原始值
        setBody(
          typeof initialBody === 'string'
            ? initialBody
            : JSON.stringify(initialBody),
        );
      }
    } else {
      setBody('');
    }
  }, [form]);
  // 格式化处理核心逻辑
  const handleFormat = () => {
    try {
      const currentValue = form.getFieldValue('body');
      let data: any;

      if (typeof currentValue === 'string') {
        // 字符串类型尝试解析
        data = JSON.parse(currentValue);
      } else {
        // 直接使用对象类型
        data = currentValue;
      }

      // 格式化为美观的JSON字符串
      const formatted = JSON.stringify(data, null, 2);
      setBody(formatted);
      form.setFieldValue('body', data); // 存储解析后的对象
      setShowError(false);
    } catch (error) {
      setShowError(true);
    }
  };

  const handleOnChange = (newValue: string) => {
    //clearTimeout(timeoutRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setBody(newValue);

    // 优化点4：立即更新原始值到表单
    //form.setFieldValue('body', newValue);

    //   timeoutRef.current = setTimeout(() => {
    //     if (newValue) {
    //       try {
    //         // 优化点5：保留数据结构化存储
    //         const parsed = JSON.parse(newValue);
    //         form.setFieldValue('body', parsed);
    //         setShowError(false);
    //       } catch (error) {
    //         setShowError(true);
    //         // 优化点6：保留原始字符串用于错误恢复
    //         form.setFieldValue('body', newValue);
    //       }
    //     } else {
    //       form.setFieldValue('body', null);
    //     }
    //   }, 2000);
    //
    //   // 优化点7：添加清理副作用
    //   return () => clearTimeout(timeoutRef.current);
    // };
    // 设置新的延迟验证
    timeoutRef.current = setTimeout(() => {
      if (!newValue.trim()) {
        form.setFieldValue('body', null);
        setShowError(false);
        return;
      }

      try {
        const parsed = JSON.parse(newValue);
        form.setFieldValue('body', parsed);
        setShowError(false);
      } catch (error) {
        form.setFieldValue('body', newValue); // 原始字符串给后端
        setShowError(true);
      }
    }, 1000); // 缩短延迟至1秒
  };

  return (
    <ProCard
      bodyStyle={{ padding: 0 }}
      style={{ marginTop: 8 }}
      extra={
        // <a
        //   onClick={() =>
        //     handleOnChange(JSON.stringify(form.getFieldValue('body'), null, 2))
        //   }
        // >
        //   格式化
        // </a>
        <a onClick={handleFormat} style={{ cursor: 'pointer' }}>
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
