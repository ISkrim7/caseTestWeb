import {
  IPerfInspection,
  IPerfUatResult,
} from '@/pages/Report/History/PerfInsp/PerfResultAPI';
import { ProList } from '@ant-design/pro-components';
import { Badge, Select, Tag } from 'antd';
import React, { FC, useEffect, useState } from 'react';

const { Option } = Select;

interface SelfProps {
  perfInspection?: IPerfInspection;
}

const PerfUatResult: FC<SelfProps> = ({ perfInspection }) => {
  const [resultData, setResultData] = React.useState<IPerfUatResult[]>([]);
  const [filterFlag, setFilterFlag] = useState();

  useEffect(() => {
    if (perfInspection) {
      console.log('uat === ', perfInspection.resultInfo);
      setResultData(perfInspection.resultInfo as IPerfUatResult[]);
    }
  }, []);

  const SelectEle = (
    <>
      测试壮态
      <Select
        value={filterFlag}
        onChange={(value) => setFilterFlag(value)}
        style={{ width: 150 }}
      >
        <Option value={true}>通过</Option>
        <Option value={false}>不通过</Option>
      </Select>
    </>
  );
  return (
    <>
      {resultData ? (
        <ProList
          size={'large'}
          rowKey={'url'}
          dataSource={resultData.filter((item) =>
            filterFlag === undefined ? true : item.result === filterFlag,
          )}
          metas={{
            title: {
              dataIndex: 'url',
              search: false,
              render: (text, record) => <span>{text}</span>,
            },
            subTitle: {
              render: (text, record) => {
                if (record.reason) {
                  return <Tag color={'red'}>{record.reason}</Tag>;
                }
              },
            },
            description: {
              dataIndex: 'desc',
              render: (text, record) => <span>{text}</span>,
            },
            content: {
              dataIndex: 'result',
              search: false,
              render: (text, record) => (
                <>
                  {record.result ? (
                    <Badge status="success" text="通过" />
                  ) : (
                    <Badge status="error" text="不通过" />
                  )}
                </>
              ),
            },
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          showActions="hover"
          toolBarRender={() => [SelectEle]}
        />
      ) : null}
    </>
  );
};

export default PerfUatResult;
