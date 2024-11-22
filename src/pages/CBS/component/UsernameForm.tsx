import { IUserList } from '@/api';
import { addSimpleUser, queryUsersByCityId } from '@/api/cbsAPI/cbs';
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
  label: string;
  name: string;
  currentCityID?: number;
  tag: number;
}

const UsernameForm: FC<SelfProps> = (props) => {
  const inputRef = useRef<InputRef>(null);
  const { label, tag, name, form, currentCityID } = props;
  const [userList, setUserList] = useState<IUserList[]>();
  const [addUserInfo, setAddUserInfo] = useState<any>();

  useEffect(() => {
    if (currentCityID) {
      fetchUsers(currentCityID).then((data) => {
        const usernameList = data.filter((item) => item.tag === tag);
        setUserList(usernameList);
        const setDefaultField = (field: string, list: any[]) => {
          form.setFieldsValue({
            [field]: list.length > 0 ? list[0].value : undefined,
          });
        };
        setDefaultField(name, usernameList);
      });
    }
  }, [currentCityID]);
  /**
   * 获取用户列表
   */
  const fetchUsers = async (cityId: number) => {
    const { code, data } = await queryUsersByCityId({ cityId: cityId });
    return code === 0 ? data : [];
  };

  const addUserItem = async () => {
    if (!addUserInfo) {
      return;
    }
    const isUserExist = userList?.some(
      (item) => item.value === addUserInfo.value && item.tag === tag,
    );
    if (isUserExist) {
      message.warning('用户存在');
      return;
    }
    if (addUserInfo) {
      setUserList([...(userList || []), addUserInfo]);
      setAddUserInfo(undefined);
      if (currentCityID) {
        const newAddUserInfo = {
          cityId: currentCityID,
          value: addUserInfo.value,
          tag: tag,
        };
        await addSimpleUser(newAddUserInfo).then(({ code, msg }) => {
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
      width={'md'}
      showSearch
      required
      label={label}
      name={name}
      options={userList?.map((item) => ({
        label: (
          <>
            <span>{item.label}</span>
            <span style={{ marginLeft: 10 }}>{item.desc}</span>
          </>
        ),
        value: item.value,
      }))}
      fieldProps={{
        dropdownRender: (menu) => {
          return (
            <div>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder={`请输入${label}ID`}
                  onChange={({ target }) =>
                    setAddUserInfo({
                      value: target.value,
                      label: target.value,
                    })
                  }
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={addUserItem}
                >
                  添加一个用户
                </Button>
              </Space>
            </div>
          );
        },
      }}
      rules={[{ required: true, message: '请选择' + name }]}
    />
  );
};
export default UsernameForm;
