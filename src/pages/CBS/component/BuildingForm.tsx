import { addBuildingByCityId, queryBuildingsByCityId } from '@/api/cbsAPI/cbs';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-components';
import {
  Button,
  Divider,
  FormInstance,
  Input,
  InputRef,
  message,
  Space,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';

interface SelfProps {
  form: FormInstance;
  currentCityID?: number;
}

const BuildingForm: FC<SelfProps> = (props) => {
  const { form, currentCityID } = props;

  const inputRef = useRef<InputRef>(null);
  const [buildingList, setBuildingList] = useState<any[]>();
  const [addBuildIngInfo, setAddBuildIngInfo] = useState<string>();
  const fetchBuilding = async (cityId: number) => {
    const { code, data } = await queryBuildingsByCityId({ cityId: cityId });
    return code === 0 ? data : [];
  };

  useEffect(() => {
    if (currentCityID) {
      fetchBuilding(currentCityID).then((data) => {
        setBuildingList(data);
        const setDefaultField = (field: string, list: any[]) => {
          form.setFieldsValue({
            [field]: list.length > 0 ? list[0].value : undefined,
          });
        };
        setDefaultField('buildingName', data);
      });
    }
  }, [currentCityID]);
  const addBuildingItem = async () => {
    if (!addBuildIngInfo) {
      return;
    }
    const isUserExist = buildingList?.find(
      (item) => item.value === addBuildIngInfo,
    );
    if (isUserExist) {
      message.warning('楼盘存在');
      return;
    } else {
      setBuildingList([...(buildingList || []), addBuildIngInfo]);
      setAddBuildIngInfo(undefined);
      if (currentCityID) {
        const data = {
          cityId: currentCityID,
          value: addBuildIngInfo,
        };
        await addBuildingByCityId(data).then(({ code, msg }) => {
          if (code === 0) {
            message.success(msg);
          }
        });
      }
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 1000);
  };

  return (
    <ProFormSelect
      showSearch
      name={'buildingName'}
      label={'楼盘名称'}
      width={'md'}
      options={buildingList}
      required={true}
      tooltip="名称尽可能全称呼，避免模糊搜索查询不到"
      rules={[{ required: true, message: '请选择楼盘' }]}
      fieldProps={{
        dropdownRender: (menu) => {
          return (
            <div>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="请输入楼盘名称"
                  ref={inputRef}
                  onChange={({ target }) => setAddBuildIngInfo(target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={addBuildingItem}
                >
                  添加楼盘名称
                </Button>
              </Space>
            </div>
          );
        },
      }}
    />
  );
};

export default BuildingForm;
