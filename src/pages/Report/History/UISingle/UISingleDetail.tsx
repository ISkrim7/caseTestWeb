import { UIMultipleDetailReport } from '@/pages/Report/uiReport';
import { IUIResult } from '@/pages/UIPlaywright/uiTypes';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Badge, Image } from 'antd';
import { FC } from 'react';

const ProDescriptionsItem = ProDescriptions.Item;

interface ISelfProps {
  resultDetail?: IUIResult | UIMultipleDetailReport;
}

const UiSingleDetail: FC<ISelfProps> = ({ resultDetail }) => {
  return (
    <ProCard bodyStyle={{ height: 'auto', padding: '10px' }}>
      <ProDescriptions size={'small'} column={3} bordered={true}>
        <ProDescriptionsItem span={3} valueType="text" label="测试标题">
          {resultDetail?.ui_case_name}
        </ProDescriptionsItem>
        <ProDescriptionsItem span={3} valueType="textarea" label="测试描述">
          {resultDetail?.ui_case_desc}
        </ProDescriptionsItem>
        <ProDescriptionsItem span={1} valueType="text" label="开始时间">
          {resultDetail?.startTime}
        </ProDescriptionsItem>
        <ProDescriptionsItem span={1} valueType="text" label="用时">
          {resultDetail?.useTime}
        </ProDescriptionsItem>
        <ProDescriptionsItem span={1} valueType="text" label="结束时间">
          {resultDetail?.endTime}
        </ProDescriptionsItem>
        <ProDescriptionsItem span={1} valueType="text" ellipsis label="执行人">
          {resultDetail?.starterName}
        </ProDescriptionsItem>
        <ProDescriptionsItem span={1} valueType="text" label="用例步长">
          {resultDetail?.ui_case_step_num}
        </ProDescriptionsItem>
        <ProDescriptionsItem span={2} valueType="text" label="测试结果">
          <Badge
            status={resultDetail?.result === 'SUCCESS' ? 'success' : 'error'}
            text={resultDetail?.result}
          />
        </ProDescriptionsItem>

        {resultDetail?.result === 'FAIL' ? (
          <>
            <ProDescriptionsItem span={1} valueType="text" label="错误步骤">
              {resultDetail?.ui_case_err_step}
            </ProDescriptionsItem>
            <ProDescriptionsItem span={2} valueType="text" label="错误步骤标题">
              {resultDetail?.ui_case_err_step_title}
            </ProDescriptionsItem>
            <ProDescriptionsItem
              span={3}
              valueType="code"
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              ellipsis={false}
              label="错误步骤原因"
            >
              {resultDetail.ui_case_err_step_msg}
            </ProDescriptionsItem>
            <ProDescriptionsItem span={3} label="错误步骤截图">
              <Image
                width={200}
                src={resultDetail?.ui_case_err_step_pic_path || undefined}
              />
            </ProDescriptionsItem>
          </>
        ) : null}
      </ProDescriptions>
    </ProCard>
  );
};

export default UiSingleDetail;
