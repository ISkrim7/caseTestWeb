import { IObjGet } from '@/api';
import { modifySubmit } from '@/api/cbsAPI/modifyAPI';
import TitleName from '@/components/TitleName';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useEffect, useState } from 'react';

interface IModify {
  data_info: string;
  modify_type: string;
  comp_name: string;
  dest_info?: string;
}

const TargetEnum = [2, 3, 4, 6, 8, 10];
const ModifyTypeEnum = [
  { label: '人员离职', value: 1 },
  { label: '人员转岗', value: 2 },
  { label: '人员转店', value: 3 },
  { label: '人员业务线变更', value: 4 },
  { label: '店组换实体店', value: 6 },
  { label: '店组换组团', value: 10 },
  { label: '组团换大区', value: 8 },
  { label: '组团关闭', value: 7 },
  { label: '店组关闭', value: 5 },
  { label: '大区关闭', value: 9 },
];
const comEnum = [
  { label: '北京公司', value: '北京公司' },
  { label: '上海公司', value: '上海公司' },
  { label: '杭州公司', value: '杭州公司' },
  { label: '太原公司', value: '太原公司' },
  { label: '郑州公司', value: '郑州公司' },
  { label: '天津公司', value: '天津公司' },
  { label: '无锡公司', value: '无锡公司' },
  { label: '南京公司', value: '南京公司' },
  { label: '苏州公司', value: '苏州公司' },
];
const ModifyLabel: IObjGet = {
  3: '调整后的部门名称',
  2: '调整后的岗位名称',
  4: '调整后的业务线名称',
  10: '调整后店组所在组团名称',
  6: '调整后店组所在实体店名称',
  8: '调整后组团所在大区的名称',
};
const Modify = () => {
  const [ModifyForm] = Form.useForm<IModify>();
  const [modifyType, setModifyType] = useState<number>();
  const [modifyLabel, setModifyLabel] = useState<string>();
  const onFinish = async () => {
    const formData = await ModifyForm.validateFields();
    console.log(formData);
    const { code, msg } = await modifySubmit(formData);
    if (code === 0) {
      message.success(msg);
    }
  };

  useEffect(() => {
    if (modifyType) {
      if ([5, 7, 9].includes(modifyType)) {
        message.warning('关闭操作不可逆，请谨慎操作！');
      }
    }
  }, [modifyType]);

  return (
    <ProCard
      headerBordered
      title={TitleName('基础异动')}
      style={{
        borderRadius: '40px',
        marginBottom: '16px',
        marginTop: '16px',
      }}
      bordered
      hoverable
      subTitle={
        <a
          style={{ marginLeft: 20, marginTop: 10 }}
          onClick={() => {
            window.open(
              'https://doc.weixin.qq.com/doc/w3_ASsAwAYzANQ6gjPeZGNTQy1YvGJ9l?scode=APwAJgfkAHA0rjwuyJASsAwAYzANQ&journal_source=chat',
            );
          }}
        >
          使用说明文档
        </a>
      }
    >
      <ProForm form={ModifyForm} onFinish={onFinish}>
        <ProForm.Group>
          <ProFormText
            name="data_info"
            width={'md'}
            label={'员工编号&部门名称'}
            required
            rules={[{ required: true, message: '员工编号&部门名称' }]}
          />
          <ProFormSelect
            name="comp_name"
            width={'md'}
            label={'所属公司'}
            options={comEnum}
            required
            rules={[{ required: true, message: '目标公司必选' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            name="modify_type"
            width={'md'}
            label={'异动类型'}
            required
            options={ModifyTypeEnum}
            rules={[{ required: true, message: '异动类型必选' }]}
            fieldProps={{
              onChange: (value: number) => {
                setModifyType(value);
                setModifyLabel(ModifyLabel[value]);
              },
            }}
          />

          {modifyType && TargetEnum.includes(modifyType) ? (
            <ProFormText
              name="dest_info"
              width={'md'}
              label={modifyLabel}
              required
            />
          ) : null}
        </ProForm.Group>
      </ProForm>
    </ProCard>
  );
};

export default Modify;
