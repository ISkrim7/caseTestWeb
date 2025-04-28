import { Space, Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import Avatar from './AvatarDropdown';

type ThemeType = 'realDark' | 'light';

interface SelfProps {
  coll: boolean;
  currentTheme: string;
  toggleTheme: (t: ThemeType) => void;
}

const GlobalHeaderRight: FC<SelfProps> = ({
  coll,
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
    <Space direction={!coll ? 'horizontal' : 'vertical'}>
      <Avatar coll={coll} />
      {!coll && (
        <Switch
          checked={switchChecked} // 使用 controlled component
          style={{ marginLeft: 10 }}
          checkedChildren={'🌛'}
          unCheckedChildren={'🌞'}
          onChange={handleThemeChange}
        />
      )}
    </Space>
  );
};

export default GlobalHeaderRight;
