import {
  copyInterface,
  delApiCase,
  pageApiCase,
  runApi,
  runInterfaceGroup,
} from '@/api/interface';
import MyProTable from '@/components/Table/MyProTable';
import AddInterface from '@/pages/Interface/AddInterface';
import InterResponse from '@/pages/Interface/InterResponse';
import { IInterface } from '@/pages/Interface/types';
import { CONFIG } from '@/utils/config';
import { history } from '@@/core/history';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Tag } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';

interface SelfProps {
  currentProject?: number;
  currentCasePart: number;
}

const Index: FC<SelfProps> = (props) => {
  const { currentProject, currentCasePart } = props;
  const { initialState, setInitialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [currentAPIs, setCurrentAPIs] = useState<IInterface[]>([]);
  const [responseUid, setResponseUid] = useState<string>();
  const [openResult, setOpenResult] = useState(false);
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  const fetchApisData = useCallback(
    async (params: any, sort: any) => {
      if (!currentCasePart)
        return {
          data: [],
          success: false,
          total: 0,
        };
      const searchData: any = {
        casePartID: currentCasePart,
        ...params,
        sort: sort,
      };
      const { code, data } = await pageApiCase(searchData);
      if (code === 0) {
        setCurrentAPIs(data.items);
        return {
          data: data.items,
          total: data.pageInfo.total,
          success: true,
          pageSize: data.pageInfo.page,
          current: data.pageInfo.limit,
        };
      }
      return {
        data: [],
        success: false,
        total: 0,
      };
    },
    [currentCasePart],
  );

  useEffect(() => {
    if (currentProject) setCurrentAPIs([]);
  }, [currentProject]);
  useEffect(() => {
    actionRef.current?.reload();
  }, [currentCasePart, fetchApisData]);

  const copyInterFetch = async (interfaceUid: string) => {
    const { code, data } = await copyInterface({ uid: interfaceUid });
    if (code === 0) {
      history.push(
        `/interface/caseApi/detail/projectID=${currentProject}&casePartID=${currentCasePart}&uid=${data}`,
      );
    }
  };

  // 删除用例
  const delCaseApi = async (uid: string) => {
    const res = await delApiCase({ uid: uid });
    if (res.code === 0) message.success(res.msg);
    actionRef.current?.reload();
  };

  const run = async (uid: string) => {
    setOpenResult(true);
    const { code, data } = await runApi({ uid });
    if (code === 0) setResponseUid(data);
    else setOpenResult(false);
  };

  const runGroup = async () => {
    if (selectKeys) {
      const { code, msg } = await runInterfaceGroup({
        interfaceIds: selectKeys,
      });
      if (code === 0) {
        message.success(msg);
        history.push('/report/history/tagId=1');
      }
    }
  };

  const columns: ProColumns<IInterface>[] = [
    {
      title: '接口编号',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: CONFIG.API_LEVEL_ENUM,
      render: (text, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_LEVEL[record.level].color}>
            {CONFIG.RENDER_CASE_LEVEL[record.level].text}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: CONFIG.CASE_STATUS_ENUM,
      render: (text, record) => {
        return (
          <Tag color={CONFIG.RENDER_CASE_STATUS[record.status].color}>
            {CONFIG.RENDER_CASE_STATUS[record.status].text}
          </Tag>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _) => {
        return (
          <>
            <a
              target="_blank"
              rel="noopener noreferrer"
              key="view"
              onClick={() => {
                history.push(
                  `/interface/caseApi/detail/projectID=${currentProject}&casePartID=${currentCasePart}&uid=${record.uid}`,
                );
              }}
            >
              详情
            </a>
            <Divider type={'vertical'} />
            <a
              onClick={async () => {
                await run(record.uid);
              }}
            >
              执行
            </a>
            <Divider type={'vertical'} />
            <a onClick={async () => await copyInterFetch(record.uid)}>复制</a>
            {initialState?.currentUser?.id === record.creator ||
            initialState?.currentUser?.isAdmin ? (
              <Popconfirm
                title={'确认删除？'}
                okText={'确认'}
                cancelText={'点错了'}
                onConfirm={async () => {
                  await delCaseApi(record.uid);
                }}
              >
                <Divider type={'vertical'} />

                <a>删除</a>
              </Popconfirm>
            ) : null}
          </>
        );
      },
    },
  ];
  return (
    <>
      <InterResponse
        open={openResult}
        setOpen={setOpenResult}
        roomId={responseUid}
      />
      <MyProTable
        height={'auto'}
        columns={columns}
        actionRef={actionRef}
        dataSource={currentAPIs}
        request={fetchApisData}
        onDelete={delCaseApi}
        rowKey={'uid'}
        rowSelection={{
          onChange: (keys: any) => {
            console.log(keys);
            setSelectKeys(keys as string[]);
          },
        }}
        toolBarRender={() => [
          <Button
            disabled={selectKeys.length > 0 ? false : true}
            onClick={runGroup}
          >
            {' '}
            批量运行
          </Button>,
          <AddInterface
            actionRef={actionRef}
            currentProject={currentProject!}
            currentCasePart={currentCasePart}
          />,
        ]}
      />
    </>
  );
};

export default Index;
