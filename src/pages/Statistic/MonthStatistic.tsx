import { monthCountInfo } from '@/api/cbsAPI/cbs';
import { Line } from '@ant-design/plots';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';

interface IInfo {
  create_time?: string;
  failNum: number;
  id?: number;
  successNum: number;
  today?: string;
  uid?: string;
  update_time?: string;
}

const MonthStatistic = () => {
  const [info, setInfo] = useState<IInfo[]>([]);

  const fetchIndexInfo = async () => {
    await monthCountInfo()
      .then(({ code, data }) => {
        if (code === 0) {
          console.log(data);
          setInfo(data);
        }
      })
      .catch((error) => {
        message.error(error);
      });
  };
  useEffect(() => {
    fetchIndexInfo();
  }, []);
  const config = {
    data: info,
    xField: 'date',
    yField: 'num',
    seriesField: 'name',
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  return (
    <ProCard title={'月统计'} bordered>
      <StatisticCard.Group
        direction={'row'}
        style={{ marginTop: 50 }}
        // @ts-ignore
        chart={<Line {...config} />}
      />
    </ProCard>
  );
};

export default MonthStatistic;
