import { GoogleSquareFilled, SearchOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Popover, Select, Typography } from 'antd';
import { useState } from 'react';

const { Text, Paragraph, Title } = Typography;

const variables = [
  {
    label: (
      <button // 使span元素可聚焦
        onFocus={(event) => {
          console.log('=====', event);
        }}
      >
        <GoogleSquareFilled style={{ color: 'blue' }} />
        {'$telephone1'}
      </button>
    ),
    value: '{{$telephone1}}',
  },
  {
    label: (
      <span>
        <GoogleSquareFilled style={{ color: 'blue' }} />
        {'$telephone2'}
      </span>
    ),
    value: '{{$telephone2}}',
  },
  {
    label: (
      <span>
        <GoogleSquareFilled style={{ color: 'blue' }} />
        {'$telephone3'}
      </span>
    ),
    value: '{{$telephone3}}',
  },
];
const ApiVariableFunc = () => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const Content = (
    <>
      <Select
        allowClear
        showSearch
        onChange={(value) => {
          console.log(value);
        }}
        style={{ width: 500 }}
        options={variables}
        dropdownRender={(menu) => (
          <>
            <ProCard split={'vertical'}>
              <ProCard bodyStyle={{ padding: 0 }}>{menu}</ProCard>
              <ProCard bodyStyle={{ padding: 0 }}>das</ProCard>
            </ProCard>
          </>
        )}
      />
      ;
    </>
  );

  return (
    <>
      <Popover
        style={{ width: '50px', height: '90px' }}
        content={Content}
        title="Title"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <SearchOutlined />
      </Popover>
    </>
  );
};
export default ApiVariableFunc;
