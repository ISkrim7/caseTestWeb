import {
  getTaskStatusByRootPartId,
  queryRootPartsByProjectId,
} from '@/api/aps';
import TitleName from '@/components/TitleName';
import { Line } from '@ant-design/plots';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';

interface SelfProps {
  projectId: number;
}

interface IData {
  SUCCESS: number;
  FAIL: number;
  TOTAL: number;
  runDay: string;
}

const Status: FC<SelfProps> = ({ projectId }) => {
  // 获取当前日期
  const today = dayjs();

  // 获取当前月的第一天
  const startOfMonth = today.startOf('month');
  const [rootParts, setRootParts] = useState<
    { label: string; value: number }[]
  >([]);
  const [selectRoot, setSelectRoot] = useState<number>();
  const [currentData, setCurrentData] = useState<IData[]>([]);
  const [title, setTitle] = useState('');
  const [dayRange, setDayRange] = useState<string[]>([]);
  useEffect(() => {
    queryRootPartsByProjectId({ projectId: projectId }).then(
      ({ code, data }) => {
        if (code === 0) {
          const parts: { label: string; value: number }[] = [];
          data.map((item: any) => {
            parts.push({
              label: item.partName,
              value: item.id,
            });
          });
          setTitle(parts[0].label);
          setRootParts(parts);
          setSelectRoot(parts[0].value);
        }
      },
    );
  }, [projectId]);

  useEffect(() => {
    console.log(dayRange);

    if (selectRoot) {
      console.log(dayRange);
      if (dayRange.length > 0) {
        const st = dayRange[0];
        const et = dayRange[1];
        getTaskStatusByRootPartId({ partId: selectRoot, st: st, et: et }).then(
          ({ code, data }) => {
            if (code === 0) {
              const lineData = data.flatMap((item: any) =>
                Object.entries(item)
                  .filter(([key]) => key !== 'runDay') // Exclude the 'runDay' key
                  .map(([name, value]) => ({
                    runDay: item.runDay,
                    name,
                    value,
                  })),
              );
              setCurrentData(lineData);
            }
          },
        );
      } else {
        getTaskStatusByRootPartId({ partId: selectRoot }).then(
          ({ code, data }) => {
            if (code === 0) {
              const lineData = data.flatMap((item: any) =>
                Object.entries(item)
                  .filter(([key]) => key !== 'runDay') // Exclude the 'runDay' key
                  .map(([name, value]) => ({
                    runDay: item.runDay,
                    name,
                    value,
                  })),
              );
              setCurrentData(lineData);
            }
          },
        );
      }
    }
  }, [selectRoot, dayRange]);

  const config = {
    data: currentData,
    xField: 'runDay',
    yField: 'value',
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

  const handleChange = (value: number) => {
    setSelectRoot(value);
    rootParts.forEach((item) => {
      if (item.value === value) {
        setTitle(item.label);
      }
    });
  };

  return (
    <ProCard
      title={TitleName(`本周${title}稳定性`)}
      extra={
        <>
          日期：
          <DatePicker.RangePicker
            defaultValue={[startOfMonth, today]}
            onChange={(date, dateString) => {
              setDayRange(dateString);
            }}
          />
          <span style={{ marginLeft: 10 }}>模块：</span>
          {selectRoot && (
            <Select
              style={{ width: 120 }}
              options={rootParts}
              defaultValue={selectRoot}
              defaultActiveFirstOption
              onChange={handleChange}
            />
          )}
        </>
      }
    >
      <ProCard>
        <StatisticCard.Group
          direction={'row'}
          style={{ marginTop: 50 }}
          // @ts-ignore
          chart={<Line {...config} />}
        />
      </ProCard>
    </ProCard>
  );
};

export default Status;
