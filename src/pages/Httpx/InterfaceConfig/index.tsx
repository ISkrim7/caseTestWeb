import MyTabs from '@/components/MyTabs';
import InterApiHeaders from '@/pages/Httpx/InterfaceConfig/InterApiHeaders';
import InterApiMockConfig from '@/pages/Httpx/InterfaceConfig/InterApiMockConfig';
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
    {
      key: '3',
      label: `MOCK匹配`,
      children: <InterApiMockConfig />,
    },
  ];
  return <MyTabs tabPosition={'top'} defaultActiveKey={'1'} items={items} />;
};

export default Index;
