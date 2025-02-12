import {
  getInterfaceGroup,
  insertInterfaceGroup,
  updateInterfaceGroup,
} from '@/api/inter/interGroup';
import { IInterfaceGroup } from '@/pages/Httpx/types';
import { useParams } from '@@/exports';
import {
  ProCard,
  ProForm,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { history } from 'umi';

const Index = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [groupForm] = Form.useForm<IInterfaceGroup>();
  const [currentStatus, setCurrentStatus] = useState(1);

  useEffect(() => {
    if (groupId) {
      getInterfaceGroup(groupId).then(async ({ code, data }) => {
        if (code === 0) {
          groupForm.setFieldsValue(data);
          setCurrentStatus(1);
        }
      });
    } else {
      setCurrentStatus(2);
    }
  }, [groupId]);

  const saveBaseInfo = async () => {
    const values = await groupForm.validateFields();
    if (groupId) {
      const { code, msg } = await updateInterfaceGroup({
        ...values,
        id: parseInt(groupId),
      });
      if (code === 0) {
        message.success(msg);
      }
    } else {
      const { code, data } = await insertInterfaceGroup(values);
      if (code === 0) {
        history.push(`/interface/group/detail/groupId=${data.id}`);
      }
    }
  };

  const DetailExtra: FC<{ currentStatus: number }> = ({ currentStatus }) => {
    switch (currentStatus) {
      case 1:
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type={'primary'}
              style={{ marginLeft: 10 }}
              onClick={() => setCurrentStatus(3)}
            >
              Edit
            </Button>
          </div>
        );
      case 2:
        return (
          <Button onClick={saveBaseInfo} type={'primary'}>
            Save
          </Button>
        );
      case 3:
        return (
          <>
            <Button onClick={saveBaseInfo} type={'primary'}>
              Save
            </Button>
            <Button
              style={{ marginLeft: 5 }}
              onClick={() => setCurrentStatus(1)}
            >
              Cancel
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ProCard split={'horizontal'}>
      <ProCard
        extra={<DetailExtra currentStatus={currentStatus}></DetailExtra>}
      >
        <ProForm
          disabled={currentStatus === 1}
          layout={'horizontal'}
          submitter={false}
          form={groupForm}
        >
          <ProFormGroup title={'基础信息'}>
            <ProFormText
              width={'lg'}
              name={'name'}
              label={'组名'}
              required={true}
              rules={[{ required: true, message: '组名必填' }]}
            />
            <ProFormTextArea
              width={'lg'}
              name={'description'}
              label={'描述'}
              required={true}
              rules={[{ required: true, message: '组描述必填' }]}
            />
          </ProFormGroup>
        </ProForm>
      </ProCard>
      <ProCard></ProCard>
    </ProCard>
  );
};

export default Index;
