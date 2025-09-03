import {
  copyTestCaseStep,
  removeTestCaseStep,
  reorderTestCaseStep,
  updateTestCaseStep,
} from '@/api/case/testCase';
import { CaseSubStep } from '@/pages/CaseHub/type';
import { MenuOutlined } from '@ant-design/icons';
import {
  DragSortTable,
  ProCard,
  ProColumns,
  ProForm,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message, Space, Spin, Typography } from 'antd';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

const { Text } = Typography;

const caseInfoColumn: ProColumns<CaseSubStep>[] = [
  {
    title: '步骤',
    dataIndex: 'sort',
    width: '5%',
    editable: false,
  },
  {
    title: '操作步骤',
    dataIndex: 'action',
    valueType: 'textarea',
    ellipsis: true,
    fieldProps: {
      rows: 2,
      autoSize: { minRows: 2, maxRows: 10 },
      placeholder: '请输入操作步骤',
      allowClear: true,
      fontWeight: 'bold',
      variant: 'filled',
    },
  },
  {
    title: '预期结果',
    dataIndex: 'expected_result',
    valueType: 'textarea',
    ellipsis: true,
    fieldProps: {
      rows: 2,
      autoSize: { minRows: 2, maxRows: 10 },
      variant: 'filled',
      placeholder: '请输入预期结果',
      allowClear: true,
    },
  },
  {
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    width: '8%',
  },
];

interface IProps {
  caseSubStepDataSource?: CaseSubStep[];
  setCaseSubStepDataSource: React.Dispatch<React.SetStateAction<CaseSubStep[]>>;
  callback: () => void;
}

const CaseSubSteps: FC<IProps> = ({
  callback,
  caseSubStepDataSource,
  setCaseSubStepDataSource,
}) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // 0 啥也每干 1 编辑 2 已保存
  const [editStatus, setEditStatus] = useState(0);

  // 使用 useCallback 来确保 handleDragSortEnd 不会在每次渲染时重新定义
  const handleDragSortEnd = useCallback(
    async (beforeIndex: number, afterIndex: number, newDataSource: any) => {
      setCaseSubStepDataSource(newDataSource);
      const orderIds = newDataSource.map((item: CaseSubStep) => item.id);
      await reorderTestCaseStep({ stepIds: orderIds });
    },
    [setCaseSubStepDataSource],
  );

  // 行编辑进行5s后保存
  const saveRecord = async (data: CaseSubStep) => {
    // 如果定时器存在，先清除掉
    if (timerRef.current) clearTimeout(timerRef.current);
    // 设置一个新的定时器，5秒后执行保存请求
    timerRef.current = setTimeout(async () => {
      setEditStatus(1);
      const { code, msg } = await updateTestCaseStep(data);
      if (code === 0) {
        setEditStatus(2);
        // 5秒后恢复为0（不显示状态）
        setTimeout(async () => {
          setEditStatus(0);
        }, 2000); //2秒后恢复为初始状态
      } else {
        setEditStatus(0);
      }
    }, 5000); // 5秒后执行保存
  };
  useEffect(() => {
    if (caseSubStepDataSource) {
      setEditableRowKeys(
        caseSubStepDataSource.map((item: CaseSubStep) => item.uid),
      );
    }
  }, [caseSubStepDataSource]);

  const StatusArea = (status: number) => {
    let statusText = null;

    switch (status) {
      case 0:
        statusText = null;
        break;
      case 2:
        statusText = <Text type={'secondary'}>已保存</Text>;
        break;
    }

    return (
      <Space>
        {status === 1 ? <Spin size="small" /> : null}
        {statusText}
      </Space>
    );
  };
  return (
    <ProCard>
      <ProFormTextArea
        name={'case_step_setup'}
        placeholder={'请输入用例前置'}
        fieldProps={{
          variant: 'filled',
          rows: 1,
        }}
      />
      <ProForm.Item name={'case_sub_step'}>
        <DragSortTable<CaseSubStep>
          columns={caseInfoColumn}
          rowKey="uid"
          search={false}
          pagination={false}
          toolBarRender={false}
          dataSource={caseSubStepDataSource}
          dragSortKey="sort"
          onDragSortEnd={handleDragSortEnd}
          dragSortHandlerRender={() => (
            <MenuOutlined style={{ cursor: 'grab', color: 'gold' }} />
          )}
          editable={{
            type: 'multiple',
            editableKeys,
            // @ts-ignore
            actionRender: (row, _, __) => {
              return (
                <>
                  {row.id && (
                    <Space>
                      <a
                        onClick={async () => {
                          const { code, msg } = await copyTestCaseStep({
                            stepId: row.id,
                          });
                          if (code === 0) {
                            message.success(msg);
                            callback();
                          }
                        }}
                      >
                        复制
                      </a>
                      <a
                        onClick={async () => {
                          const { code, msg } = await removeTestCaseStep({
                            stepId: row.id,
                          });
                          if (code === 0) {
                            message.success(msg);
                            callback();
                          }
                        }}
                      >
                        删除
                      </a>
                    </Space>
                  )}
                </>
              );
            },
            onValuesChange: async (record: CaseSubStep, _: CaseSubStep[]) => {
              await saveRecord(record);
            },
            onChange: setEditableRowKeys,
          }}
        />
      </ProForm.Item>
      <ProFormTextArea
        name={'case_step_mark'}
        placeholder={'请输入备注'}
        fieldProps={{
          variant: 'filled',
          rows: 1,
        }}
      />
      {StatusArea(editStatus)}
      <Space
        style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
      >
        <Button>Pass</Button>
        <Button>Fail</Button>
      </Space>
    </ProCard>
  );
};

export default CaseSubSteps;
