import { ExtraOpt } from '@/pages/Httpx/componets/assertEnum';
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
  ProForm,
  ProFormDependency,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { FormInstance, Space, Tag, Tooltip } from 'antd';
import { FC, useState } from 'react';

const AssertOpt = {
  '==': {
    text: '等于',
  },
  '!=': {
    text: '不等',
  },
  '>': {
    text: '大于',
  },
  '<': {
    text: '小于',
  },
  '>=': {
    text: '大于等于',
  },
  '<=': {
    text: '小于等于',
  },
  in: {
    text: '存在',
  },
  notIn: {
    text: '不存在',
  },
};
const AssertTarget = {
  status_code: {
    text: '状态码',
  },
  body: {
    text: 'Response Json',
  },
  header: {
    text: 'Response Header',
  },
  text: {
    text: 'Response Text',
  },
};

interface ISelfProps {
  form: FormInstance<IInterfaceAPI>;
}

const InterAssertList: FC<ISelfProps> = ({ form }) => {
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
    await FormEditableOnValueChange(form, 'asserts');
  };
  return (
    <>
      <ProFormList
        name="asserts"
        creatorButtonProps={{
          creatorButtonText: '添加断言',
        }}
        onAfterAdd={async (_, index) => {
          if (index) {
            setEditingIndex(index);
          }
        }}
        onAfterRemove={async () => {
          await FormEditableOnValueChange(form, 'asserts');
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
            assert_switch: true,
            assert_text: undefined,
            assert_extract: ExtraOpt.jmespath.text,
            assert_opt: '==',
          };
        }}
        alwaysShowItemLabel
      >
        {(_, index, __) => {
          return (
            <>
              <ProForm.Group>
                <ProFormSelect
                  name={'assert_target'}
                  label={'断言内容'}
                  allowClear={false}
                  width={'lg'}
                  valueEnum={AssertTarget}
                  disabled={editingIndex !== index} // 根据编辑状态禁用该项
                />
                <ProFormDependency name={['assert_target']}>
                  {({ assert_target }) => {
                    return (
                      <ProFormSelect
                        hidden={assert_target === 'status_code'}
                        width="md"
                        allowClear={false}
                        name="assert_extract"
                        label="提取"
                        valueEnum={ExtraOpt}
                        disabled={editingIndex !== index} // 根据编辑状态禁用该项
                      />
                    );
                  }}
                </ProFormDependency>
              </ProForm.Group>
              <ProFormDependency name={['assert_target']}>
                {({ assert_target }) => {
                  return (
                    <ProFormGroup>
                      <ProFormText
                        noStyle={true}
                        hidden={assert_target === 'status_code'}
                        name="assert_text"
                        label="表达式"
                        placeholder="请输入表达式"
                        disabled={editingIndex !== index} // 根据编辑状态禁用该项
                      />
                      <ProFormSelect
                        width="md"
                        allowClear={false}
                        name="assert_opt"
                        valueEnum={AssertOpt}
                        disabled={editingIndex !== index} // 根据编辑状态禁用该项
                      />
                      <ProFormText
                        width="md"
                        name="assert_value"
                        placeholder="请输入比较置，可使用变量{{变量名}}"
                        required
                        disabled={editingIndex !== index} // 根据编辑状态禁用该项
                        rules={[
                          {
                            required: true,
                            message: '请输入比较值',
                          },
                        ]}
                      />
                    </ProFormGroup>
                  );
                }}
              </ProFormDependency>
            </>
          );
        }}
      </ProFormList>
    </>
  );
};

export default InterAssertList;
