import { IObjGet } from '@/api';
import { queryCityList } from '@/api/cbsAPI/cbs';
import { ProFormSelect } from '@ant-design/pro-components';
import React from 'react';

const Utils = () => {
  const KeyTypes = [
    { label: '普通钥匙', value: '1' },
    { label: '密码钥匙', value: '2' },
  ];
  const BusinessType = [
    {
      label: '买卖',
      value: '2',
    },
    {
      label: '租赁',
      value: '1',
    },
  ];
  const CityBuildingName: IObjGet = {
    hangzhou: '远洋心里',
    beijing: '验真使用勿动',
  };
  const CityBuilder: IObjGet = {
    hangzhou: '374423',
    beijing: '8328780',
    shanghai: '608349',
    tianjin: '159017',
    taiyuan: '100943',
    suzhou: '631112',
    wuxi: '92812',
    zhengzhou: '8230831',
    nanjing: '568576',
  };
  const CityUser: IObjGet = {
    beijing: '8204243',
    tianjin: '159017',
    taiyuan: '100943',
    zhengzhou: '8230831',
    hangzhou: '8355364',
    wuxi: '8171439',
    nanjing: '568576',
    shanghai: '608349',
  };
  const financeApprove: IObjGet = {
    beijing: '8128830',
    tianjin: '141716',
    zhengzhou: '8315796',
    hangzhou: '59532',
    wuxi: '8116827',
    nanjing: null,
    shanghai: null,
  };
  const cityList: { label: string; value: string }[] = [
    {
      label: '北京',
      value: 'beijing',
    },
    {
      label: '郑州',
      value: 'zhengzhou',
    },
    {
      label: '无锡',
      value: 'wuxi',
    },
    {
      label: '南京',
      value: 'nanjing',
    },
    {
      label: '上海',
      value: 'shanghai',
    },
    {
      label: '太原',
      value: 'taiyuan',
    },
    {
      label: '天津',
      value: 'tianjin',
    },
    {
      label: '杭州',
      value: 'hangzhou',
    },
  ];

  // 生成虚假的中国身份证号码
  function generateFakeIDCard() {
    const randomId = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const randomYear = Math.floor(Math.random() * (2023 - 1950 + 1)) + 1950;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomSuffix = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    return `${randomId}${randomYear}${randomMonth
      .toString()
      .padStart(2, '0')}${randomDay
      .toString()
      .padStart(2, '0')}${randomSuffix}`;
  }

  // 随机生成中国格式的手机号码
  function generateChinesePhoneNumber() {
    const prefixArray = [
      '130',
      '131',
      '132',
      '133',
      '134',
      '135',
      '136',
      '137',
      '138',
      '139',
      '147',
      '149',
      '150',
      '151',
      '152',
      '153',
      '155',
      '156',
      '157',
      '158',
      '159',
      '166',
      '170',
      '171',
      '172',
      '173',
      '174',
      '175',
      '176',
      '177',
      '178',
      '180',
      '181',
      '182',
      '183',
      '184',
      '185',
      '186',
      '187',
      '188',
      '189',
    ];
    const randomPrefix =
      prefixArray[Math.floor(Math.random() * prefixArray.length)];
    const randomNumber =
      Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    return `${randomPrefix}${randomNumber}`;
  }

  const AgreementNode = [
    {
      label: '创建',
      value: 'create',
    },
    {
      label: '提交审批',
      value: 'submitAudit',
    },
    {
      label: '完成审批',
      value: 'approval',
    },
    {
      label: '打印',
      value: 'print',
    },
    {
      label: '签收',
      value: 'sign',
    },
    {
      label: '归档',
      value: 'sort',
    },
  ];

  const fetchQueryCity = async () => {
    const { code, data } = await queryCityList();
    if (code === 0) {
      return data;
    }
  };

  const defaultSignUserData = [
    {
      id: 0,
      target: '卖方',
      name: 'CBS自动化',
      ssn: generateFakeIDCard(),
      phone: generateChinesePhoneNumber(),
    },
    {
      id: 1,
      target: '买方',
      name: '大娃',
      ssn: generateFakeIDCard(),
      phone: generateChinesePhoneNumber(),
    },
  ];

  const SelectCity = (
    cityList: any,
    setSelectedCity: React.Dispatch<React.SetStateAction<string | undefined>>,
    selectedCity?: string,
  ) => {
    return (
      <>
        {selectedCity && (
          <ProFormSelect
            required
            width={'md'}
            name={'city'}
            label={'目标城市'}
            options={cityList}
            initialValue={selectedCity || undefined}
            fieldProps={{
              onSelect: (value: string) => {
                setSelectedCity(value);
              },
            }}
          />
        )}
      </>
    );
  };
  return {
    SelectCity,
    defaultSignUserData,
    fetchQueryCity,
    generateChinesePhoneNumber,
    AgreementNode,
    CityUser,
    cityList,
    financeApprove,
    CityBuildingName,
    CityBuilder,
    BusinessType,
    KeyTypes,
  };
};
export default Utils;
