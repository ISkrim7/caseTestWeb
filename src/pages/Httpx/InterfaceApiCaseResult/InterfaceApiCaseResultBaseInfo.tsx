import { IInterfaceCaseResult } from '@/pages/Interface/types';
import { ProDescriptions } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC } from 'react';

interface SelfProps {
  resultBaseInfo?: IInterfaceCaseResult;
}

const InterfaceApiCaseResultBaseInfo: FC<SelfProps> = ({ resultBaseInfo }) => {
  return (
    <ProDescriptions column={2} bordered style={{ marginTop: 10 }}>
      <ProDescriptions.Item
        span={2}
        label={'用例名称'}
        valueType="text"
        contentStyle={{
          maxWidth: '80%',
        }}
      >
        {resultBaseInfo?.interfaceCaseName +
          `【${resultBaseInfo?.interfaceCaseUid}】`}
      </ProDescriptions.Item>
      <ProDescriptions.Item
        span={2}
        label={'结果ID'}
        valueType="text"
        contentStyle={{
          maxWidth: '80%',
        }}
        ellipsis
      >
        {resultBaseInfo?.uid}
      </ProDescriptions.Item>
      <ProDescriptions.Item span={2} valueType="textarea" label={'用例描述'}>
        {resultBaseInfo?.interfaceCaseDesc}
      </ProDescriptions.Item>

      <ProDescriptions.Item valueType="text" span={2} label={'执行人'}>
        {resultBaseInfo?.starterName}
      </ProDescriptions.Item>
      <ProDescriptions.Item valueType="time" label={'用例创建时间'}>
        {resultBaseInfo?.create_time}
      </ProDescriptions.Item>
      <ProDescriptions.Item valueType="time" label={'用例更新时间'}>
        {resultBaseInfo?.update_time}
      </ProDescriptions.Item>
      <ProDescriptions.Item valueType="text" label={'执行时间'}>
        {resultBaseInfo?.startTime}
      </ProDescriptions.Item>
      <ProDescriptions.Item valueType="text" label={'总用时'}>
        {resultBaseInfo?.useTime}
      </ProDescriptions.Item>
      <ProDescriptions.Item label={'总步长'}>
        {resultBaseInfo?.total_num}
      </ProDescriptions.Item>
      {/*<ProDescriptions.Item label={'错误步骤'}>*/}
      {/*  <Tag color={'red'}>{resultBaseInfo?.interfaceErrorStep || ''}</Tag>*/}
      {/*</ProDescriptions.Item>*/}
      <ProDescriptions.Item label="测试结果" span={2}>
        <Tag color={resultBaseInfo?.result === 'SUCCESS' ? 'green' : 'red'}>
          {resultBaseInfo?.result}
        </Tag>
      </ProDescriptions.Item>
    </ProDescriptions>
  );
};

export default InterfaceApiCaseResultBaseInfo;
