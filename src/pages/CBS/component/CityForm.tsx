import { ICityList } from '@/api';
import { queryCityList } from '@/api/cbsAPI/cbs';
import { ProFormSelect } from '@ant-design/pro-components';
import { FormInstance } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  form: FormInstance;
  setSelectCity: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedCityId: React.Dispatch<React.SetStateAction<number | undefined>>;
  tag?: string;
}

const CityForm: FC<SelfProps> = (props) => {
  const { form, tag, setSelectedCityId, setSelectCity } = props;
  const [cityList, setCityList] = useState<ICityList[]>();
  const [currentCity, setCurrentCity] = useState<string>();

  /**
   *根据城市名称获取城市ID
   */
  const getCityIdByCityName = (): number | undefined => {
    return cityList?.find((item) => item.value === currentCity)?.id;
  };
  useEffect(() => {
    const fetchQueryCity = async () => {
      const { code, data } = await queryCityList();
      if (code === 0) {
        return data;
      }
    };
    fetchQueryCity().then((data) => {
      if (data) {
        if (tag && tag === 'lease') {
          const newData = data.filter((item: ICityList) => {
            const temp = ['hangzhou', 'beijing', 'tianjin', 'nanjing'];
            if (temp.includes(item.value)) {
              return item;
            }
          });
          setCityList(newData);
          setSelectCity(newData[0]?.value); // 设置默认值为第一个城市的 value
          setCurrentCity(newData[0]?.value); // 设置默认值为第一个城市的 value
        } else if (tag && tag === 'ltc') {
          const newData = data.filter((item: ICityList) => {
            const temp = ['hangzhou'];
            if (temp.includes(item.value)) {
              return item;
            }
          });
          setCityList(newData);
          setSelectCity(newData[0]?.value); // 设置默认值为第一个城市的 value
          setCurrentCity(newData[0]?.value); // 设置默认值为第一个城市的 value
        } else {
          setCityList(data);
          setSelectCity(data[0]?.value); // 设置默认值为第一个城市的 value
          setCurrentCity(data[0]?.value); // 设置默认值为第一个城市的 value
        }
      }
    });
  }, []);

  useEffect(() => {
    if (currentCity) {
      const cityId = getCityIdByCityName();
      if (cityId) {
        setSelectedCityId(cityId);
      }
    }
  }, [currentCity]);

  return (
    <>
      {currentCity && (
        <ProFormSelect
          required
          width={'md'}
          name={'city'}
          label={'目标城市'}
          options={cityList}
          initialValue={currentCity || undefined}
          fieldProps={{
            onSelect: (value: string) => {
              console.log(value);
              setCurrentCity(value);
              setSelectCity(value);
              form.setFieldValue('city', value);
            },
          }}
        />
      )}
    </>
  );
};

export default CityForm;
