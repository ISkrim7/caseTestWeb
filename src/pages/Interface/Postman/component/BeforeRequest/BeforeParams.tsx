import { PageVariable } from '@/api/interface';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import {
  beforeColumns,
  VariableColumns,
} from '@/pages/Interface/Postman/component/BeforeRequest/BeforeColumns';
import { IBeforeParams, ISteps } from '@/pages/Interface/types';
import { EditableProTable, ProForm } from '@ant-design/pro-components';
import { Button, FormInstance, message } from 'antd';
import React, { FC, useCallback, useEffect, useState } from 'react';

interface ISelfProps {
  stepForm: FormInstance<ISteps>;
  stepInfo?: ISteps;
  currentProjectId: string;
}

const BeforeParams: FC<ISelfProps> = ({
  stepForm,
  stepInfo,
  currentProjectId,
}) => {
  const [beforeParamsEditableKeys, setBeforeParamsEditableRowKeys] =
    useState<React.Key[]>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (stepInfo) {
      setBeforeParamsEditableRowKeys(
        stepInfo.beforeParams?.map((item) => item.id) || [],
      );
    }
  }, [stepInfo]);

  const fetchCurrentVariables = useCallback(
    async (params: any, sort: any) => {
      if (currentProjectId) {
        params.projectId = currentProjectId;
        return await fetchVariables(params, sort);
      }
    },
    [currentProjectId],
  );
  const fetchVariables = async (params: any, sort: any) => {
    const searchInfo: any = {
      ...params,
      sort: sort,
    };
    const { code, data } = await PageVariable(searchInfo);
    if (code === 0) {
      return {
        data: data.items,
        total: data.pageInfo.total,
        success: true,
        pageSize: data.pageInfo.page,
        current: data.pageInfo.limit,
      };
    } else {
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  };

  const searchVariableButton = (
    <Button type={'primary'} onClick={() => setOpen(true)}>
      使用全局变量
    </Button>
  );

  const OnSelect = (record: any, selected: boolean) => {
    const existsValue: IBeforeParams[] = stepForm.getFieldValue('beforeParams');

    const selectRow: IBeforeParams = {
      id: (Math.random() * 1000000).toFixed(0),
      key: record.key,
      value: record.value,
      target: '5',
      desc: record.desc || null,
    };
    if (selected) {
      if (existsValue?.some((item: IBeforeParams) => item.key === record.key)) {
        const messagestr = `key 值 ${record.key} 已经存在！`;
        message.warning(messagestr).then();
        return;
      }

      const mergedValues: IBeforeParams[] = existsValue
        ? [...existsValue, selectRow]
        : [selectRow];

      stepForm.setFieldsValue({ beforeParams: mergedValues });
      setBeforeParamsEditableRowKeys(mergedValues.map((item) => item.id));
    } else {
      const filteredValues = existsValue?.filter(
        (item: IBeforeParams) => item.key !== record.key,
      );
      stepForm.setFieldsValue({ beforeParams: filteredValues });
      setBeforeParamsEditableRowKeys(
        filteredValues?.map((item) => item.id) || [],
      );
    }
  };
  return (
    <>
      <MyDrawer name={''} open={open} setOpen={setOpen}>
        <MyProTable
          rowSelection={{
            onSelect: OnSelect,
          }}
          headerTitle={'全局变量表'}
          columns={VariableColumns}
          rowKey={'uid'}
          request={fetchCurrentVariables}
        />
      </MyDrawer>
      <ProForm form={stepForm} submitter={false}>
        <ProForm.Item name={'beforeParams'} trigger={'onValuesChange'}>
          <EditableProTable<IBeforeParams>
            rowKey={'id'}
            search={false}
            toolBarRender={() => [searchVariableButton]}
            columns={beforeColumns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({
                id: Date.now(),
                target: '5',
              }),
            }}
            editable={{
              type: 'multiple',
              editableKeys: beforeParamsEditableKeys,
              onChange: setBeforeParamsEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
            }}
          />
        </ProForm.Item>
      </ProForm>
    </>
  );
};
export default BeforeParams;
