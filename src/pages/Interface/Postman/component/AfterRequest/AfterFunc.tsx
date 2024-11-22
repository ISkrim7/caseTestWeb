import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import MyDrawer from '@/components/MyDrawer';
import TitleName from '@/components/TitleName';
import FuncMap from '@/pages/Interface/Postman/component/BeforeRequest/FuncMap';
import { ISteps } from '@/pages/Interface/types';
import { ProCard, ProForm } from '@ant-design/pro-components';
import 'ace-builds/src-noconflict/mode-python.js';
import 'ace-builds/src-noconflict/theme-twilight';
import { Button, FormInstance } from 'antd';
import { FC, useEffect, useState } from 'react';

interface ISelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
}

const AfterFunc: FC<ISelfProps> = ({ stepForm, stepInfo }) => {
  const [bodyData, setBodyData] = useState<any>();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (stepInfo) {
      const body = stepInfo.afterFunc;
      if (body) {
        setBodyData(body);
      } else {
        setBodyData(null);
      }
    }
  }, [stepInfo]);

  const handleOnChange = (value: any) => {
    if (value) {
      setBodyData(value);
      stepForm.setFieldsValue({ afterFunc: value });
    }
  };

  const funcMap = (
    <MyDrawer
      name={TitleName('内置方法')}
      width={'50%'}
      open={open}
      setOpen={setOpen}
    >
      <FuncMap />
    </MyDrawer>
  );

  return (
    <>
      {funcMap}
      <ProCard
        extra={
          <Button type={'primary'} onClick={() => setOpen(true)}>
            内置方法
          </Button>
        }
      >
        <ProForm form={stepForm} submitter={false}>
          <ProForm.Item name={'afterFunc'} trigger={'onChange'}>
            <AceCodeEditor
              value={bodyData}
              onChange={handleOnChange}
              height={'50vh'}
              _mode={'python'}
            />
          </ProForm.Item>
        </ProForm>
      </ProCard>
    </>
  );
};

export default AfterFunc;
