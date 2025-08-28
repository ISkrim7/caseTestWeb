import { AutoComplete, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

interface Props {
  tags?: { value: string }[];
  onTagChange: (tag: string) => void;
  initialTag?: string;
}

const TestCaseTagSet: FC<Props> = ({ tags, onTagChange, initialTag }) => {
  const [tagVisible, setTagVisible] = useState(false);
  const [tag, setTag] = useState(initialTag || '');
  useEffect(() => {
    if (initialTag) {
      setTag(initialTag);
      setTagVisible(false);
    } else {
      setTagVisible(true);
    }
  }, [initialTag]);
  const handleTagChange = (value: string) => {
    if (value) {
      setTag(value);
      onTagChange(value); // 把标签值传递给父组件
    }
  };

  const handleBlur = () => {
    if (tag) {
      setTag(tag);
      onTagChange(tag); // 更新父组件的状态
      setTagVisible(false);
    }
  };
  return (
    <>
      {tagVisible ? (
        <AutoComplete
          placeholder="请输入标签"
          style={{ width: 200 }}
          options={tags}
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={handleTagChange}
          onBlur={handleBlur}
        />
      ) : (
        <Tag
          onClick={() => setTagVisible(true)}
          style={{
            textOverflow: 'ellipsis',
            textAlign: 'center',
          }}
          color="#2db7f5"
        >
          {tag && tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
        </Tag>
      )}
    </>
  );
};

export default TestCaseTagSet;
