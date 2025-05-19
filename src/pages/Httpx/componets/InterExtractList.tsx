import { ExtraOpt } from '@/pages/Httpx/componets/assertEnum';
import { FormEditableOnValueChange } from '@/pages/Httpx/componets/FormEditableOnValueChange';
import { IInterfaceAPI } from '@/pages/Httpx/types';
import {
  CopyTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  SaveTwoTone,
} from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { FormInstance, Space, Tag, Tooltip } from 'antd';
import { FC, useState } from 'react';

const EXTRACT_TARGET_OPTION = [
  { label: 'ResponseJson', value: 6 },
  { label: 'ResponseText', value: 8 },
  { label: 'ResponseHeader', value: 7 },
  { label: 'RequestCookie', value: 9 },
];

interface ISelfProps {
  form: FormInstance<IInterfaceAPI>;
}

const InterExtractList: FC<ISelfProps> = ({ form }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // 当前正在编辑的行索引

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };
  const save = async () => {
    console.log('===========');
    try {
      await form.validateFields();
    } catch (e) {
      return;
    }
    setEditingIndex(null); // 取消编辑
    await FormEditableOnValueChange(form, 'extracts');
  };

  return (
    <>
      <ProFormList
        name={'extracts'}
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
            bordered
            headerBordered
            title={
              <Tag
                color={'orange-inverse'}
                hidden={editingIndex === index} // 编辑时隐藏
              >
                {record?.key || '变量'}
              </Tag>
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
        alwaysShowItemLabel
      >
        {(_, index, list) => {
          return (
            <>
              <ProFormText
                name={'key'}
                label={'变量名'}
                width={'md'}
                rules={[{ required: true, message: '请输入变量名' }]}
                placeholder={'请输入变量名'}
                fieldProps={{
                  disabled: editingIndex !== index,
                }}
              />
              <ProForm.Group>
                <ProFormSelect
                  name={'target'}
                  label={'提取目标'}
                  noStyle={true}
                  width={'lg'}
                  placeholder={'请选择提取目标'}
                  options={EXTRACT_TARGET_OPTION}
                  required
                  fieldProps={{
                    disabled: editingIndex !== index,
                  }}
                  rules={[{ required: true, message: '请选择提取目标' }]}
                />
                <ProFormSelect
                  width="md"
                  noStyle={true}
                  allowClear={false}
                  placeholder={'请选择提取方式'}
                  name="extraOpt"
                  valueEnum={ExtraOpt}
                  disabled={editingIndex !== index} // 根据编辑状态禁用该项
                />
                <ProFormTextArea
                  fieldProps={{
                    rows: 1,
                  }}
                  placeholder={'输入提取语法 如$.name'}
                  disabled={editingIndex !== index} // 根据编辑状态禁用该项
                  name={'value'}
                  width={'lg'}
                />
              </ProForm.Group>
            </>
          );
        }}
      </ProFormList>
    </>
  );
};

export default InterExtractList;
