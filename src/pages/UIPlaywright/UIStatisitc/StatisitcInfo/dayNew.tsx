import { countCaseByDateType } from '@/api/aps';
import TitleName from '@/components/TitleName';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';

const { Divider, Statistic } = StatisticCard;

interface SelfProps {
  projectId: number;
}

interface IPartCaseCount {
  total: number;
  data: {
    partName: string;
    caseCount: number;
  }[];
}

const SearchOption = [
  {
    value: 'day',
    label: '本日新增',
  },
  {
    value: 'week',
    label: '本周新增',
  },
  {
    value: 'month',
    label: '本月新增',
  },
  {
    value: 'year',
    label: '年度新增',
  },
];

const DayNew: FC<SelfProps> = (props) => {
  // 获取当前日期
  const today = dayjs();

  // 获取当前月的第一天
  const startOfMonth = today.startOf('month');
  const [searchData, setSearchData] = useState<IPartCaseCount>();
  const [title, setTitle] = useState('');
  const [dayRange, setDayRange] = useState<string[]>([]);

  useEffect(() => {
    countCaseByDateType({
      projectId: props.projectId,
    }).then(({ code, data }) => {
      if (code === 0) {
        setSearchData(data);
      }
    });
  }, []);

  useEffect(() => {
    if (dayRange.length > 0) {
      const st = dayRange[0];
      const et = dayRange[1];
      countCaseByDateType({
        projectId: props.projectId,
        st: st,
        et: et,
      }).then(({ code, data }) => {
        if (code === 0) {
          setSearchData(data);
        }
      });
    }
  }, [dayRange]);
  return (
    <ProCard
      title={TitleName(`${title}新增统计`)}
      extra={
        <>
          日期：
          <DatePicker.RangePicker
            defaultValue={[startOfMonth, today]}
            onChange={(date, dateString) => {
              setDayRange(dateString);
            }}
          />
        </>
      }
    >
      <StatisticCard.Group>
        {searchData?.data.map((item) => (
          <StatisticCard
            statistic={{
              title: <h2>{item.partName}</h2>,
              value: item.caseCount,
              valueStyle: { color: 'green' },
            }}
          />
        ))}
        <Divider />
        <StatisticCard
          statistic={{
            title: <h2>{'总计'}</h2>,
            value: searchData?.total,
            valueStyle: { color: 'yellowgreen' },
          }}
        />
      </StatisticCard.Group>
    </ProCard>
  );
};

export default DayNew;
