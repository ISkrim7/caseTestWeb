import { ICityList } from '@/api';
import { queryCityList } from '@/api/cbsAPI/cbs';
import Building from '@/pages/CBS/Structure/Config/Building';
import User from '@/pages/CBS/Structure/Config/User';
import { ProCard } from '@ant-design/pro-components';
import { Radio, Tabs } from 'antd';
import { useEffect, useState } from 'react';

const Index = () => {
  const [cityList, setCityList] = useState<ICityList[]>([]);
  const [currentCity, setCurrentCity] = useState<string>();
  const [tag, setTag] = useState('0');

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

    fetchQueryCity().then((res) => {
      if (res) {
        setCityList(res);
        setCurrentCity(res[0].value);
      }
    });
  }, []);

  return (
    <ProCard title={'构造配置'} style={{ height: 'auto' }}>
      {currentCity && (
        <>
          <Radio.Group
            defaultValue={currentCity}
            // @ts-ignore
            options={cityList}
            onChange={({ target }) => {
              setCurrentCity(target.value);
            }}
          />
          <Tabs
            defaultValue={tag}
            onChange={setTag}
            style={{ marginTop: '20px' }}
          >
            <Tabs.TabPane tab={'构造用户'} key={'0'}>
              <User
                currentCity={currentCity}
                cityOptions={cityList}
                getCityIdByCityName={getCityIdByCityName}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={'房源楼盘'} key={'1'}>
              <Building
                getCityIdByCityName={getCityIdByCityName}
                cityOptions={cityList}
                currentCity={currentCity}
              />
            </Tabs.TabPane>
          </Tabs>
        </>
      )}
    </ProCard>
  );
};

export default Index;
