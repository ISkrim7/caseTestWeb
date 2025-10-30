import { IUser } from '@/api';
import { registerUser } from '@/api/base';
import { queryDepart, queryDepartTags } from '@/api/base/depart';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

interface selfProps {
  reload: Function | undefined;
}

// 定义类型
interface IDepart {
  id: number;
  name: string;
}

interface ITag {
  id: number;
  tag_name: string;
}

interface SelectOption {
  label: string;
  value: number | string;
}

// 自定义 Hook 用于部门数据
const useDepartments = () => {
  const [departments, setDepartments] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await queryDepart();
      const options = data.map((item: IDepart) => ({
        label: item.name,
        value: item.id,
      }));
      setDepartments(options);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, refetch: fetchDepartments };
};

// 自定义 Hook 用于标签数据
const useTags = (departId?: number) => {
  const [tags, setTags] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTags = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data } = await queryDepartTags(id);
      const options = data.map((item: ITag) => ({
        label: item.tag_name,
        value: item.tag_name,
      }));
      setTags(options);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (departId) {
      fetchTags(departId);
    } else {
      setTags([]);
    }
  }, [departId, fetchTags]);

  return { tags, loading };
};
const Index: React.FC<selfProps> = (props) => {
  let { reload } = props;

  const [currentDepart, setCurrentDepart] = useState<number>();

  const { departments, loading: departLoading } = useDepartments();
  const { tags, loading: tagsLoading } = useTags(currentDepart);

  const handleDepartChange = useCallback((value: number) => {
    console.log('Selected department:', value);
    setCurrentDepart(value);
  }, []);

  return (
    <ModalForm<IUser>
      title="添加用户"
      trigger={
        <Button type={'primary'}>
          <PlusOutlined />
          添加用户
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        onCancel: () => {
          console.log('oncancel');
        },
      }}
      onFinish={async (values: IUser) => {
        const res = await registerUser(values);
        if (res.code === 0) {
          message.success(res.msg);
          reload!(true);
          return true;
        }
      }}
    >
      <ProFormText
        name="username"
        label="用户名"
        placeholder="input username"
        required={true}
      />
      <ProFormText name="phone" label="电话" placeholder="input phone" />
      <ProFormSelect
        name="gender"
        label="性别"
        placeholder="input gender"
        valueEnum={{
          1: '男',
          0: '女',
        }}
      />
      <ProFormSelect
        name="depart_id"
        label="部门"
        placeholder="input department"
        options={departments}
        onChange={handleDepartChange}
        fieldProps={{
          allowClear: true,
        }}
        transform={(value) => {
          if (value) {
            const selectedDept = departments.find(
              (item) => item.value === value,
            );
            if (selectedDept) {
              // 同时设置 depart_id 和 depart_name
              return {
                depart_id: value,
                depart_name: selectedDept.label,
              };
            }
          }
          return { depart_id: value };
        }}
      />
      <ProFormSelect name="depart_name" hidden={true} />
      <ProFormSelect
        name="tagName"
        label="标签"
        placeholder="select tag"
        options={tags}
        disabled={!currentDepart}
        fieldProps={{
          allowClear: true,
        }}
      />
    </ModalForm>
  );
};

export default Index;
