import { countInfo, totalCountInfo } from '@/api/cbsAPI/cbs';
import { Pie } from '@ant-design/plots';
import { ProCard, Statistic, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { useEffect, useState } from 'react';

const { Divider } = StatisticCard;

interface IInfo {
  create_time?: string;
  failNum: number;
  id?: number;
  successNum: number;
  today?: string;
  uid?: string;
  update_time?: string;
  houseNum: number;
  signNum: number;
  clientNum: number;
  agreeNum: number;
  finNum: number;
  otherNum: number;
}

interface ITotalCount {
  housenum: number;
  clientnum: number;
  signnum: number;
  othernum: number;
  agreenum: number;
  finnum: number;
}

const DayStatistic = () => {
  const [responsive, setResponsive] = useState(false);
  const [info, setInfo] = useState<IInfo>({
    successNum: 0,
    failNum: 0,
    houseNum: 0,
    agreeNum: 0,
    finNum: 0,
    signNum: 0,
    clientNum: 0,
    otherNum: 0,
  });
  const [totalCount, setTotalCount] = useState<ITotalCount>({
    housenum: 0,
    clientnum: 0,
    signnum: 0,
    agreenum: 0,
    finnum: 0,
    othernum: 0,
  });
  const PieData = [
    {
      type: '成功',
      value: info.successNum,
    },
    {
      type: '失败',
      value: info.failNum,
    },
  ];
  const Pie2Data = [
    {
      type: '签约',
      value: info.signNum,
    },
    {
      type: '财务',
      value: info.finNum,
    },
    {
      type: '协议',
      value: info.agreeNum,
    },
    {
      type: '客源',
      value: info.clientNum,
    },
    {
      type: '房源',
      value: info.houseNum,
    },
    {
      type: '其他',
      value: info.otherNum,
    },
  ];
  const PieConfig = {
    height: 110,
    appendPadding: 5,
    data: PieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  const Pie2Config = {
    height: 110,
    appendPadding: 5,
    data: Pie2Data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const fetchIndexInfo = async () => {
    const { code, data } = await countInfo();
    if (code === 0) {
      return data;
    }
  };
  const fetchTotalInfo = async () => {
    const { code, data } = await totalCountInfo();
    if (code === 0) {
      return data;
    }
  };
  useEffect(() => {
    fetchIndexInfo().then((data) => {
      setInfo(data);
    });
    fetchTotalInfo().then((data) => {
      setTotalCount(data);
    });
  }, []);
  return (
    <ProCard direction={'row'} bordered hoverable>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <StatisticCard.Group
          title={'总构建'}
          direction={responsive ? 'column' : 'row'}
        >
          <StatisticCard
            statistic={{
              title: '房',
              value: totalCount.housenum,
              valueStyle: { color: 'green' },
            }}
            chartPlacement="left"
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: '客',
              value: totalCount.clientnum,
              valueStyle: { color: 'green' },
            }}
            chartPlacement="left"
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: '签约',
              value: totalCount.signnum,
              valueStyle: { color: 'green' },
            }}
            chartPlacement="left"
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: '财务',
              value: totalCount.finnum,
              valueStyle: { color: 'green' },
            }}
            chartPlacement="left"
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: '协议',
              value: totalCount.agreenum,
              valueStyle: { color: 'green' },
            }}
            chartPlacement="left"
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: '其他',
              value: totalCount.othernum,
              valueStyle: { color: 'green' },
            }}
            chartPlacement="left"
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: '总计',
              value:
                totalCount.othernum +
                totalCount.housenum +
                totalCount.signnum +
                totalCount.clientnum +
                totalCount.finnum +
                totalCount.agreenum,
              valueStyle: { color: 'green' },
            }}
            chartPlacement="left"
          />
        </StatisticCard.Group>

        <StatisticCard.Group
          direction={responsive ? 'column' : 'row'}
          title={'今日构建'}
        >
          <StatisticCard
            statistic={{
              title: '总共',
              valueStyle: { color: 'greenyellow' },
              value: info.failNum + info.successNum,
              description: <Statistic title="日期" value={info.today} />,
            }}
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: '成功',
              value: info.successNum,
              valueStyle: { color: 'green' },
              description: (
                <Statistic
                  title="占比"
                  value={
                    info.successNum === 0
                      ? '0%'
                      : `${(
                          (info.successNum / (info.successNum + info.failNum)) *
                          100
                        ).toFixed(2)}%`
                  }
                />
              ),
            }}
            chartPlacement="left"
          />
          <StatisticCard
            statistic={{
              title: '失败',
              value: info.failNum,
              valueStyle: { color: 'red' },
              description: (
                <Statistic
                  title="占比"
                  value={
                    info.failNum === 0
                      ? '0%'
                      : `${(
                          (info.failNum / (info.successNum + info.failNum)) *
                          100
                        ).toFixed(2)}%`
                  }
                />
              ),
            }}
            chartPlacement="left"
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard chart={<Pie {...PieConfig} />} />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard chart={<Pie {...Pie2Config} />} />
        </StatisticCard.Group>
      </RcResizeObserver>
    </ProCard>
  );
};

export default DayStatistic;
