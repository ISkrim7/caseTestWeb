import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import { CodeOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { FC, useRef, useState } from 'react';

interface SelfProps {
  callBack: (resultArray: any) => void;
}
const SetKv2Query: FC<SelfProps> = ({ callBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kvData, setKVData] = useState<string>();
  const [showError, setShowError] = useState(false);
  const timeoutRef = useRef<any>(null);

  const inputParams = () => {
    setKVData('');
    setIsModalOpen(true);
  };

  const onModelFinish = () => {
    clearTimeout(timeoutRef.current);
    try {
      if (kvData) {
        const NewKVData = JSON.parse(kvData);
        const resultArray = Object.keys(NewKVData).map((key) => {
          return {
            key: key,
            value: NewKVData[key],
            id: Date.now(),
          };
        });
        // form.setFieldValue('params', resultArray);
        // setParamsEditableRowKeys(resultArray.map((item) => item.id) || []);
        //
        callBack(resultArray);
        setIsModalOpen(false);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  const handleOnChange = (value: any) => {
    clearTimeout(timeoutRef.current);
    setKVData(value);
    timeoutRef.current = setTimeout(() => {
      if (value) {
        try {
          setShowError(false);
        } catch (error) {
          setShowError(true);
        }
      }
    }, 1000); // 延迟1秒钟进行验证
  };
  return (
    <>
      <Modal
        title="导入参数"
        open={isModalOpen}
        onOk={onModelFinish}
        onCancel={() => {
          setIsModalOpen(false);
          setShowError(false);
        }}
      >
        <span style={{ color: 'gray' }}>
          快速导入到请求参数，支持 JSON/Key-value 格式
        </span>
        {showError && <p style={{ color: 'red' }}>JSON 格式错误，请检查。</p>}
        <AceCodeEditor onChange={handleOnChange} value={kvData} />
      </Modal>
      <span>
        <CodeOutlined style={{ color: 'gray' }} />
        <Button type={'link'} style={{ color: 'gray' }} onClick={inputParams}>
          导入参数
        </Button>
      </span>
    </>
  );
};

export default SetKv2Query;
