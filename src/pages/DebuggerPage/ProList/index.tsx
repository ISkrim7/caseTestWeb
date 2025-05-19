import { ExtraOpt } from '@/pages/Httpx/componets/assertEnum';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Space } from 'antd';
import { FC, useEffect, useState } from 'react';

interface ISelfProps {
  apiId: number;
}

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
const data = [
  {
    assert_target: 'body',
    assert_extract: 'jsonpath',
    assert_opt: '==',
    assert_text: '$.code',
    assert_value: 'hello',
  },
  {
    assert_target: 'header',
    assert_extract: 'jmespath',
    assert_opt: '==',
    assert_text: '$.msg',
    assert_value: 12313231,
  },
];

const Demo: FC<ISelfProps> = ({ apiId = 42 }) => {
  const [assertForm] = ProForm.useForm();
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // 当前正在编辑的行索引

  const onSubmit = async () => {
    const values = await assertForm.validateFields();
    console.log(values);
  };

  useEffect(() => {
    assertForm.setFieldsValue({
      asserts: data,
    });
  }, [data]);
  // 处理编辑按钮的点击
  const handleEdit = (index: number) => {
    console.log('hand', index);
    setEditingIndex(index);
  };
  return (
    <>
      <ProFormList
        name="asserts"
        creatorButtonProps={{
          creatorButtonText: '添加断言',
        }}
        copyIconProps={{
          tooltipText: '复制当前行',
        }}
        itemRender={({ listDom, action }, { record, index }) => (
          <ProCard
            bordered
            title={`断言_${index + 1}`}
            extra={
              <Space>
                {editingIndex === index ? (
                  <SaveOutlined
                    disabled={false}
                    onClick={() => {
                      setEditingIndex(null); // 取消编辑
                      // 在此保存已编辑的数据，或者进行其他处理
                    }}
                  />
                ) : (
                  <EditOutlined
                    disabled={false}
                    onClick={() => handleEdit(index)}
                  />
                )}
                {action}
              </Space>
            }
          >
            {listDom}
          </ProCard>
        )}
        creatorRecord={{
          assert_target: AssertTarget.body.text,
          assert_extract: ExtraOpt.jmespath.text,
          assert_opt: '==',
        }}
        initialValue={[
          {
            assert_target: AssertTarget.body.text,
            assert_extract: ExtraOpt.jmespath.text,
            assert_opt: '==',
          },
        ]}
        alwaysShowItemLabel
      >
        {(f, index, action) => {
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
                <ProFormSelect
                  width="md"
                  allowClear={false}
                  name="assert_extract"
                  label="提取"
                  valueEnum={ExtraOpt}
                  disabled={editingIndex !== index} // 根据编辑状态禁用该项
                />
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

export default Demo;
