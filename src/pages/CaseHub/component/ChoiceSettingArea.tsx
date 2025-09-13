import { setAllTestCaseStatus } from '@/api/case/testCase';
import { ITestCase } from '@/pages/CaseHub/type';
import { ProCard } from '@ant-design/pro-components';
import { message, Space } from 'antd';
import React, { FC } from 'react';

interface Props {
  showCheckButton: boolean;
  callback: () => void;
  selectedCase: number[];
  setSelectedCase: React.Dispatch<React.SetStateAction<number[]>>;
  allTestCase: ITestCase[];
}

const ChoiceSettingArea: FC<Props> = ({
  showCheckButton,
  allTestCase,
  selectedCase,
  setSelectedCase,
  callback,
}) => {
  const setAllSuccess = async () => {
    const values = {
      caseIds: selectedCase,
      status: 1,
    };
    const { code, msg } = await setAllTestCaseStatus(values);
    if (code === 0) {
      message.success(msg);
      callback();
    }
  };
  const setAllFail = async () => {
    const values = {
      caseIds: selectedCase,
      status: 2,
    };
    const { code, msg } = await setAllTestCaseStatus(values);
    if (code === 0) {
      message.success(msg);
      callback();
    }
  };
  const moveToCaseLib = async () => {};

  return (
    <>
      {showCheckButton && (
        <ProCard
          collapsed
          title={
            <div>
              已选择 {selectedCase.length} 项{' '}
              <Space style={{ marginLeft: '10px' }}>
                <a
                  onClick={() => {
                    if (allTestCase) {
                      setSelectedCase(allTestCase.map((tc) => tc.id!));
                    }
                  }}
                >
                  全选
                </a>
                <a onClick={() => setSelectedCase([])}>取消选择</a>
              </Space>
            </div>
          }
          style={{
            background: '#e6e6e6',
            borderRadius: '8px',
          }}
          extra={
            <Space size={'small'}>
              <a onClick={setAllSuccess}>全部成功</a>
              <a onClick={setAllFail}>全部失败</a>
              <a onClick={moveToCaseLib}>移动到用例库</a>
            </Space>
          }
        ></ProCard>
      )}
    </>
  );
};

export default ChoiceSettingArea;
