import { getThem, setThem } from '@/utils/token';
import { Space, Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import Avatar from './AvatarDropdown';

interface SelfProps {
  initialState: any;
  setInitialState: any;
  coll: boolean;
}

const GlobalHeaderRight: FC<SelfProps> = ({
  coll,
  initialState,
  setInitialState,
}) => {
  const [defaultChecked, setDefaultChecked] = useState<boolean>(false); // true light false dark
  useEffect(() => {
    const them = getThem();
    console.log('====right========', them);
    if (them && them === 'realDark') {
      setDefaultChecked(true);
    } else {
      setDefaultChecked(false);
    }
  }, []);
  const onChange = (checked: boolean) => {
    console.log('====', checked);
    if (checked) {
      setThem('realDark');
    } else {
      setThem('light');
    }
    const newSettings = {
      ...initialState.settings,
      navTheme: checked ? 'realDark' : 'light',
    };
    setInitialState({ ...initialState, settings: newSettings });
  };
  return (
    <Space direction={!coll ? 'horizontal' : 'vertical'}>
      <Avatar coll={coll} />
      <Switch
        defaultChecked={defaultChecked}
        style={{ marginLeft: 10 }}
        checkedChildren={'🌛'}
        unCheckedChildren={'🌞'}
        onChange={onChange}
      />
    </Space>
  );
};

export default GlobalHeaderRight;
