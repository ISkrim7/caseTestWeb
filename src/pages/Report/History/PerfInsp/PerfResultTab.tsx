import { perfInspectionDetail } from '@/api/cbsAPI/cbs';
import MyDrawer from '@/components/MyDrawer';
import TitleName from '@/components/TitleName';
import BaseInfo from '@/pages/Report/History/PerfInsp/baseInfo';
import {
  IPerfInspection,
  IPerfResult,
} from '@/pages/Report/History/PerfInsp/PerfResultAPI';
import PerfResultInfo from '@/pages/Report/History/PerfInsp/PerfResultInfo';
import PerfUatResult from '@/pages/Report/History/PerfInsp/PerfUatResult';
import { FileTextTwoTone, HomeOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';

const TabPane = Tabs.TabPane;

interface SelfProps {
  open: boolean;
  setOpen: any;
  currentResultUid: string;
}

const PerfResultTab: FC<SelfProps> = (props) => {
  const { open, setOpen, currentResultUid } = props;
  const [perfInspection, setPerfInspection] = useState<IPerfInspection>();
  const [isUat, setIsUat] = useState(false);

  useEffect(() => {
    const fetchResultDetail = async (uid: string) => {
      const { code, data } = await perfInspectionDetail({ uid: uid });
      if (code === 0) {
        console.log('===', data);
        return data;
      }
    };
    if (currentResultUid) {
      fetchResultDetail(currentResultUid).then((data) => {
        if (data) {
          setIsUat(data.uat);
          setPerfInspection(data);
        }
      });
    }
  }, [currentResultUid]);

  const CityTabs = (
    <>
      {perfInspection?.resultInfo.map((item, index) => {
        return (
          <TabPane
            tab={
              <>
                <HomeOutlined
                  style={{ color: item.result ? 'green' : 'red', fontSize: 20 }}
                />
                <span style={{ marginLeft: 4 }}>{item.city}</span>
              </>
            }
            key={index}
          >
            <PerfResultInfo resultInfo={item as IPerfResult} />
          </TabPane>
        );
      })}
    </>
  );
  return (
    <MyDrawer
      name={TitleName('业绩巡检详情')}
      open={open}
      setOpen={setOpen}
      width={'80%'}
    >
      {isUat === true ? (
        <PerfUatResult perfInspection={perfInspection} />
      ) : (
        <Tabs
          style={{ width: '100%', minHeight: 460 }}
          tabPosition={'left'}
          size={'large'}
          defaultActiveKey={'BASE'}
        >
          <TabPane
            tab={
              <>
                <FileTextTwoTone
                  style={{ fontSize: 20 }}
                  twoToneColor={'orange'}
                />
                <span style={{ marginLeft: 4 }}>基本信息</span>
              </>
            }
            key={'BASE'}
          >
            <BaseInfo perfInspection={perfInspection} />
          </TabPane>
          {CityTabs}
        </Tabs>
      )}
    </MyDrawer>
  );
};

export default PerfResultTab;
