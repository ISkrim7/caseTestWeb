import { InterfaceResponse } from '@/pages/Interface/types';
import { ProDescriptions } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  responseInfo: InterfaceResponse;
}

const InterfaceResultBaseInfo: FC<SelfProps> = ({ responseInfo }) => {
  const [respBaseInfo, setRespBaseInfo] =
    useState<InterfaceResponse>(responseInfo);
  useEffect(() => {
    if (responseInfo) {
      setRespBaseInfo(respBaseInfo);
    }
  }, [responseInfo]);

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
        {respBaseInfo?.interfaceName + `【${respBaseInfo.interfaceUid}】`}
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
        {respBaseInfo?.uid}
      </ProDescriptions.Item>
      <ProDescriptions.Item span={2} valueType="textarea" label={'用例描述'}>
        {respBaseInfo?.interfaceDesc}
      </ProDescriptions.Item>

      <ProDescriptions.Item valueType="text" span={2} label={'执行人'}>
        {respBaseInfo?.starterName}
      </ProDescriptions.Item>
      <ProDescriptions.Item valueType="time" label={'用例创建时间'}>
        {respBaseInfo?.create_time}
      </ProDescriptions.Item>
      <ProDescriptions.Item valueType="time" label={'用例更新时间'}>
        {respBaseInfo?.update_time}
      </ProDescriptions.Item>
      <ProDescriptions.Item valueType="text" label={'执行时间'}>
        {respBaseInfo?.startTime}
      </ProDescriptions.Item>
      <ProDescriptions.Item valueType="text" label={'总用时'}>
        {respBaseInfo?.useTime}
      </ProDescriptions.Item>
      <ProDescriptions.Item label={'总步长'}>
        {respBaseInfo?.interfaceSteps}
      </ProDescriptions.Item>
      <ProDescriptions.Item label={'错误步骤'}>
        <Tag color={'red'}>{respBaseInfo?.interfaceErrorStep || ''}</Tag>
      </ProDescriptions.Item>
      <ProDescriptions.Item label="测试结果" span={2}>
        <Tag color={respBaseInfo?.status === 'SUCCESS' ? 'green' : 'red'}>
          {respBaseInfo?.status}
        </Tag>
      </ProDescriptions.Item>
    </ProDescriptions>
  );
};

export default InterfaceResultBaseInfo;
