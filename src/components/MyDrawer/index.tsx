import { Drawer } from 'antd';
import { FC } from 'react';

interface SelfProps {
  name: string | JSX.Element;
  open: any;
  setOpen: any;
  width?: string | null;
  extra?: any;
  onClose?: () => void;
  height?: string | null;
}

const Index: FC<SelfProps> = (props) => {
  const { open, setOpen, name, height, width, onClose } = props;

  return (
    <Drawer
      styles={{ body: { padding: 0 } }}
      open={open}
      destroyOnClose={true}
      height={height || 'auto'}
      width={width || '65%'}
      title={name}
      extra={props.extra}
      onClose={onClose || (() => setOpen(false))}
      maskClosable={false}
    >
      {props.children}
    </Drawer>
  );
};

export default Index;
