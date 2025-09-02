import { ITestCase } from '@/pages/CaseHub/type';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import { Button, Divider, Input, InputRef, Space, Tag } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';

interface Props {
  tags?: { label: string; value: string }[];
  setTags: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  testcaseData?: ITestCase;
}

const CaseTagSelect: FC<Props> = ({ tags, setTags, testcaseData }) => {
  const inputRef = useRef<InputRef>(null);
  const [currentTag, setCurrentTag] = useState<string>();
  const [tagVisible, setTagVisible] = useState<boolean>(false);
  const [tagValue, setTagValue] = useState<string>();
  useEffect(() => {
    if (testcaseData?.case_tag) {
      setTagVisible(true);
      setTagValue(testcaseData?.case_tag);
    }
  }, [testcaseData]);
  return (
    <>
      {tagVisible ? (
        <Tag
          onClick={() => setTagVisible(false)}
          style={{
            textOverflow: 'ellipsis',
            textAlign: 'center',
          }}
          color="#2db7f5"
        >
          {tagValue && tagValue.length > 10
            ? `${tagValue.slice(0, 10)}...`
            : tagValue}
        </Tag>
      ) : (
        <ProFormSelect
          noStyle
          required
          rules={[{ required: true, message: '请选择标签' }]}
          allowClear
          width={'md'}
          name={'case_tag'}
          options={tags}
          fieldProps={{
            dropdownRender: (menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder="自定义标签"
                    ref={inputRef}
                    value={currentTag}
                    onChange={(e) => {
                      setCurrentTag(e.target.value);
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentTag) {
                        setTags((t) => [
                          ...t,
                          { label: currentTag, value: currentTag },
                        ]);
                        setTimeout(() => {
                          inputRef.current?.focus();
                        }, 0);
                      }
                    }}
                  >
                    添加
                  </Button>
                </Space>
              </>
            ),
            onChange: (value: string) => {
              setTagValue(value);
              setTagVisible(true);
            },
            onBlur: () => {
              setTagVisible(true);
            },
          }}
        />
      )}
    </>
  );
};

export default CaseTagSelect;
