import { Dropdown } from 'antd';
import type { DropDownProps } from 'antd/es/dropdown';
import React from 'react';

export type HeaderDropdownProps = {
  menu: React.ReactNode | (() => React.ReactNode) | any;
} & Omit<DropDownProps, 'overlay'>;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => <Dropdown placement={'bottomLeft'} {...restProps} />;

export default HeaderDropdown;
