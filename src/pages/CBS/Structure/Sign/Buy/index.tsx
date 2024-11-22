import { ICityList, IObjGet } from '@/api';
import {
  addSign,
  addSignUsers,
  IQueryUsers,
  querySignUsers,
} from '@/api/cbsAPI/signAPI';
import TitleName from '@/components/TitleName';
import CityForm from '@/pages/CBS/component/CityForm';
import UsernameForm from '@/pages/CBS/component/UsernameForm';
import Utils from '@/pages/CBS/component/utils';
import { AlertOutlined, EditOutlined } from '@ant-design/icons';
import {
  EditableFormInstance,
  EditableProTable,
  ProCard,
  ProColumns,
  ProForm,
  ProFormMoney,
  ProFormRadio,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message, Modal } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';

interface SelfProps {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomID: React.Dispatch<React.SetStateAction<string | null>>;
}

const transferOptions = [
  {
    label: '委托',
    value: '1',
  },
  {
    label: '非委托',
    value: '0',
  },
];

const Index: FC<SelfProps> = ({ setDrawer, setRoomID }) => {
  const { defaultSignUserData, fetchQueryCity, SelectCity } = Utils();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultSignUserData.map((item) => item.id),
  );
  const editableFormRef = useRef<EditableFormInstance>();
  const [form] = Form.useForm<any>();
  const [userForm] = Form.useForm<any>();
  const [open, setOpen] = useState(false);
  const [grid, setGrid] = useState(false);
  const [addUserCount, setAddUserCount] = useState(0);
  const [queryUser, setQueryUsers] = useState<IQueryUsers[]>();
  const [enumUser, setEnumUser] = useState<IObjGet>();
  const [statusOptions, setStatusOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [dataSource, setDataSource] = useState<any>(defaultSignUserData);
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();
  const [cityList, setCityList] = useState<ICityList[]>();
  const convertData = (originalData: any): Record<string, { text: string }> => {
    return originalData.reduce(
      (result: Record<string, { text: string }>, item: any) => {
        result[item.name] = { text: item.name };
        return result;
      },
      {},
    );
  };
  const columns: ProColumns[] = [
    {
      title: '买卖方',
      dataIndex: 'target',
      readonly: true,
      width: '10%',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'select',
      valueEnum: enumUser,
      width: '30%',
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: (value: string) => {
            editableFormRef.current?.setRowData?.(
              rowIndex,
              getInfoByName(value) || [],
            );
          },
        };
      },
    },
    {
      title: '身份证号',
      dataIndex: 'ssn',
      width: '30%',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: '30%',
    },
  ];

  const getInfoByName = (
    name: string,
  ): { id: number; ssn: string; phone: string } | null =>
    queryUser?.find((item) => item.name === name) || null;

  useEffect(() => {
    querySignUsers().then(({ code, data }) => {
      if (code === 0) {
        setQueryUsers(data);
        setEnumUser(convertData(data));
      }
    });
  }, [addUserCount]);
  useEffect(() => {
    if (selectedCity) {
      console.log('==', selectedCity);
      let newStatusOptions: {
        label: string;
        value: number;
      }[];
      if (selectedCity === 'hangzhou') {
        newStatusOptions = [
          {
            label: '仅草签',
            value: 0,
          },
          {
            label: '报意向',
            value: 2,
          },
        ];
      } else if (
        selectedCity === 'shanghai' ||
        selectedCity === 'zhengzhou' ||
        selectedCity === 'wuxi' ||
        selectedCity === 'taiyuan' ||
        selectedCity === 'tianjin'
      ) {
        newStatusOptions = [
          {
            label: '仅草签',
            value: 0,
          },
        ];
      } else {
        newStatusOptions = [
          {
            label: '仅草签',
            value: 0,
          },
          {
            label: '完成备件上传与报备&折扣审核',
            value: 1,
          },
          {
            label: '仅报成交(Beta）',
            value: 2,
          },
          {
            label: '成交后完成审批与佣金收齐（Beta）',
            value: 3,
          },
        ];
      }
      setStatusOptions(newStatusOptions);
    }
  }, [selectedCity]);

  const onFinish = async () => {
    const body = {
      users: dataSource,
      ...form.getFieldsValue(),
    };
    const { code, data } = await addSign({ value: body });
    if (code === 0) {
      setDrawer(true);
      setRoomID(data);
    }
  };

  const addUsers = async () => {
    const body = await userForm.validateFields();
    const { code, msg } = await addSignUsers(body);
    if (code === 0) {
      message.success(msg);
      setOpen(false);
      setAddUserCount(addUserCount + 1);
    }
    return true;
  };
  return (
    <ProCard
      title={TitleName('买卖草签合同构造')}
      bordered
      hoverable
      style={{ borderRadius: '40px', marginBottom: '16px' }}
    >
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={async () => {
          await addUsers();
        }}
      >
        <ProForm<{ name: string; phone: string; ssn: string }>
          submitter={false}
          form={userForm}
        >
          <ProFormText
            name={'name'}
            label={'姓名'}
            width={'md'}
            required
            rules={[{ required: true, message: 'name必填' }]}
          />
          <ProFormText
            name={'ssn'}
            label={'身份证'}
            width={'md'}
            required
            rules={[{ required: true, message: '身份证必填' }]}
          />
          <ProFormText
            name={'phone'}
            label={'电话'}
            width={'md'}
            required
            rules={[{ required: true, message: '电话必填' }]}
          />
        </ProForm>
        <text>
          <AlertOutlined style={{ color: 'orange' }} />{' '}
          姓名存在时，会根据姓名更新证件号与电话
        </text>
      </Modal>
      <ProForm form={form} onFinish={onFinish}>
        <ProForm.Group>
          <CityForm
            form={form}
            setSelectCity={setSelectedCity}
            setSelectedCityId={setSelectedCityId}
          />
          {selectedCity &&
            ['beijing', 'nanjing', 'tianjin', 'taiyuan'].includes(
              selectedCity,
            ) && (
              <>
                <ProFormRadio.Group
                  radioType="button"
                  fieldProps={{
                    buttonStyle: 'solid',
                  }}
                  name="transfer"
                  width="md"
                  initialValue="1"
                  label="是否委托过户"
                  options={transferOptions}
                />
                {selectedCity === 'beijing' && (
                  <ProFormSwitch
                    fieldProps={{
                      onChange: setGrid,
                    }}
                    width="md"
                    initialValue={grid}
                    label="华熙存量房 (Beta)"
                    name="hx"
                  />
                )}
              </>
            )}
        </ProForm.Group>
        <ProForm.Group>
          <ProFormRadio.Group
            radioType={'button'}
            fieldProps={{
              buttonStyle: 'solid',
            }}
            name="status"
            width="md"
            initialValue={0}
            label="预期状态"
            options={statusOptions}
          />
        </ProForm.Group>
        <ProForm.Group>
          <UsernameForm
            form={form}
            tag={1}
            name={'username'}
            label={'录入人'}
            currentCityID={selectedCityId}
          />
          <ProFormText
            name="houseId"
            label="房源ID"
            width={'md'}
            required={true}
            placeholder={'houseId'}
            rules={[{ required: true, message: '房源ID必填' }]}
          />
          <ProFormMoney
            name="amount"
            width={'md'}
            label="全款成交价"
            initialValue={1000000}
            addonAfter={'元'}
          />
        </ProForm.Group>
        <EditableProTable
          rowKey="id"
          toolBarRender={() => [
            <Button
              type={'primary'}
              onClick={() => {
                setOpen(true);
              }}
            >
              <EditOutlined />
              添加或修改常用双方信息
            </Button>,
          ]}
          editableFormRef={editableFormRef}
          headerTitle={'双方信息'}
          columns={columns}
          value={dataSource}
          onChange={setDataSource}
          recordCreatorProps={false}
          editable={{
            type: 'multiple',
            editableKeys,
            onValuesChange: (record, recordList) => {
              const updatedRecordList = recordList.map((item) => {
                if (item.id === record.id) {
                  const info = getInfoByName(item.name);
                  if (info) {
                    return { ...item, ssn: info.ssn, phone: info.phone };
                  }
                }
                return item;
              });
              setDataSource(updatedRecordList);
            },
            actionRender: (_, __, defaultDoms) => {
              return [defaultDoms.delete];
            },
            onChange: setEditableRowKeys,
          }}
        />
      </ProForm>
    </ProCard>
  );
};
export default Index;
