import { FormEditableOnValueChange } from '@/pages/Httpx/componets/FormEditableOnValueChange';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import {
  CopyTwoTone,
  DeleteTwoTone,
  DownOutlined,
  EditTwoTone,
  RightOutlined,
  SaveTwoTone,
} from '@ant-design/icons';
import {
  ProCard,
  ProFormList,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { FormInstance, Space, Tag, Tooltip } from 'antd';
import { FC, useState } from 'react';

interface ISelfProps {
  form: FormInstance<IInterfaceAPI>;
}

const InterExtractList: FC<ISelfProps> = ({ form }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // 当前正在编辑的行索引

  // 处理编辑按钮的点击
  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };
  const save = async () => {
    try {
      await form.validateFields();
    } catch (e) {
      return;
    }
    setEditingIndex(null); // 取消编辑
    await FormEditableOnValueChange(form, 'extracts');
  };

  return (
    <div>
      <ProFormList
        name="extracts"
        creatorButtonProps={{
          creatorButtonText: '添加提取',
        }}
        onAfterAdd={async (_, index) => {
          if (index) {
            setEditingIndex(index);
          }
        }}
        onAfterRemove={async () => {
          await FormEditableOnValueChange(form, 'extracts');
        }}
        copyIconProps={{ tooltipText: '复制当前行', Icon: CopyTwoTone }}
        deleteIconProps={{
          Icon: DeleteTwoTone,
          tooltipText: '不需要这行了',
        }}
        itemRender={({ listDom, action }, { record, index }) => (
          <ProCard
            collapsible={true}
            collapsibleIconRender={({ collapsed }) => (
              <Space style={{ marginRight: 10 }}>
                <ProFormSwitch
                  noStyle
                  disabled={index !== editingIndex}
                  name={'assert_switch'}
                  style={{ color: 'orange' }}
                  initialValue={true}
                />
                {collapsed ? <RightOutlined /> : <DownOutlined />}
              </Space>
            )}
            bordered
            headerBordered
            title={
              <Tag
                color={'orange-inverse'}
                hidden={editingIndex === index} // 编辑时隐藏
              >
                {record?.assert_name || `断言_${index + 1}`}
              </Tag>
            }
            subTitle={
              editingIndex === index ? ( // 仅在编辑时显示
                <ProFormText
                  name={'assert_name'} // 关键：绑定到数组项
                  noStyle
                  placeholder={'请输入断言标题'}
                  allowClear={false}
                  required
                  initialValue={record?.assert_name || `断言_${index + 1}`}
                  fieldProps={{
                    variant: 'borderless',
                  }}
                />
              ) : null
            }
            extra={
              <Space>
                {editingIndex === index ? (
                  <Tooltip title="保存">
                    <SaveTwoTone
                      twoToneColor={'#c7920a'}
                      disabled={false}
                      onClick={save}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="编辑">
                    <EditTwoTone
                      disabled={false}
                      onClick={() => handleEdit(index)}
                    />
                  </Tooltip>
                )}
                {action}
              </Space>
            }
          >
            {listDom}
          </ProCard>
        )}
        creatorRecord={() => {
          return {
            // assert_switch: true,
            // assert_text: undefined,
            // assert_extract: ExtraOpt.jmespath.text,
            // assert_opt: '==',
          };
        }}
        alwaysShowItemLabel
      ></ProFormList>
    </div>
  );
};

export default InterExtractList;
