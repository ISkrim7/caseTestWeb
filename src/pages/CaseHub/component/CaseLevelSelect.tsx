import { CaseHubConfig } from '@/pages/CaseHub/CaseConfig';
import { ITestCase } from '@/pages/CaseHub/type';
import { ProFormSelect } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface Props {
  testcaseData?: ITestCase;
}

const CaseLevelSelect: FC<Props> = ({ testcaseData }) => {
  const [levelVisible, setLevelVisible] = useState(true);
  const [level, setLevel] = useState<string>('P2');
  useEffect(() => {
    if (testcaseData) {
      if (testcaseData.case_level) {
        setLevel(testcaseData.case_level);
        setLevelVisible(false);
      }
    }
  }, [testcaseData]);
  const { CASE_LEVEL_OPTION, CASE_LEVEL_COLOR_ENUM } = CaseHubConfig;
  return (
    <>
      {levelVisible ? (
        <ProFormSelect
          noStyle
          style={{ borderRadius: 20 }}
          name="case_level"
          required
          onChange={(value: string) => {
            setLevel(value);
            setLevelVisible(false);
          }}
          initialValue={'P2'}
          options={CASE_LEVEL_OPTION}
        />
      ) : (
        <Tag
          color={CASE_LEVEL_COLOR_ENUM[level]}
          onClick={() => setLevelVisible(true)}
        >
          {level}
        </Tag>
      )}
    </>
  );
};

export default CaseLevelSelect;
