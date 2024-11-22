import {
  addUIVariableById,
  deleteUIVariableById,
  putUIVariableById,
  queryUIVariablesByCaseId,
} from '@/api/aps';
import { IUIExtract } from '@/pages/UIPlaywright/uiTypes';
import { useModel } from '@@/exports';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { message, Popconfirm, Tag } from 'antd';
import React, { FC, useCallback, useRef, useState } from 'react';

interface SelfProps {
  currentCaseId?: number;
}

const Index: FC<SelfProps> = ({ currentCaseId }) => {
  const [extracts, setExtracts] = useState<IUIExtract[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { initialState } = useModel('@@initialState');
  const [extractEditableKeys, setExtractsEditableRowKeys] =
    useState<React.Key[]>();
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  const fetchExtracts = async () => {
    const { code, msg, data } = await queryUIVariablesByCaseId({
      caseId: currentCaseId!,
    });
    if (code === 0) {
      setExtracts(data.items);
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
        success: false,
        total: 0,
      };
    }
  };

  useCallback(async () => await fetchExtracts(), [currentCaseId]);

  const deleteExtract = async (currentUid: string) => {
    const { code, msg } = await deleteUIVariableById({ uid: currentUid });
    if (code === 0) {
      message.success(msg);
      actionRef.current?.reload();
    }
  };

  const extractColumns: ProColumns<IUIExtract>[] = [
    {
      title: '变量名',
      dataIndex: 'key',
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
      render: (_, record) => {
        return <Tag color={'blue'}>{record.key}</Tag>;
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      valueType: 'jsonCode',
      fieldProps: {
        rows: 1,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
    },
    {
      title: 'Opt',
      valueType: 'option',
      render: (_, record, __, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="确认删除"
          onConfirm={async () => await deleteExtract(record.uid)}
          okButtonProps={{ loading: confirmLoading }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <EditableProTable<IUIExtract>
      rowKey={'id'}
      actionRef={actionRef}
      // value={extracts}
      dataSource={extracts}
      request={fetchExtracts}
      columns={extractColumns}
      recordCreatorProps={{
        newRecordType: 'dataSource',
        creatorButtonText: '新增一条变量',
        // @ts-ignore
        record: () => ({
          id: Date.now(),
          caseId: currentCaseId,
        }),
      }}
      editable={{
        type: 'single',
        editableKeys: extractEditableKeys,
        onChange: setExtractsEditableRowKeys,
        onSave: async (record, data) => {
          console.log(data);
          if (data.uid) {
            await putUIVariableById({
              uid: data.uid,
              key: data.key,
              value: data.value,
              caseId: data.caseId,
              updater: initialState?.currentUser?.id!,
            }).then(({ code, msg }) => {
              if (code === 0) {
                message.success(msg);
              }
            });
          } else {
            await addUIVariableById({
              key: data.key,
              value: data.value,
              caseId: data.caseId!,
              creator: initialState?.currentUser?.id!,
            }).then(({ code, msg }) => {
              if (code === 0) {
                message.success(msg);
              }
            });
          }
          actionRef.current?.reload();
        },
        onCancel: async () => {
          await actionRef.current?.reload();
        },
        actionRender: (row, _, dom) => {
          return [dom.save, dom.cancel];
        },
      }}
    />
  );
};

export default Index;
