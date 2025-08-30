import { CaseHubConfig } from '@/pages/CaseHub/CaseConfig';
import { ITestCase } from '@/pages/CaseHub/type';
import { ProFormSelect } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface Props {
  testcaseData?: ITestCase;
}

const CaseTypeSelect: FC<Props> = ({ testcaseData }) => {
  const [typeVisible, setTypeVisible] = useState(true);
  const [typeValue, setTypeValue] = useState<number>(2);
  const { CASE_TYPE_OPTION, CASE_TYPE_ENUM } = CaseHubConfig;
  useEffect(() => {
    if (testcaseData?.case_type) {
      setTypeValue(testcaseData?.case_type);
      setTypeVisible(false);
    }
  }, [testcaseData]);
  return (
    <>
      {typeVisible ? (
        <ProFormSelect
          noStyle
          style={{
            borderRadius: 20,
            height: 'auto',
          }}
          onChange={(value: number) => {
            setTypeValue(value);
            setTypeVisible(false);
          }}
          name={'case_type'}
          initialValue={2}
          options={CASE_TYPE_OPTION}
        />
      ) : (
        <Tag onClick={() => setTypeVisible(true)}>
          {CASE_TYPE_ENUM[typeValue]}
        </Tag>
      )}
    </>
  );
};

export default CaseTypeSelect;
