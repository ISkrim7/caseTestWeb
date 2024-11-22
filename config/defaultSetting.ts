import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  https?: boolean;
  logo?: string;
  apiUrl?: string;
} = {
  // 修改左上角的 logo
  logo: '/icons/5i5j.png',
  colorPrimary: '#1677ff',
  iconfontUrl: '/icons/5i5j.png',
  // 设置标题的 title
  title: '爱家测试平台',
  layout: 'side',
  menu: {
    type: 'sub',
  },
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  splitMenus: false,
};

export default Settings;
