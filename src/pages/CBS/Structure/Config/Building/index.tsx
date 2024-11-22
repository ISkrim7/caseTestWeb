import { IBuildingList, ICityList } from '@/api';
import {
  addBuildingByCityId,
  delBuildingById,
  queryBuildingsByCityId,
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
import { Button, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';

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
  const [buildingForm] = Form.useForm<{ value: string; cityId: number }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildingDataSource, setBuildingDataSource] = useState<IBuildingList[]>(
    [],
  );
  const [edit, setEdit] = useState<number>(0);

  /**
   * 获取楼盘列表
   */
  const fetchBuilding = async () => {
    const cityID = getCityIdByCityName();
    if (cityID) {
      const { code, data } = await queryBuildingsByCityId({ cityId: cityID });
      return code === 0 ? data : [];
    } else {
      return [];
    }
  };
  useEffect(() => {
    if (currentCity) {
      fetchBuilding().then((res) => {
        setBuildingDataSource(res);
      });
    }
  }, [currentCity, edit]);

  const BuildingColumns: ProColumns<IBuildingList>[] = [
    {
      title: '楼盘名称',
      dataIndex: 'value',
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
            await delBuildingById({ id: record.id }).then(({ code, msg }) => {
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

  const onBuildingFormFinish = async () => {
    const body = await buildingForm.validateFields();
    const cityID = getCityIdByCityName();
    if (cityID) {
      const newAddUserInfo = {
        cityId: cityID,
        value: body.value,
      };
      await addBuildingByCityId(newAddUserInfo).then(({ code, msg }) => {
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

  const AddBuild = (
    <Button type={'primary'} onClick={() => setIsModalOpen(true)}>
      {' '}
      <PlusOutlined />
      添加构造楼盘
    </Button>
  );

  return (
    <ProCard split={'horizontal'}>
      <ModalForm
        open={isModalOpen}
        form={buildingForm}
        onFinish={onBuildingFormFinish}
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
          />
          <ProFormText
            name={'value'}
            label={'楼盘名称'}
            required
            rules={[{ required: true, message: '楼盘名称必填' }]}
          />
        </ProCard>
      </ModalForm>
      <MyProTable
        search={false}
        columns={BuildingColumns}
        dataSource={buildingDataSource}
        toolBarRender={() => [AddBuild]}
        rowKey={'id'}
      />
    </ProCard>
  );
};

export default Index;
