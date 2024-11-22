import React, { FC, useEffect, useState } from 'react';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { IPerfInspection } from '@/pages/Report/History/PerfInsp/PerfResultAPI';
import { Badge } from 'antd';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';

interface SelfProps {
  perfInspection?: IPerfInspection;
}

const BaseInfo: FC<SelfProps> = (props) => {
  const [perfInspection, setPerfInspection] = useState<IPerfInspection>();

  useEffect(() => {
    if (props.perfInspection) {
      setPerfInspection(props.perfInspection);
    }
  }, [props.perfInspection]);

  console.log('BASE', perfInspection);
  return (
    <ProCard style={{ height: '100vh' }}>
      <ProDescriptions column={2} bordered size={'default'}>
        <ProDescriptions.Item label={'标题'} valueType={'text'}>
          {perfInspection?.title}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'巡检结果'} valueType={'text'}>
          <Badge
            status={perfInspection?.result ? 'success' : 'error'}
            text={perfInspection?.result ? 'SUCCESS' : 'FAIL'}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'巡检城市'} valueType={'text'}>
          {perfInspection?.resultInfo.map((item) => item.city).join(';')}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'运行时间'} valueType={'dateTime'}>
          {perfInspection?.beginTime}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'用时'} valueType={'time'}>
          {perfInspection?.useTime}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'运行人'} valueType={'text'}>
          {perfInspection?.runner === 'robot' ? (
            <RobotOutlined />
          ) : (
            <UserOutlined />
          )}
          {perfInspection?.runner}
        </ProDescriptions.Item>
      </ProDescriptions>
    </ProCard>
  );
};

export default BaseInfo;
