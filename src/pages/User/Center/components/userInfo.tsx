import { uploadAvatar } from '@/api/base';
import { UploadOutlined } from '@ant-design/icons';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Button, Image, message, Upload, UploadProps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const Avatar = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [fileList, setFileList] = useState([]);
  const [avatarUpdate, setAvatarUpdate] = useState<number>(0);

  const upload: UploadProps = {
    name: 'file',
    showUploadList: false,
    onRemove: (file: any) => {
      const index = fileList.indexOf(file as never);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    customRequest: async (fileData) => {
      const form = new FormData();
      form.append('avatar', fileData.file);
      const res = await uploadAvatar(form);
      if (res.code === 0) {
        message.success(res.msg);
        setAvatarUpdate(avatarUpdate + 1);
        return;
      }
    },
  };
  useEffect(() => {
    initialState?.fetchUserInfo?.();
  }, [avatarUpdate]);

  return (
    <>
      <Image src={currentUser?.avatar} alt="avatar" />
      <Upload {...upload}>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );
};

const UserInfo = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};

  return (
    <ProCard split={'vertical'}>
      <ProCard>
        <ProDescriptions bordered column={1}>
          <ProDescriptions.Item label={'姓名'}>
            {currentUser?.username}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            valueType={'text'}
            labelStyle={{ width: '30%' }}
            label={'电话'}
          >
            {currentUser?.phone}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            valueType={'text'}
            labelStyle={{ width: '30%' }}
            label={'邮箱'}
          >
            {currentUser?.email}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={'所属部门'}
            labelStyle={{ width: '30%' }}
            valueType={'text'}
          >
            {currentUser?.departmentName}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={'标签'}
            labelStyle={{ width: '30%' }}
            valueType={'text'}
          >
            {currentUser?.tagName}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
      <ProCard>
        <Avatar />
      </ProCard>
    </ProCard>
  );
};

export default UserInfo;
