import MyTabs from '@/components/MyTabs';
import InterApiHeaders from '@/pages/Httpx/InterfaceConfig/InterApiHeaders';
import InterApiVariables from '@/pages/Httpx/InterfaceConfig/InterApiVariables';

const Index = () => {
  const items = [
    {
      key: '1',
      label: `全局变量`,
      children: <InterApiVariables />,
    },
    {
      key: '2',
      label: `默认请求头`,
      children: <InterApiHeaders />,
    },
  ];
  return <MyTabs tabPosition={'top'} defaultActiveKey={'1'} items={items} />;
};

export default Index;
