import ResultListInfo from '@/pages/Report/History/PerfInsp/component/ResultListInfo';
import {
  IContractCheckList,
  IContractResultInfo,
  IHouseResultDetailInfo,
  IPerfResult,
  IResult,
} from '@/pages/Report/History/PerfInsp/PerfResultAPI';
import { ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';

const TabPane = Tabs.TabPane;

interface SelfProps {
  resultInfo: IPerfResult;
}

const PerfResultInfo: FC<SelfProps> = (props) => {
  const { resultInfo } = props;
  const { contractResultInfo, houseResultInfo } = resultInfo;

  const [buyInfo, setBuyInfo] = useState<IContractResultInfo[]>([]);
  const [buyHousePerfInfo, setBuyHousePerfInfo] =
    useState<IHouseResultDetailInfo>();
  const [leaseHousePerfInfo, setLeaseHousePerfInfo] =
    useState<IHouseResultDetailInfo>();
  const [leaseInfo, setLeaseInfo] = useState<IContractResultInfo[]>([]);
  const [intentionInfo, setIntentionInfo] = useState<IContractResultInfo[]>([]);

  const filterData = (resultInfo: IContractResultInfo[]) => {
    const buyInfo = resultInfo.find((obj) => obj.businessType === 2);
    const buyDataSource = transformData(buyInfo?.checkList || []);

    setBuyInfo(buyDataSource);
    const leaseInfo = resultInfo.find((obj) => obj.businessType === 1);
    const leaseDataSource = transformData(leaseInfo?.checkList || []);
    setLeaseInfo(leaseDataSource);
    const intentionInfo = resultInfo.find((obj) => obj.businessType === 3);
    const intentionDataSource = transformYXData(intentionInfo?.checkList || []);
    setIntentionInfo(intentionDataSource);
  };
  const filterHouseData = (data: IHouseResultDetailInfo[]) => {
    const buyInfo = data.find((obj) => obj.businessType === 2);
    const leaseInfo = data.find((obj) => obj.businessType === 1);
    setBuyHousePerfInfo(buyInfo);
    setLeaseHousePerfInfo(leaseInfo);
  };

  const transformYXData = (values: IContractCheckList[] | []): any[] => {
    return values.map((detail) => {
      const { contractStatus, contractCode } = detail;
      const content: IResult[] = [];
      content.push({
        label: '意向业绩校验',
        text: detail.intentionCheck ? '通过' : '不通过',
        status: detail.intentionCheck ? 'success' : 'error',
      });
      content.push({
        label: '意向业绩日志校验',
        text: detail.intentionHistoryCheck ? '通过' : '不通过',
        status: detail.intentionHistoryCheck ? 'success' : 'error',
      });
      return {
        name: contractCode,
        desc: contractStatus,
        result: detail.result,
        content,
      };
    });
  };

  const transformData = (values: IContractCheckList[] | []): any[] => {
    return values.map((detail) => {
      const {
        contractStatus,
        contractCode,
        sumPaidAmount,
        sumReceivableAmount,
      } = detail;
      const content: IResult[] = [];
      content.push({
        label: '待收业绩',
        text: detail.notCollectCheckResult ? '通过' : '不通过',
        status: detail.notCollectCheckResult ? 'success' : 'error',
      });
      content.push({
        label: '分单业绩',
        text: detail.prorateCheckResult ? '通过' : '不通过',
        status: detail.prorateCheckResult ? 'success' : 'error',
      });
      if (detail.prorateAmountCheckResult !== undefined) {
        content.push({
          label: '分单业绩金额比例',
          text: detail.prorateAmountCheckResult ? '通过' : '不通过',
          status: detail.prorateAmountCheckResult ? 'success' : 'error',
        });
      }
      content.push({
        label: '分单业绩日志',
        text: detail.prorateLogCheckResult ? '通过' : '不通过',
        status: detail.prorateLogCheckResult ? 'success' : 'error',
      });
      content.push({
        label: '收益业绩',
        text: detail.incomePerfCheckResult ? '通过' : '不通过',
        status: detail.incomePerfCheckResult ? 'success' : 'error',
      });
      content.push({
        label: '收益业绩日志',
        text:
          detail.incomeDetailCheck === true
            ? '通过'
            : detail.incomeDetailCheck === false
            ? '不通过'
            : '预期未生成',
        status:
          detail.incomeDetailCheck === true
            ? 'success'
            : detail.incomeDetailCheck === false
            ? 'error'
            : 'success',
      });
      content.push({
        label: '计业绩日志',
        text:
          detail.incomeCountCheck === true
            ? '通过'
            : detail.incomeCountCheck === false
            ? '不通过'
            : '预期未生成',
        status:
          detail.incomeCountCheck === true
            ? 'success'
            : detail.incomeCountCheck === false
            ? 'error'
            : 'success',
      });
      return {
        name: contractCode,
        desc: `${contractStatus} 应收 ${
          sumReceivableAmount !== undefined ? sumReceivableAmount : '-'
        } 实收 ${sumPaidAmount !== undefined ? sumPaidAmount : '-'}`,
        result: detail.result,
        content,
      };
    });
  };

  useEffect(() => {
    if (contractResultInfo) {
      console.log('contractResultInfo', contractResultInfo);
      filterData(contractResultInfo);
    }
    if (houseResultInfo) {
      filterHouseData(houseResultInfo.resultInfo);
    }
  }, [resultInfo]);

  return (
    <ProCard>
      <Tabs
        style={{ width: '100%', height: '100%' }}
        tabPosition={'top'}
        size={'large'}
        defaultValue={'0'}
      >
        <TabPane tab={'买卖'} key={'0'}>
          <ResultListInfo datasource={buyInfo} housePerf={buyHousePerfInfo} />
        </TabPane>
        <TabPane tab={'租赁'} key={'1'}>
          <ResultListInfo
            datasource={leaseInfo}
            housePerf={leaseHousePerfInfo}
          />
        </TabPane>
        {intentionInfo.length > 0 ? (
          <TabPane tab={'意向'} key={'3'}>
            <ResultListInfo datasource={intentionInfo} />
          </TabPane>
        ) : null}
      </Tabs>
    </ProCard>
  );
};

export default PerfResultInfo;
