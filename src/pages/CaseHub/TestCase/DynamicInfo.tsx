import { queryTestCaseDynamic } from '@/api/case/testCase';
import { ICaseDynamic } from '@/pages/CaseHub/type';
import { SoundTwoTone } from '@ant-design/icons';
import { ProCard, ProList } from '@ant-design/pro-components';
import { Avatar } from 'antd';
import { FC, useEffect, useState } from 'react';

interface IProps {
  caseId?: number;
}

const DynamicInfo: FC<IProps> = ({ caseId }) => {
  const [originalData, setOriginalData] = useState<ICaseDynamic[]>([]);
  const [displayData, setDisplayData] = useState<ICaseDynamic[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);

  useEffect(() => {
    if (caseId) {
      queryTestCaseDynamic(caseId).then(async ({ code, data }) => {
        if (code === 0) {
          setOriginalData(data);
          setShouldShowToggle(data.length > 5);

          // 默认显示最后5条
          if (data.length > 5) {
            setDisplayData(data.slice(-5));
          } else {
            setDisplayData(data);
          }
        }
      });
    }
  }, [caseId]);

  // 处理显示数据的逻辑
  useEffect(() => {
    if (originalData.length === 0) return;

    if (showMore) {
      // 展开时显示全部数据
      setDisplayData(originalData);
    } else {
      // 收起时显示最后5条数据（最新的）
      setDisplayData(
        originalData.length > 5 ? originalData.slice(-5) : originalData,
      );
    }
  }, [showMore, originalData]);

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
            {showMore ? '收起' : `展开 (${originalData.length - 5} 条更多)`}
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
            dataIndex: 'creatorName',
            render: (text, record) => <span>{text}</span>,
          },
          avatar: {
            dataIndex: 'name',
            editable: false,
            render: (text, record) => (
              <Avatar size="small" shape="square">
                {record.creatorName[0]}
              </Avatar>
            ),
          },
          description: {
            dataIndex: 'description',
            render: (text, record) => (
              <span>
                <SoundTwoTone style={{ marginRight: 8 }} />
                {text}
              </span>
            ),
          },
          actions: {
            render: (text, row, index, action) => [
              <span>{row.create_time}</span>,
            ],
          },
        }}
      />
    </ProCard>
  );
};

export default DynamicInfo;
