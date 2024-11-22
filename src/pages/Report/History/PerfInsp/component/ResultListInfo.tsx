import {
  IContractResultInfo,
  IHouseResultDetailInfo,
} from '@/pages/Report/History/PerfInsp/PerfResultAPI';
import { ProList } from '@ant-design/pro-components';
import { Badge, Select } from 'antd';
import { FC, useState } from 'react';

const { Option } = Select;

interface SelfProps {
  datasource: IContractResultInfo[];
  housePerf?: IHouseResultDetailInfo;
}

const ResultListInfo: FC<SelfProps> = (props) => {
  const { datasource, housePerf } = props;
  const [filterFlag, setFilterFlag] = useState();

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
  const housePerfEle = (
    <>
      {housePerf ? (
        <span style={{ marginLeft: 60 }}>
          预计业绩测试：{' '}
          {housePerf?.result ? (
            <Badge status={'success'} text={'通过'} />
          ) : (
            <Badge status={'error'} text={'不通过'} />
          )}
        </span>
      ) : null}
    </>
  );
  return (
    <ProList
      rowKey={'name'}
      dataSource={datasource.filter((item) =>
        filterFlag === undefined ? true : item.result === filterFlag,
      )}
      metas={{
        title: {
          dataIndex: 'name',
          search: false,
        },
        description: {
          dataIndex: 'desc',
        },
        content: {
          dataIndex: 'content',
          search: false,
          render: (text) => (
            <div
              key="label"
              style={{ display: 'flex', justifyContent: 'space-around' }}
            >
              {(text as any[]).map((t) => (
                <div>
                  <div>{t.label}</div>
                  <Badge status={t.status} text={t.text} />
                </div>
              ))}
            </div>
          ),
        },
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
      showActions="hover"
      toolBarRender={() => [housePerfEle, SelectEle]}
    />
  );
};

export default ResultListInfo;
