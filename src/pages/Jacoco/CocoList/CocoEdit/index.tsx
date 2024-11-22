import { addCocoConfig, queryModel } from '@/api/coco';
import { CocoConfig } from '@/pages/Jacoco/cocoType';
import {
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import React, { FC, useEffect, useState } from 'react';

interface SelfProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actionRef: React.MutableRefObject<any>;
}

const Index: FC<SelfProps> = ({ setOpen, actionRef }) => {
  const [form] = ProForm.useForm<CocoConfig>();
  const [moduleOption, setModuleOption] = useState<any>();
  const submit = async (values: any) => {
    // console.log(values);
    const body = await form.validateFields();
    const { code, msg } = await addCocoConfig(body);
    if (code === 0) {
      setOpen(false);
      actionRef.current?.reload();
    }
  };
  useEffect(() => {
    queryModel().then(({ data }) => {
      const opt = [];
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          // 检查是否是对象自身的属性
          opt.push({
            label: key,
            value: key,
          });
        }
      }
      setModuleOption(opt);
    });
  }, []);
  return (
    <ProCard>
      <ProForm layout={'vertical'} form={form} size={'large'} onFinish={submit}>
        <ProFormSelect
          width={'lg'}
          label={'所属模块'}
          name={'module_name'}
          options={moduleOption}
        />
        <ProFormSelect
          width={'lg'}
          label={'环境'}
          name={'env'}
          options={[
            { label: 'sit', value: 'sit' },
            { label: 'uat', value: 'uat' },
            { label: 'dev', value: 'dev' },
          ]}
          required={true}
          rules={[{ required: true, message: '环境必填' }]}
        />
        <ProFormText
          width={'lg'}
          label={'项目名称'}
          name={'project_name'}
          required={true}
          rules={[{ required: true, message: '项目名称必填' }]}
        />

        <ProFormText
          width={'lg'}
          label={'GIT地址'}
          name={'gitUrl'}
          placeholder={'http://gitlab.it.5i5j.com/xxx.git'}
          required={true}
          rules={[{ required: true, message: '项目名称必填' }]}
        />
        <ProFormText
          width={'lg'}
          label={'被测系统ip地址'}
          name={'ip'}
          required={true}
          rules={[{ required: true, message: '项目名称必填' }]}
        />
        <ProFormDigit
          width={'lg'}
          label={'jacocoAgent启动端口号'}
          name={'agent_port'}
          fieldProps={{ precision: 0 }}
          required={true}
          rules={[{ required: true, message: '项目名称必填' }]}
        />
        <ProFormText
          width={'lg'}
          label={'GIT原分支或标签'}
          name={'baseVersion'}
        />
        <ProFormText
          width={'lg'}
          label={'git现分支/标签'}
          name={'nowVersion'}
        />
        <ProFormText
          width={'lg'}
          required={true}
          rules={[{ required: true, message: '项目包名必填' }]}
          label={'包名列表'}
          placeholder={"['xxx.jar','xx.jar']"}
          name={'project_jar_name_list'}
        />
        <ProFormText
          width={'lg'}
          required={true}
          placeholder={"['/xx/xx/xx-api', '/xx/xx/xx-impl']"}
          rules={[{ required: true, message: '项目代码目录必填' }]}
          label={'项目代码目录列表'}
          name={'project_name_list'}
        />
        <ProFormText
          width={'lg'}
          label={'构建结果下载地址'}
          required={true}
          rules={[{ required: true, message: '构建结果下载地址必填' }]}
          name={'ftp_url'}
        />

        <ProFormText.Password width={'lg'} label={'企微密钥'} name={'wx_key'} />
      </ProForm>
    </ProCard>
  );
};

export default Index;
