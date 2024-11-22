import TitleName from '@/components/TitleName';
import {
  ProCard,
  ProForm,
  ProFormGroup,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { useEffect, useState } from 'react';

const Index = () => {
  const [tag, setTag] = useState<number>(3);
  const [amount, setAmount] = useState<number>(1000000); //合同价
  const [originalCommission, setOriginalCommission] = useState(0); //原佣
  const [commission, setCommission] = useState(0); //佣金
  const [m, setM] = useState(0); //房客源业绩金额总和 用于计算成交人业绩
  const [n, setN] = useState(0); //房客源业绩比例
  const [JS, setJS] = useState(0); //分单基数
  const [money, setMoney] = useState(0); //最终金额
  useEffect(() => {
    const calculateOriginalCommission = () => {
      const Y =
        amount >= 1000000
          ? (1000000 * 0.015 + (amount - 1000000) * 0.01) * 2
          : amount * 0.015 * 2;
      setOriginalCommission(Y);
    };

    calculateOriginalCommission();
  }, [amount]);

  useEffect(() => {
    const js_count = (): void => {
      let _zs: number = 0;
      let _js: number = 0;
      if (amount < 1500000.0) {
        _zs = 0.8;
        _js = originalCommission * 0.8;
      } else if (amount >= 1500000.0 && amount < 3000000.0) {
        _zs = 0.7;
        _js = 32000;
      } else if (amount >= 3000000.0 && amount < 6000000) {
        _zs = 0.65;
        _js = 49000;
      } else if (amount >= 6000000 && amount < 10000000) {
        _zs = 0.55;
        _js = 84500;
      } else {
        _zs = 0.55;
        _js = 115500;
      }

      const JS: number = Math.max(originalCommission * _zs, _js);
      setJS(JS);
    };
    js_count();
  }, [originalCommission]);

  useEffect(() => {
    calculateMoney();
  }, [tag, m, n, commission, JS]);

  const calculateMoney = () => {
    if (tag === 3 && commission > 0) {
      setMoney(commission - m);
    }
    if (tag === 2) {
      setMoney(n * commission);
    }
    if (n != 0 && JS != 0) {
      setMoney(n * JS);
    }
  };

  const Table = () => {
    const tableColumns: ProColumns[] = [
      {
        title: '成交价区间',
        key: 'qj',
        dataIndex: 'qj',
        search: false,
      },
      {
        title: '房源成交价按区间折算系数',
        key: 'xs',
        dataIndex: 'xs',
        search: false,
      },
      {
        title: '房源成交价个对应的最低业绩分单基数',
        key: 'js',
        dataIndex: 'js',
        search: false,
      },
    ];
    return (
      <ProTable
        size={'small'}
        pagination={false}
        search={false}
        columns={tableColumns}
        dataSource={[
          {
            id: 1,
            qj: '房源成交价<150万',
            xs: 0.8,
            js: '原佣*0.8',
          },
          {
            id: 2,
            qj: '150万《房源成交价<300万',
            xs: 0.7,
            js: '3.2万',
          },
          {
            id: 3,
            qj: '300万《房源成交价<600万',
            xs: 0.65,
            js: '4.9万',
          },
          {
            id: 4,
            qj: '600万《房源成交价<1000万',
            xs: 0.55,
            js: '8.45万',
          },
          {
            id: 5,
            qj: '1000万《房源成交价',
            xs: 0.45,
            js: '11.55万',
          },
        ]}
      ></ProTable>
    );
  };
  return (
    <ProCard
      title={TitleName('杭州固定金额业绩金额计算')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px' }}
    >
      <ProForm submitter={false}>
        <ProForm.Group>
          <ProFormMoney
            name="amount"
            width={'md'}
            label="合同成交价"
            initialValue={amount}
            addonAfter={'元'}
            required
            fieldProps={{
              onChange: (value: any) => {
                setAmount(value);
              },
            }}
          />
        </ProForm.Group>

        <ProFormGroup>
          <ProFormMoney
            name="originalCommission"
            width={'md'}
            tooltip={
              '合同价格 >= 100万 ? (1000000 * 0.015 + (amount - 1000000) * 0.01) * 2 : amount * 0.015 * 2;'
            }
            label="原佣"
            fieldProps={{ value: originalCommission }}
            disabled
          />
          <ProFormMoney
            name="JS"
            width={'md'}
            tooltip={
              'max（原佣 * 房源成交价按区间折算系数，房源成交价对应的最低业绩分单基数）'
            }
            disabled
            label="分单业绩基数"
            fieldProps={{ value: JS }}
          />
        </ProFormGroup>

        <ProForm.Group>
          <ProFormSelect
            name="tag"
            width={'md'}
            label="业绩方向"
            initialValue={tag}
            required
            options={[
              { label: '所属房源业绩', value: 1 },
              { label: '成交人业绩', value: 3 },
            ]}
            fieldProps={{
              onChange: (value: any) => {
                setTag(value);
                setCommission(0);
                setM(0);
                setMoney(0);
              },
            }}
          />
          {tag === 3 ? (
            <>
              <ProFormMoney
                width={'sm'}
                label="房客源总计金额"
                addonAfter={'元'}
                required
                fieldProps={{
                  onChange: (value: any) => {
                    setM(value);
                  },
                }}
              />
              <ProFormMoney
                name="commission"
                width={'md'}
                label="佣金"
                tooltip={'业务咨询费+经济服务费+代办费'}
                fieldProps={{
                  onChange: (value: any) => {
                    setCommission(value);
                  },
                }}
                required
                addonAfter={'元'}
              />
            </>
          ) : (
            <ProFormText
              width={'sm'}
              label="分单比例"
              addonAfter={'%'}
              fieldProps={{
                onChange: ({ target }: any) => {
                  setN(target.value / 100);
                },
              }}
            />
          )}
        </ProForm.Group>
        <p style={{ color: 'red' }}>
          房源角色分到的业绩 = 房源角色配置的分成比例 * 业绩分单基数
        </p>
        <p style={{ color: 'red' }}>
          成交人业绩项：分单金额=佣金-与房源动作相关的业绩项-与客源动作相关的业绩项{' '}
        </p>
        <ProForm.Group>
          <ProFormMoney
            name="money"
            width={'md'}
            label="分单金额"
            tooltip={'成交人业绩金额 = 佣金-其他业绩项目金额'}
            disabled
            fieldProps={{
              value: money,
            }}
            addonAfter={'元'}
          />
        </ProForm.Group>
      </ProForm>
      <Table />
    </ProCard>
  );
};

export default Index;
