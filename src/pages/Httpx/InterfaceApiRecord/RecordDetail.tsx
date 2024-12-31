import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import InterBody from '@/pages/Httpx/componets/InterBody';
import InterHeader from '@/pages/Httpx/componets/InterHeader';
import InterParam from '@/pages/Httpx/componets/InterParam';
import { IInterfaceAPIRecord } from '@/pages/Httpx/types';
import { ProCard } from '@ant-design/pro-components';
import { Form, Tabs } from 'antd';
import { FC, useEffect } from 'react';

interface IRecordDetailProps {
  interfaceAPIRecordInfo: IInterfaceAPIRecord;
}

const RecordDetail: FC<IRecordDetailProps> = ({ interfaceAPIRecordInfo }) => {
  const [interApiForm] = Form.useForm();

  useEffect(() => {
    if (interfaceAPIRecordInfo) {
      interApiForm.setFieldsValue({
        url: interfaceAPIRecordInfo.url,
        method: interfaceAPIRecordInfo.method,
        headers: interfaceAPIRecordInfo.headers,
        params: interfaceAPIRecordInfo.params,
        body: interfaceAPIRecordInfo.body,
        data: interfaceAPIRecordInfo.data,
        bodyType: interfaceAPIRecordInfo.bodyType,
        response: interfaceAPIRecordInfo.response,
      });
    }
  }, [interfaceAPIRecordInfo]);
  return (
    <ProCard>
      <Tabs defaultActiveKey={'1'} type="card">
        <Tabs.TabPane key={'2'} tab={'Headers'}>
          <InterHeader form={interApiForm} />
        </Tabs.TabPane>
        <Tabs.TabPane key={'1'} tab={'Params'}>
          <InterParam form={interApiForm} mode={1} />
        </Tabs.TabPane>
        <Tabs.TabPane key={'3'} tab={'Body'}>
          <InterBody form={interApiForm} mode={1} />
        </Tabs.TabPane>
        <Tabs.TabPane key={'5'} tab={'Response'}>
          <AceCodeEditor
            value={interfaceAPIRecordInfo.response}
            height={'50vh'}
            readonly={true}
            _mode={'json'}
          />{' '}
        </Tabs.TabPane>
      </Tabs>
    </ProCard>
  );
};

export default RecordDetail;
