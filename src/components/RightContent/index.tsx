import { Space, Switch } from 'antd';
import { FC } from 'react';
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
  const onChange = (checked: boolean) => {
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
        style={{ marginLeft: 10 }}
        checkedChildren={'🌛'}
        unCheckedChildren={'🌞'}
        onChange={onChange}
      />
    </Space>
  );
};

export default GlobalHeaderRight;
