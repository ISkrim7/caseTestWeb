import { Space, Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import Avatar from './AvatarDropdown';

type ThemeType = 'realDark' | 'light';

interface SelfProps {
  collapsed: boolean;
  currentTheme: string;
  toggleTheme: (t: ThemeType) => void;
}

const GlobalHeaderRight: FC<SelfProps> = ({
  collapsed,
  currentTheme,
  toggleTheme,
}) => {
  // 根据当前主题初始化 Switch 状态
  const [switchChecked, setSwitchChecked] = useState<boolean>(
    currentTheme === 'realDark',
  );

  // 当外部 currentTheme 变化时同步更新 Switch 状态
  useEffect(() => {
    setSwitchChecked(currentTheme === 'realDark');
  }, [currentTheme]);

  const handleThemeChange = (checked: boolean) => {
    setSwitchChecked(checked);
    toggleTheme(checked ? 'realDark' : 'light');
  };
  return (
    <Space direction={!collapsed ? 'horizontal' : 'vertical'}>
      <Switch
        checked={switchChecked}
        style={{ marginLeft: 10 }}
        checkedChildren={'🌛'}
        unCheckedChildren={'🌞'}
        onChange={handleThemeChange}
      />
      <Avatar coll={collapsed} />
    </Space>
  );
};

export default GlobalHeaderRight;
