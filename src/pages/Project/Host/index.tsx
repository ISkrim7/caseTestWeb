import { IHost, ISearch } from '@/api';
import { hostOpt, pageHost } from '@/api/host';
import MyProTable from '@/components/Table/MyProTable';
import AddEnv from '@/pages/Project/Env/AddEnv';
import columns from '@/pages/Project/Host/columns';
import { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

const Index = () => {
  const actionRef = useRef<ActionType>(); //Table action 的引用，便于自定义触发
  const isReload = (value: boolean) => {
    if (value) {
      actionRef.current?.reload();
    }
  };

  const pageHosts = async (value: ISearch) => {
    const { code, data } = await pageHost(value);
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
  const OnSave = async (_: any, record: IHost) => {
    const form = {
      uid: record.uid,
      name: record.name,
      host: record.host,
      port: record.port,
      creator: record.creator,
      updater: record.updater,
    };
    return await hostOpt('PUT', form);
  };
  const OnDelete = async (_: any, record: IHost) => {
    return await hostOpt('DELETE', { uid: record.uid });
  };

  return (
    <MyProTable
      headerTitle={'Host表'}
      actionRef={actionRef}
      columns={columns}
      request={pageHosts}
      rowKey={'uid'}
      onSave={OnSave}
      onDelete={OnDelete}
      toolBarRender={() => [<AddEnv reload={isReload} />]}
    />
  );
};

export default Index;
