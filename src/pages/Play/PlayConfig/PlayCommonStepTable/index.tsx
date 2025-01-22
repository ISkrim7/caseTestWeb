import { IObjGet } from '@/api';
import { queryMethods } from '@/api/play/method';
import { pageSteps } from '@/api/play/step';
import { delCommonStep } from '@/api/ui';
import MyDrawer from '@/components/MyDrawer';
import MyProTable from '@/components/Table/MyProTable';
import AddStep from '@/pages/Play/componets/AddStep';
import PlayStepDetail from '@/pages/Play/PlayCase/PlayStepDetail';
import { IUICaseSteps } from '@/pages/UIPlaywright/uiTypes';
import { pageData } from '@/utils/somefunc';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProCard } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, message, Tag, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [methodEnum, setMethodEnum] = useState<IObjGet>();
  const [addStepOpen, setAddStepOpen] = useState(false);
  const [stepDetailOpen, setStepDetailOpen] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<number>();
  const [mode, setMode] = useState<number>(1);
  useEffect(() => {
    queryMethods().then(async ({ code, data }) => {
      if (code === 0 && data) {
        // @ts-ignore
        data.sort((a: any, b: any) => {
          if (a.label < b.label) return -1;
          if (a.label > b.label) return 1;
        });
        const methodEnum = data.reduce((acc, item) => {
          const { value, label, description } = item;
          const text = (
            <Tooltip title={description}>
              <span>{label}</span>
            </Tooltip>
          );
          return { ...acc, [value]: { text } };
        }, {});
        setMethodEnum(methodEnum);
      }
    });
  }, []);
  const fetchCommonStepPage = async (values: any) => {
    const { code, data } = await pageSteps({ ...values, is_common_step: 1 });
    return pageData(code, data);
  };

  const columns: ProColumns<IUICaseSteps>[] = [
    {
      title: 'uid',
      dataIndex: 'uid',
      copyable: true,
      editable: false,
      fixed: 'left',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '名称',
      valueType: 'text',
      dataIndex: 'name',
      fixed: 'left',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '描述',
      valueType: 'text',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },

    {
      title: '方法',
      dataIndex: 'method',
      valueEnum: { ...methodEnum },
      valueType: 'select',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      valueType: 'text',
      editable: false,
      fixed: 'right',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: 'opt',
      valueType: 'option',
      fixed: 'right',
      render: (_, record, __, action) => [
        <a
          onClick={() => {
            setMode(1);
            setCurrentStepId(record.id);
            setStepDetailOpen(true);
          }}
        >
          详情
        </a>,
        <a
          key="delete"
          onClick={async () => {
            const { code, msg } = await delCommonStep({ uid: record.uid });
            if (code === 0) {
              message.success(msg);
              action?.reload?.();
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const addStepButton = (
    <Button
      type={'primary'}
      onClick={async () => {
        setMode(2);
        setAddStepOpen(true);
      }}
    >
      <PlusOutlined />
      添加共有步骤
    </Button>
  );
  const closeDrawer = async () => {
    setAddStepOpen(false);
    setStepDetailOpen(false);
    await actionRef.current?.reload();
  };

  return (
    <ProCard split={'horizontal'}>
      <MyDrawer
        name={'步骤详情'}
        width={'auto'}
        open={stepDetailOpen}
        setOpen={setStepDetailOpen}
      >
        <PlayStepDetail stepId={currentStepId} func={closeDrawer} />
      </MyDrawer>
      <MyDrawer
        name={'添加步骤'}
        width={'auto'}
        open={addStepOpen}
        setOpen={setAddStepOpen}
      >
        <AddStep func={closeDrawer} />
      </MyDrawer>
      <MyProTable
        actionRef={actionRef}
        rowKey={'id'}
        x={1000}
        columns={columns}
        toolBarRender={() => [addStepButton]}
        request={fetchCommonStepPage}
      />
    </ProCard>
  );
};
export default Index;
