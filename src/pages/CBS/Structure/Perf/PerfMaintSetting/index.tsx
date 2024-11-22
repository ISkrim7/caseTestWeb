import { getPerfSetting } from '@/api/cbsAPI/cbs';
import TitleName from '@/components/TitleName';
import Utils from '@/pages/CBS/component/utils';
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Loading } from '@icon-park/react';
import { Radio } from 'antd';
import { useEffect, useState } from 'react';

const Index = () => {
  const [form] = ProForm.useForm();
  const { cityList } = Utils();
  const [city, setCity] = useState('beijing');

  const [currentSetInfoID, setCurrentSetInfoID] = useState(0);
  const [DEPTID_OPT, SET_DEPTID_OPT] =
    useState<{ label: number; value: number }[]>();
  const [loading, setLoading] = useState(true);
  const [respData, setRespData] = useState<any>();
  const [perfSetting, SetPerfSetting] = useState();

  useEffect(() => {
    setLoading(true);
    getPerfSetting({ city: city }).then(({ code, data }) => {
      if (code === 0) {
        setRespData(data);
        const SET_INFO_ID_OPT = data.map(({ DEPTID }: any) => ({
          label: DEPTID,
          value: DEPTID,
        }));
        SET_DEPTID_OPT(SET_INFO_ID_OPT);
        setCurrentSetInfoID(0);
        // @ts-ignore
        SetPerfSetting(data[0]);
        setLoading(false);
      }
    });
  }, [city]);

  if (loading) {
    return <Loading title={'加载中'} />;
  }

  const currentIdChange = (value: any) => {
    const targetItem = respData!.find(
      ({ DEPTID }: { DEPTID: number }) => DEPTID == value.target.value,
    );
    form.setFieldsValue(targetItem);
  };

  const cityChange = (value: any) => {
    setCity(value.target.value);
  };
  return (
    <ProCard
      title={TitleName('房源维护V3.0配置')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px' }}
    >
      <ProForm
        form={form}
        layout={'horizontal'}
        initialValues={perfSetting}
        submitter={false}
      >
        <ProForm.Group title={'城市选择'}>
          <Radio.Group
            defaultValue={city}
            onChange={cityChange}
            options={cityList}
          />
        </ProForm.Group>
        <ProForm.Group title={'部门ID'} style={{ marginTop: 10 }}>
          <Radio.Group
            options={DEPTID_OPT}
            name={'DEPTID'}
            defaultValue={DEPTID_OPT![currentSetInfoID].value}
            onChange={currentIdChange}
          />
        </ProForm.Group>
        <ProForm.Group style={{ marginTop: 10 }}>
          <ProFormText
            name={'COMPANYID'}
            addonBefore={'公司ID'}
            style={{ width: '10', marginTop: 20 }}
            readonly={true}
          />
          <ProFormSelect
            width={'sm'}
            name={'STATUS'}
            options={[
              { label: '执行中', value: 2 },
              { label: '无效', value: 3 },
              {
                label: '待执行',
                value: 1,
              },
            ]}
            style={{ marginTop: 20 }}
            readonly={true}
          />

          <ProFormRadio.Group
            name={'BUSINESSTYPE'}
            width={'sm'}
            options={[
              { label: '买卖', value: 2 },
              { label: '租赁', value: 1 },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group title={'计算比例得方式'}>
          <ProFormRadio.Group
            width={'sm'}
            name={'CALPERCENTWAY'}
            options={[
              { label: '计算比例', value: 2 },
              { label: '默认比例', value: 1 },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProForm.Group
            title={'用途为车位或者法拍时是否产生维护人业绩'}
            labelLayout={'inline'}
          >
            <ProFormRadio.Group
              width={'sm'}
              name={'PARKINGORAUCTION'}
              options={[
                { label: '否', value: 2 },
                { label: '是', value: 1 },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group title={'维护人离职业绩处理'}>
            <ProFormRadio.Group
              name={'USERLEAVE'}
              options={[
                { label: '给成交人', value: 2 },
                { label: '充公', value: 1 },
              ]}
            />
          </ProForm.Group>
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            addonBefore={'房源维护总分'}
            name={'MAINTAINTOTAL'}
            style={{ width: '10', marginTop: 20 }}
          />
          <ProFormText
            addonBefore={'价格取值时间'}
            name={'COUNTSTANDARDHOURS'}
            style={{ width: '10', marginTop: 20 }}
          />
          <ProFormText
            width={'sm'}
            addonAfter={'%'}
            addonBefore={'房源分达标分业绩比例百分比'}
            name={'HOUSESCOREGETPERF'}
          />
          <ProFormText
            width={'sm'}
            addonBefore={'溢价偏离度达标分业绩比例'}
            addonAfter={'%'}
            name={'BARGADEVGEARGETPERF'}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProForm.Group title={'是否启用房源维护总分'}>
            <ProFormRadio.Group
              name={'MAINTAINTOTALFLAG'}
              options={[
                { label: '否', value: 2 },
                { label: '是', value: 1 },
              ]}
            />
          </ProForm.Group>

          <ProForm.Group title={'是否启用计算基准价'}>
            <ProFormRadio.Group
              name={'COUNTSTANDARDFLAG'}
              options={[
                { label: '否', value: 2 },
                { label: '是', value: 1 },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group title={'是否启用 报成交前（）小时维护人'}>
            <ProFormRadio.Group
              name={'DEALBEFORE_TIMEFLAG'}
              options={[
                { label: '否', value: 2 },
                { label: '是', value: 1 },
              ]}
            />
          </ProForm.Group>
        </ProForm.Group>
        <ProForm.Group title={'议价偏离度考核'} style={{ marginTop: 20 }} />
        <ProFormRadio.Group
          name="BEGEARGEAR_SWITCH"
          options={[
            {
              label: '开',
              value: 1,
            },
            {
              label: '关',
              value: 0,
            },
          ]}
        />
        <ProFormCheckbox width={'xl'} name="ARGUEHOUSEINPUTFLAG">
          <ProFormText
            addonBefore={'议价偏离度生成维护业绩要满足房源录入时间实在成交'}
            addonAfter={'小时前'}
            name={'ARGUEHOUSEINPUT'}
          />
        </ProFormCheckbox>
        <ProFormText
          name={'COUNTSTANDARDHOURS'}
          addonBefore={'价格取值时间'}
          addonAfter={'小时以前'}
        />

        <ProForm.Group title={'计算基准'}>
          <ProFormRadio.Group
            name={'COUNTSTANDARD'}
            options={[
              {
                label: '低价',
                value: 1,
              },
              {
                label: '挂牌价',
                value: 2,
              },
            ]}
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Index;
