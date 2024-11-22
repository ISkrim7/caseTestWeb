import { queryCityList } from '@/api/cbsAPI/cbs';
import { fetchEnvsOptions } from '@/api/ui';
import MyProTable from '@/components/Table/MyProTable';
import { IUIEnv } from '@/pages/UIPlaywright/uiTypes';
import { useModel } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProCard,
  ProColumns,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message, Tag } from 'antd';
import { useEffect, useState } from 'react';

const EevOptions = [
  {
    label: 'SSO',
    value: 'sso',
  },
  {
    label: 'SIT',
    value: 'sit',
  },
  {
    label: 'UAT',
    value: 'uat',
  },
];
const Index = () => {
  const [envForm] = Form.useForm<IUIEnv>();
  const { initialState } = useModel('@@initialState');
  const [envDataSource, setEnvDataSource] = useState<IUIEnv[]>([]);
  const [cityList, setCityList] = useState<string[]>([]);
  const [edit, setEdit] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchQueryEnvs = async () => {
    const { code, data } = await fetchEnvsOptions('GET');
    if (code === 0) {
      return data;
    }
    return [];
  };
  const fetchAddEnv = async () => {
    const values = await envForm.validateFields();
    const { code, msg } = await fetchEnvsOptions('POST', values);
    if (code === 0) {
      message.success(msg);
      setIsModalOpen(false);
      setEdit(edit + 1);
    }
  };
  const fetchQueryCity = async () => {
    const { code, data } = await queryCityList();
    if (code === 0) {
      return data;
    }
  };
  useEffect(() => {
    fetchQueryEnvs().then((data) => {
      setEnvDataSource(data);
    });
    fetchQueryCity().then((data) => {
      if (data) {
        setCityList(data.map((item) => item.label));
      }
    });
  }, [edit]);

  const columns: ProColumns<IUIEnv>[] = [
    {
      title: '环境',
      dataIndex: 'env',
      width: '10%',
      render: (_, record) => {
        if (record.env === 'uat') {
          return <Tag color={'blue'}>UAT</Tag>;
        } else if (record.env === 'sit') {
          return <Tag color={'green'}>SIT</Tag>;
        } else {
          return <Tag color={'warning'}>SSO</Tag>;
        }
      },
    },
    {
      title: '城市',
      dataIndex: 'name',
      width: '10%',
      render: (_, record) => {
        return <Tag color={'blue'}>{record.name}</Tag>;
      },
    },
    {
      title: '地址',
      dataIndex: 'domain',
      width: '70%',
      copyable: true,
    },

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '5%',
      fixed: 'right',
      render: (_, record, __, action) => {
        return (
          <>
            {initialState?.currentUser?.isAdmin ? (
              <>
                <a
                  onClick={async () => {
                    await fetchEnvsOptions('DELETE', { uid: record.uid }).then(
                      ({ code, msg }) => {
                        if (code === 0) {
                          message.success(msg);
                          setEdit(edit + 1);
                        }
                      },
                    );
                  }}
                >
                  删除
                </a>
              </>
            ) : null}
          </>
        );
      },
    },
  ];

  const AddMethod = (
    <>
      {initialState?.currentUser?.isAdmin ? (
        <Button type={'primary'} onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
          添加
        </Button>
      ) : null}
    </>
  );
  return (
    <ProCard split={'horizontal'}>
      <ModalForm
        open={isModalOpen}
        form={envForm}
        onFinish={fetchAddEnv}
        onOpenChange={setIsModalOpen}
      >
        <ProCard style={{ marginTop: 10 }}>
          <ProFormSelect
            name={'name'}
            label={'城市'}
            required
            options={cityList}
            rules={[{ required: true, message: '城市名必填' }]}
          />
          <ProFormText
            name={'domain'}
            label={'地址'}
            required
            rules={[{ required: true, message: '地址必填' }]}
          />
          <ProFormSelect
            rules={[{ required: true, message: '环境必填' }]}
            required
            options={EevOptions}
            name={'env'}
            label={'环境'}
          />
        </ProCard>
      </ModalForm>
      <MyProTable
        search={false}
        columns={columns}
        x={1000}
        dataSource={envDataSource}
        toolBarRender={() => [AddMethod]}
        rowKey={'id'}
      />
    </ProCard>
  );
};

export default Index;
