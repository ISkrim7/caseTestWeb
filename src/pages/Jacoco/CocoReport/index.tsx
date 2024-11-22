import {
  downloadCoCoReport,
  mergeCoCoReport,
  pageCoCoReport,
  putReportField,
  queryModel,
} from '@/api/coco';
import MyProTable from '@/components/Table/MyProTable';
import { CocoReport } from '@/pages/Jacoco/cocoType';
import { history } from '@@/core/history';
import { ActionType, ProCard, ProColumns } from '@ant-design/pro-components';
import { Button, Divider, message, Table, Tag } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const [option, setOption] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const fetchCocoReport = useCallback(async (params: any, sort: any) => {
    const searchData: any = {
      ...params,
      sort: sort,
    };
    const { code, data, msg } = await pageCoCoReport(searchData);
    if (code === 0) {
      // setCocoConfigs(data.items);
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
  }, []);

  useEffect(() => {
    queryModel().then(({ data }) => {
      setOption(data);
    });
  }, []);
  const columns: ProColumns<CocoReport>[] = [
    {
      title: '模块',
      dataIndex: 'module_name',
      valueType: 'select',
      valueEnum: option,
      width: '5%',
      editable: false,
      fixed: 'left',
      render: (text, record) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '报告名称',
      dataIndex: 'report_name',
      copyable: true,
      ellipsis: true,
      sorter: true,
    },
    {
      title: '项目',
      dataIndex: 'report_project_name_list',
      copyable: true,
      ellipsis: true,
      sorter: true,
      editable: false,
    },

    {
      title: '标签',
      dataIndex: 'trigger_tag',
      valueType: 'select',
      valueEnum: {
        1: 'manually',
        2: 'manuallyMerge',
        3: 'process',
        4: 'finally',
        5: 'auto',
        6: 'version',
      },
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },

    {
      title: 'git原始分支/标签',
      dataIndex: 'baseVersion',
      copyable: true,
      ellipsis: true,
      editable: false,
    },
    {
      title: 'git现分支/标签',
      dataIndex: 'nowVersion',
      ellipsis: true,
      editable: false,
      copyable: true,
    },
    {
      title: '执行时间',
      dataIndex: 'create_time',
      hideInSearch: true,
      valueType: 'dateTime',
      editable: false,
      sorter: true,
    },
    {
      title: '执行人',
      dataIndex: 'creatorName',
      valueType: 'text',
      fixed: 'right',
      editable: false,
      width: '8%',
      render: (text) => {
        return <Tag color={'blue'}>{text}</Tag>;
      },
    },
    {
      title: '环境',
      dataIndex: 'env',
      valueType: 'select',
      editable: false,
      valueEnum: {
        dev: 'dev',
        sit: 'sit',
        uat: 'uat',
      },
      width: '5%',
      render: (text) => <Tag color={'blue'}>{text}</Tag>,
    },
    {
      title: '执行结果',
      dataIndex: 'status',
      width: '5%',
      valueEnum: {
        0: {
          text: '执行中',
          status: 'Default',
        },
        1: {
          text: '成功',
          status: 'Success',
        },
        2: {
          text: '失败',
          status: 'Error',
        },
      },
      render: (text, record) => {
        switch (record.status) {
          case 0:
            return <Tag color={'yellow'}>执行中</Tag>;
          case 1:
            return <Tag color={'green'}>成功</Tag>;
          case 2:
            return <Tag color={'red'}>失败</Tag>;
        }
      },
    },

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: '12%',
      fixed: 'right',
      render: (_, record, __, action) => {
        return (
          <>
            {record.status === 1 && (
              <>
                <a
                  onClick={() => {
                    action?.startEditable(record.id);
                  }}
                >
                  编辑标签
                </a>
                <Divider type={'vertical'} />
                <a
                  onClick={() => {
                    // history.push(`/jacoco/report/detail/uid=${record.uid}`);
                    history.push(`/jacoco/chart/reportId=${record.id}`);
                  }}
                >
                  查看
                </a>
                <Divider type={'vertical'} />
                <a
                  onClick={async () => {
                    try {
                      const blob = await downloadCoCoReport(
                        { id: record.id },
                        { responseType: 'blob' },
                      );
                      // 创建临时的下载链接
                      const objectURL = URL.createObjectURL(blob);
                      let btn: any = document.createElement('a');
                      btn.download = record.report_name;
                      btn.href = objectURL;
                      btn.click();
                      // 清理临时资源
                      URL.revokeObjectURL(objectURL);
                      btn = null;
                    } catch (e) {
                      console.error('下载失败:', e);
                      return;
                      // 处理下载失败的情况
                    }
                  }}
                >
                  下载
                </a>
              </>
            )}
          </>
        );
      },
    },
  ];

  const onSelect = async (
    record: CocoReport,
    selected: boolean,
    selectedRows: CocoReport[],
  ) => {
    if (selected) {
      if (record.status !== 1) {
        message.warning('报告运行中不可合并');
        return false;
      }
    }
  };
  const MergeReport = (
    <Button
      type={'primary'}
      onClick={async () => {
        console.log(selectedRowKeys);

        if (selectedRowKeys.length < 2) {
          message.warning('请选择至少两个报告进行合并');
          return;
        } else {
          const { code, msg } = await mergeCoCoReport({
            report_id_list: selectedRowKeys,
          });
          if (code === 0) {
            message.success(msg);
          }
        }
        setSelectedRowKeys([]);
      }}
    >
      合并报告
    </Button>
  );

  const onPut = async (_: any, record: CocoReport) => {
    console.log(record);
    putReportField(record).then(({ code, data }) => {
      if (code === 0) {
        actionRef.current?.reload();
      }
    });
  };
  return (
    <ProCard>
      <MyProTable
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys);
          },
          getCheckboxProps: (record: CocoReport) => ({
            disabled: record.status !== 1,
          }),
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
          onSelect: onSelect,
        }}
        columns={columns}
        rowKey={'id'}
        request={fetchCocoReport}
        x={1600}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        onSave={onPut}
        actionRef={actionRef}
        toolBarRender={() => [MergeReport]}
      />
    </ProCard>
  );
};

export default Index;
