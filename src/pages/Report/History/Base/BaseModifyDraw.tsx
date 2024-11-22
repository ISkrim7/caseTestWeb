import { modifyDetailInfo } from '@/api/cbsAPI/modifyAPI';
import AceCodeEditor from '@/components/CodeEditor/AceCodeEditor';
import MyDrawer from '@/components/MyDrawer';
import TitleName from '@/components/TitleName';
import { IModifyInfo } from '@/pages/Report/History/Base/IBaseModify';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Badge } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  open: boolean;
  setOpen: any;
  currentResultUid: string;
}

const BaseModifyDraw: FC<SelfProps> = (props) => {
  const { open, setOpen, currentResultUid } = props;
  const [currentModify, setCurrentModify] = useState<IModifyInfo>();

  const fetchModifyDetail = async (uid: string) => {
    const { code, data } = await modifyDetailInfo({ uid: uid });
    if (code === 0) {
      return data;
    }
  };

  useEffect(() => {
    if (currentResultUid) {
      fetchModifyDetail(currentResultUid).then((data) => {
        setCurrentModify(data);
      });
    }
  }, [currentResultUid]);

  return (
    <MyDrawer
      name={TitleName('测试详情')}
      open={open}
      setOpen={setOpen}
      width={'60%'}
    >
      <ProDescriptions column={3} title={'基本详情'}>
        <ProDescriptions.Item
          label={'标题'}
          labelStyle={{ width: '10%' }}
          valueType={'text'}
        >
          {currentModify?.title}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'巡检城市'} valueType={'text'}>
          {currentModify?.city}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          label={'测试结果'}
          labelStyle={{ width: '10%' }}
          valueType={'text'}
        >
          {currentModify?.status}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'开始时间'} valueType={'dateTime'}>
          {currentModify?.beginTime}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'结束时间'} valueType={'dateTime'}>
          {currentModify?.endTime}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'用时'} valueType={'time'}>
          {currentModify?.useTime}
        </ProDescriptions.Item>

        <ProDescriptions.Item label={'异动信息验证'} valueType={'text'}>
          <Badge
            status={
              currentModify?.resultInfo.infoVerify === 'PASS'
                ? 'success'
                : 'error'
            }
            text={currentModify?.resultInfo.infoVerify}
          />{' '}
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'待调整人验证'} valueType={'text'}>
          <Badge
            status={
              currentModify?.resultInfo.unHandleUsers === 'PASS'
                ? 'success'
                : 'error'
            }
            text={currentModify?.resultInfo.unHandleUsers}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label={'异动子任务验证'} valueType={'text'}>
          <Badge
            status={
              currentModify?.resultInfo.taskVerify === 'PASS'
                ? 'success'
                : 'error'
            }
            text={currentModify?.resultInfo.taskVerify}
          />{' '}
        </ProDescriptions.Item>

        {currentModify?.resultInfo?.taskSource?.map((item) => (
          <>
            <ProDescriptions.Item
              label={'任务名'}
              valueType={'text'}
              labelStyle={{ width: '10%' }}
            >
              {item.title}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={'描述'}
              valueType={'text'}
              labelStyle={{ width: '10%' }}
            >
              {item.desc}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={'测试结果'}
              valueType={'text'}
              labelStyle={{ width: '10%' }}
            >
              <Badge
                status={item.status === 'PASS' ? 'success' : 'error'}
                text={item.status}
              />
            </ProDescriptions.Item>
          </>
        ))}
      </ProDescriptions>

      <ProCard type={'inner'} title={'详情'} bodyStyle={{ padding: 0 }}>
        <AceCodeEditor
          height={'50vh'}
          value={JSON.stringify(currentModify?.resultInfo.resultInfo, null, 2)}
        />
      </ProCard>
    </MyDrawer>
  );
};

export default BaseModifyDraw;
