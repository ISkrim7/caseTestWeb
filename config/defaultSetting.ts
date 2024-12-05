import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  https?: boolean;
  logo?: string;
  apiUrl?: string;
} = {
  // 修改左上角的 logo
  colorPrimary: '#1677ff',
  // 设置标题的 title
  title: 'Case Hub',
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
