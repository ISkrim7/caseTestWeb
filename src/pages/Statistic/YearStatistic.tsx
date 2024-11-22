import { countInfoByYear } from '@/api/cbsAPI/cbs';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { DatePicker, DatePickerProps, Divider, Space } from 'antd';
import React, { useEffect } from 'react';

interface ITotalCount {
  houseNum: number;
  clientNum: number;
  signNum: number;
  otherNum: number;
  agreeNum: number;
  finNum: number;
}

const YearStatistic = () => {
  const [yearTotalNumInfo, setYearTotalNumInfo] = React.useState<ITotalCount>({
    houseNum: 0,
    clientNum: 0,
    signNum: 0,
    otherNum: 0,
    agreeNum: 0,
    finNum: 0,
  });
  const [year, setYear] = React.useState<string>();
  const fetchYearTotalNumInfo = async (year: string) => {
    const { code, data } = await countInfoByYear({ year: year });
    if (code === 0) {
      return data;
    }
  };
  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);
  }, []); // 空数组意味着只在组件挂载时执行一次
  useEffect(() => {
    if (year) {
      fetchYearTotalNumInfo(year).then((data) => {
        if (data) {
          setYearTotalNumInfo(data);
        }
      });
    }
  }, [year]);
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setYear(dateString as string);
  };

  return (
    <ProCard direction={'row'} bordered hoverable>
      <Space direction="vertical" size={12}>
        <DatePicker picker={'year'} onChange={onChange} />
      </Space>
      <StatisticCard.Group title={'年度构建'} direction={'row'}>
        <StatisticCard
          statistic={{
            title: '房',
            value: yearTotalNumInfo.houseNum,
            valueStyle: { color: 'green' },
          }}
          chartPlacement="left"
        />
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            title: '客',
            value: yearTotalNumInfo.clientNum,
            valueStyle: { color: 'green' },
          }}
          chartPlacement="left"
        />
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            title: '签约',
            value: yearTotalNumInfo.signNum,
            valueStyle: { color: 'green' },
          }}
          chartPlacement="left"
        />
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            title: '财务',
            value: yearTotalNumInfo.finNum,
            valueStyle: { color: 'green' },
          }}
          chartPlacement="left"
        />
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            title: '协议',
            value: yearTotalNumInfo.agreeNum,
            valueStyle: { color: 'green' },
          }}
          chartPlacement="left"
        />
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            title: '其他',
            value: yearTotalNumInfo.otherNum,
            valueStyle: { color: 'green' },
          }}
          chartPlacement="left"
        />
        <Divider type={'vertical'} />
        <StatisticCard
          statistic={{
            title: '总计',
            value:
              yearTotalNumInfo.otherNum +
              yearTotalNumInfo.houseNum +
              yearTotalNumInfo.signNum +
              yearTotalNumInfo.clientNum +
              yearTotalNumInfo.agreeNum +
              yearTotalNumInfo.finNum,
            valueStyle: { color: 'green' },
          }}
          chartPlacement="left"
        />
      </StatisticCard.Group>
    </ProCard>
  );
};

export default YearStatistic;
