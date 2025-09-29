import { addDepartTags, queryDepartTags } from '@/api/base/depart';
import { IDepartTag } from '@/pages/User/Depart/depart';
import { PlusOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Flex, Input, InputRef, Tag, Tooltip } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};
const tagPlusStyle: React.CSSProperties = {
  height: 22,
  borderStyle: 'dashed',
};

interface Props {
  depart_id: number;
}

const DepartTags: FC<Props> = ({ depart_id }) => {
  const [departTags, setDepartTags] = useState<IDepartTag[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    if (!depart_id) return;
    queryDepartTags(depart_id).then(({ code, data }) => {
      if (code === 0) {
        setDepartTags(data);
      }
    });
  }, [depart_id, reload]);

  const addNewTag = async (tagName: string) => {
    const { code } = await addDepartTags({
      tag_name: tagName,
      depart_id: depart_id,
    });
    if (code === 0) {
      setReload(reload + 1);
    }
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = async () => {
    if (inputValue) {
      await addNewTag(inputValue);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...departTags];
    newTags[editInputIndex] = editInputValue;
    setDepartTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };
  const handleClose = (removedTag: IDepartTag) => {
    const newTags = departTags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setDepartTags(newTags);
  };

  return (
    <ProCard>
      <Flex gap="4px 0" wrap>
        {departTags?.map((tag, index) => {
          if (editInputIndex === index) {
            return <Input />;
          }
          const isLongTag = tag.tag_name.length > 20;
          return (
            <Tooltip title={tag} key={tag.tag_name}>
              <Tag
                key={tag.tag_name}
                closable={index !== 0}
                style={{ userSelect: 'none' }}
                onClose={() => handleClose(tag)}
              >
                <span
                  onDoubleClick={(e) => {
                    if (index !== 0) {
                      // setEditInputIndex(index);
                      // setEditInputValue(tag.tag_name);
                      e.preventDefault();
                    }
                  }}
                >
                  {isLongTag ? `${tag.tag_name.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            </Tooltip>
          );
        })}

        {/*// {departTags?.map((tag, index) => {*/}
        {/*//   if (editInputIndex === index) {*/}
        {/*//     return (*/}
        {/*//       <Input*/}
        {/*//         ref={editInputRef}*/}
        {/*//         style={tagInputStyle}*/}
        {/*//         key={tag.tag_name}*/}
        {/*//         size="small"*/}
        {/*//         value={editInputValue}*/}
        {/*//         // onChange={handleEditInputChange}*/}
        {/*//         // onBlur={handleEditInputConfirm}*/}
        {/*//         // onPressEnter={handleEditInputConfirm}*/}
        {/*//       />*/}
        {/*//     );*/}
        {/*//   }*/}
        {/*//   const isLongTag = tag.tag_name.length > 20;*/}
        {/*//   const tagElem = (*/}
        {/*//     <Tag*/}
        {/*//       key={tag.tag_name}*/}
        {/*//       closable={index !== 0}*/}
        {/*//       style={{ userSelect: 'none' }}*/}
        {/*//       onClose={() => handleClose(tag)}*/}
        {/*//     >*/}
        {/*//     <span*/}
        {/*//       onDoubleClick={(e) => {*/}
        {/*//         if (index !== 0) {*/}
        {/*//           setEditInputIndex(index);*/}
        {/*//           setEditInputValue(tag.tag_name);*/}
        {/*//           e.preventDefault();*/}
        {/*//         }*/}
        {/*//       }}*/}
        {/*//     >*/}
        {/*//       {isLongTag ? `${tag.tag_name.slice(0, 20)}...` : tag}*/}
        {/*//     </span>*/}
        {/*//     </Tag>*/}
        {/*//   );*/}
        {/*//   return isLongTag ? (*/}
        {/*//     <Tooltip title={tag} key={tag.tag_name}>*/}
        {/*//       {tagElem}*/}
        {/*//     </Tooltip>*/}
        {/*//   ) : (*/}
        {/*//     tagElem*/}
        {/*//   );*/}
        {/*// })}*/}
        {inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            value={inputValue}
            onChange={handleInputChange}
            // onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
            标签
          </Tag>
        )}
      </Flex>
    </ProCard>
  );
};

export default DepartTags;
