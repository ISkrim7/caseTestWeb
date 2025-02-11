import {
  addVars,
  pageVars,
  removeVars,
  updateVars,
} from '@/api/inter/interCase';
import { IUIVars } from '@/pages/Play/componets/uiTypes';
import { pageData } from '@/utils/somefunc';
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { message, Popconfirm, Tag } from 'antd';
import React, { FC, useCallback, useRef, useState } from 'react';
interface ISelfProps {
  currentCaseId?: string;
}
const InterfaceApiCaseVars: FC<ISelfProps> = ({ currentCaseId }) => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [varsEditableKeys, setVarsEditableRowKeys] = useState<React.Key[]>();
  const [dataSource, setDataSource] = useState<IUIVars[]>([]);
  const [edit, setEdit] = useState(0);

  const fetchPageVars = useCallback(
    async (values: any) => {
      const { code, data } = await pageVars({
        ...values,
        case_id: currentCaseId,
      });
      return pageData(code, data, setDataSource);
    },
    [currentCaseId, edit],
  );

  const varColumns: ProColumns<IUIVars>[] = [
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
      valueType: 'text',
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
      fixed: 'right',
      width: '15%',
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
          onConfirm={async () => {
            const { code, msg } = await removeVars({ uid: record.uid });
            if (code === 0) {
              message.success(msg);
              setEdit(edit + 1);
            }
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <EditableProTable<IUIVars>
      options={{
        density: true,
        setting: {
          listsHeight: 400,
        },
      }}
      search={{
        labelWidth: 'auto',
        showHiddenNum: true,
      }}
      dataSource={dataSource}
      request={fetchPageVars}
      rowKey={'id'}
      actionRef={actionRef}
      columns={varColumns}
      recordCreatorProps={{
        newRecordType: 'dataSource',
        creatorButtonText: '新增一条变量',
        // @ts-ignore
        record: () => ({
          id: Date.now(),
          case_id: currentCaseId,
        }),
      }}
      editable={{
        type: 'single',
        editableKeys: varsEditableKeys,
        onChange: setVarsEditableRowKeys,
        onSave: async (_, data) => {
          console.log(data);
          if (data.uid) {
            const { code, msg } = await updateVars(data);
            if (code === 0) {
              message.success(msg);
            }
          } else {
            const { code, msg } = await addVars(data);
            if (code === 0) {
              message.success(msg);
            }
          }
          setEdit(edit + 1);
        },

        actionRender: (row, _, dom) => {
          return [dom.save, dom.cancel];
        },
      }}
    />
  );
};

export default InterfaceApiCaseVars;
