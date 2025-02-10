import {
  allUIJobs,
  getTaskJobNextRunTime,
  setUITaskSwitch,
} from '@/api/play/task';
import MyProTable from '@/components/Table/MyProTable';
import { IUITask } from '@/pages/Play/componets/uiTypes';
import { queryData } from '@/utils/somefunc';
import { history } from '@@/core/history';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { message, Switch, Tag } from 'antd';
import { useCallback, useRef } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发

  const fetchJobs = useCallback(async () => {
    const { code, data } = await allUIJobs();
    return queryData(code, data);
  }, []);

  const setTaskSwitch = async (uid: string, flag: boolean) => {
    const { code } = await setUITaskSwitch({ jobId: uid, switch: flag });
    if (code === 0) {
      if (flag) {
        message.success('已重启任务');
      } else {
        message.success('已暂停任务');
      }
    }
    actionRef.current?.reload();
  };
  const getNextTime = async (record: IUITask) => {
    const { code, data, msg } = await getTaskJobNextRunTime({
      jobId: record.uid,
    });
    if (code === 0) {
      return data;
    }
  };
  const columns: ProColumns<IUITask>[] = [
    {
      title: '任务编号',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      width: '10%',
      copyable: true,
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              history.push(`/play/task/detail/taskId=${record.id}`);
            }}
          >
            {record.uid}
          </a>
        );
      },
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => {
        return <Tag color={'geekblue-inverse'}>{record.title}</Tag>;
      },
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === 'RUNNING') {
          return <Tag color={'green'}>{text}</Tag>;
        } else {
          return <Tag color={'blue'}>{text}</Tag>;
        }
      },
    },
    {
      title: '开启中',
      hideInSearch: true,
      dataIndex: 'switch',
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            onClick={async (checked) => {
              await setTaskSwitch(record.uid, checked);
            }}
            value={record.switch}
          />
        );
      },
    },
    {
      title: 'next',
      dataIndex: 'next',

      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (_, record) => {},
    },
  ];

  return (
    <MyProTable
      search={false}
      // @ts-ignore
      polling={15}
      actionRef={actionRef}
      rowKey={'id'}
      columns={columns}
      request={fetchJobs}
    />
  );
};

export default Index;
