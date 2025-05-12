import { ExtraOpt } from '@/pages/Httpx/componets/assertEnum';
import {
  FormListActionType,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';

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
  const actionRef = useRef<FormListActionType<{}>>();
  const onSubmit = async () => {
    const values = await assertForm.validateFields();
    console.log(values);
  };

  useEffect(() => {
    assertForm.setFieldsValue({
      asserts: data,
    });
  }, [data]);

  return (
    <ProCard extra={<Button onClick={onSubmit}>提交</Button>}>
      <ProForm
        disabled={true}
        form={assertForm}
        layout="horizontal"
        submitter={false}
      >
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
              style={{ marginBlockEnd: 8 }}
              title={`断言_${index + 1}`}
              extra={action}
              bodyStyle={{ paddingBlockEnd: 0 }}
            >
              {listDom}
            </ProCard>
          )}
          creatorRecord={{
            assert_target: 'body',
            assert_extract: ExtraOpt.jmespath.text,
            assert_opt: '==',
          }}
          initialValue={[
            {
              assert_target: 'body',
              assert_extract: ExtraOpt.jmespath.text,
              assert_opt: '==',
            },
          ]}
        >
          <ProFormGroup>
            <ProFormSelect
              name={'assert_target'}
              label={'断言内容'}
              allowClear={false}
              width={'lg'}
              valueEnum={{
                status_code: '状态码',
                body: 'Response Json',
                header: 'Response Header',
                text: 'Response Text',
              }}
            />
            <ProFormSelect
              width="md"
              allowClear={false}
              name="assert_extract"
              label="提取"
              valueEnum={ExtraOpt}
            />
          </ProFormGroup>
          <ProFormDependency name={['assert_target']}>
            {({ assert_target }) => {
              return (
                <ProFormGroup>
                  <ProFormText
                    hidden={assert_target === 'status_code'}
                    name="assert_text"
                    label="表达式"
                    placeholder="请输入表达式"
                  />
                  <ProFormSelect
                    label={assert_target === 'status_code' ? '表达式' : ''}
                    width="md"
                    allowClear={false}
                    name="assert_opt"
                    valueEnum={AssertOpt}
                  />
                  <ProFormText
                    width="md"
                    name="assert_value"
                    placeholder="请输入比较置，可使用变量{{变量名}}"
                    required
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
        </ProFormList>
      </ProForm>
    </ProCard>
  );
};

export default Demo;
