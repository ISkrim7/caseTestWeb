import { ICityList, IObjGet, IUserList } from '@/api';
import {
  addUsersByCityId,
  delUsersById,
  queryUsersByCityId,
} from '@/api/cbsAPI/cbs';
import MyProTable from '@/components/Table/MyProTable';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProCard,
  ProColumns,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message, Tag } from 'antd';
import { FC, useEffect, useState } from 'react';

const TAGEnum: IObjGet = {
  0: '其他',
  1: '房源&合同等录入经纪人',
  2: '楼盘专员',
  3: '财务专员',
};
const TAGOption = [
  { label: '房源&合同等录入经纪人', value: 1 },
  { label: '楼盘专员', value: 2 },
  { label: '财务专员', value: 3 },
  { label: '其他人', value: 0 },
];

interface SelfProps {
  currentCity?: string;
  getCityIdByCityName: () => number | undefined;
  cityOptions: ICityList[];
}

const Index: FC<SelfProps> = ({
  currentCity,
  cityOptions,
  getCityIdByCityName,
}) => {
  const [userForm] = Form.useForm<{
    value: string;
    tag: number;
    cityId: number;
  }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDatasource, setUserDatasource] = useState<IUserList[]>([]);
  const [edit, setEdit] = useState<number>(0);

  /**
   * 获取用户列表
   */
  const fetchUsers = async () => {
    const cityID = getCityIdByCityName();
    if (cityID) {
      const { code, data } = await queryUsersByCityId({ cityId: cityID });
      return code === 0 ? data : [];
    } else return [];
  };

  useEffect(() => {
    if (currentCity) {
      fetchUsers().then((res) => {
        setUserDatasource(res);
      });
    }
  }, [currentCity, edit]);

  const UserColumns: ProColumns<IUserList>[] = [
    {
      title: '用户名称',
      dataIndex: 'label',
    },
    {
      title: '用户ID',
      dataIndex: 'value',
    },
    {
      title: '用户岗位描述',
      dataIndex: 'desc',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.desc}</Tag>;
      },
    },
    {
      title: '构造用途',
      dataIndex: 'tag',
      render: (_, record) => {
        return <Tag color={'blue'}>{TAGEnum[record.tag]}</Tag>;
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
      editable: false,
    },
    {
      title: '更新时间',
      key: 'showTime',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
      editable: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          onClick={async () => {
            await delUsersById({ id: record.id }).then(({ code, msg }) => {
              if (code === 0) {
                message.success(msg);
                setEdit(edit + 1);
              }
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const AddUser = (
    <Button type={'primary'} onClick={() => setIsModalOpen(true)}>
      <PlusOutlined />
      添加构造用户
    </Button>
  );

  const onUserFormFinish = async () => {
    const body = await userForm.validateFields();
    const cityID = getCityIdByCityName();
    if (cityID) {
      const newAddUserInfo = {
        cityId: cityID,
        value: body.value,
        tag: body.tag,
      };
      await addUsersByCityId(newAddUserInfo).then(({ code, msg }) => {
        if (code === 0) {
          message.success(msg);
          setEdit(edit + 1);
          return true;
        }
      });

      return true;
    } else {
      message.warning('请检查表单');
    }
  };

  return (
    <ProCard split={'horizontal'}>
      <ModalForm
        open={isModalOpen}
        form={userForm}
        onFinish={onUserFormFinish}
        onOpenChange={setIsModalOpen}
      >
        <ProCard style={{ marginTop: 10 }}>
          <ProFormSelect
            name={'city'}
            label={'城市'}
            options={cityOptions}
            required
            initialValue={currentCity}
            rules={[{ required: true, message: '目标城市必选' }]}
            fieldProps={{
              onChange: (value) => {
                console.log(value);
                userForm.setFieldValue('city', value);
              },
            }}
          />
          <ProFormText
            name={'value'}
            label={'用户ID'}
            required
            rules={[{ required: true, message: '用户ID必填' }]}
          />
          <ProFormSelect
            name={'tag'}
            label={'用户用于'}
            options={TAGOption}
            required
            rules={[{ required: true, message: '目标城市必选' }]}
          />
        </ProCard>
      </ModalForm>
      <MyProTable
        search={false}
        columns={UserColumns}
        dataSource={userDatasource}
        toolBarRender={() => [AddUser]}
        rowKey={'id'}
      />
    </ProCard>
  );
};

export default Index;
