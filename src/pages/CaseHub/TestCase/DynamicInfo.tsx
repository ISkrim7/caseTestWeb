import { SoundTwoTone } from '@ant-design/icons';
import { ProCard, ProList } from '@ant-design/pro-components';
import { Avatar } from 'antd';
import { useEffect, useState } from 'react';

type DynamicInfoProps = {
  id: number;
  name: string;
  desc: string;
  time: string;
};

const demodata: DynamicInfoProps[] = [
  {
    id: 1,
    name: 'A',
    desc: '创建了用例',
    time: '2022-01-01',
  },
  {
    id: 2,
    name: 'B',
    desc: '修改修改了用例等级 从 P1 修改为 P2 ',
    time: '2022-01-01',
  },
  {
    id: 3,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 4,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 5,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 6,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 7,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 8,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 9,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 10,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 11,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 12,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
  {
    id: 13,
    name: 'C',
    desc: '修改修改了用例类型 从 是快乐打卡计划的框架啊活动空间啊刷空间 修改为 啊数据打卡时，就打了快睡觉拉屎 ',
    time: '2022-01-01',
  },
];
const DynamicInfo = () => {
  const [displayData, setDisplayData] = useState<DynamicInfoProps[]>();
  const [showMore, setShowMore] = useState(false);

  // 处理显示数据的逻辑
  useEffect(() => {
    if (demodata.length > 5) {
      if (showMore) {
        // 展开时显示全部数据
        setDisplayData(demodata);
      } else {
        // 收起时显示最后5条数据（最新的）
        setDisplayData(demodata.slice(-5));
      }
    } else {
      // 数据量不足5条时显示全部
      setDisplayData(demodata);
    }
  }, [showMore]);

  // 计算是否需要显示展开/收起按钮
  const shouldShowToggle = demodata.length > 5;

  return (
    <ProCard
      extra={
        shouldShowToggle && (
          <span
            onClick={() => setShowMore(!showMore)}
            style={{
              cursor: 'pointer',
              color: '#1890ff',
              fontWeight: 'normal',
              fontSize: '14px',
            }}
          >
            {showMore ? '收起' : `展开 (${demodata.length - 5} 条更多)`}
          </span>
        )
      }
    >
      <ProList
        rowKey="id"
        dataSource={displayData}
        showActions="hover"
        metas={{
          title: {
            dataIndex: 'name',
            render: (text, record) => <span>{text}</span>,
          },
          avatar: {
            dataIndex: 'name',
            editable: false,
            render: (text, record) => (
              <Avatar size="small" shape="square">
                {record.name[0]}
              </Avatar>
            ),
          },
          description: {
            dataIndex: 'desc',
            render: (text, record) => (
              <span>
                <SoundTwoTone style={{ marginRight: 8 }} />
                {text}
              </span>
            ),
          },
          actions: {
            render: (text, row, index, action) => [<span>{row.time}</span>],
          },
        }}
      />
    </ProCard>
  );
};

export default DynamicInfo;
