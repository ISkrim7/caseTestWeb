import { IModule } from '@/api';
import {
  insertModule,
  queryTreeModuleByProject,
  removeModule,
  updateModule,
} from '@/api/base';
import EmptyModule from '@/pages/DebuggerPage/part/LeftComponents/EmptyModule';
import {
  getParentKey,
  module2Tree,
} from '@/pages/DebuggerPage/part/LeftComponents/func';
import ModuleModal from '@/pages/DebuggerPage/part/LeftComponents/ModuleModal';
import { useAccess } from '@@/exports';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Dropdown,
  Input,
  MenuProps,
  message,
  Modal,
  Space,
  Tooltip,
  Tree,
  Typography,
} from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';

const { Search } = Input;
const { Text } = Typography;
type HandleAction = {
  title: string;
  key: number;
};
// 定义 Handle 类型
type IHandle = {
  AddRoot: HandleAction;
  AddChild: HandleAction;
  EditModule: HandleAction;
  RemoveModule: HandleAction;
};

// 修正 Handle 对象
const Handle: IHandle = {
  AddRoot: { title: '新增模块', key: 1 },
  AddChild: { title: '新增子模块', key: 2 },
  EditModule: { title: '编辑模块', key: 3 },
  RemoveModule: { title: '删除模块', key: 4 },
};

interface IProps {
  currentProjectId?: number;
  moduleType: number;
  setCurrentModuleId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const ModuleTree: FC<IProps> = (props) => {
  const { currentProjectId, moduleType, setCurrentModuleId } = props;
  const { isAdmin } = useAccess();
  const [reload, setReload] = useState(0);
  const [modules, setModules] = useState<IModule[]>([]);
  const [modulesTree, setModulesTree] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<IModule | null>(null);
  const [handleModule, setHandleModule] = useState<HandleAction>(
    Handle.AddRoot,
  );
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  /**
   * 查询module
   */
  useEffect(() => {
    if (currentProjectId) {
      queryTreeModuleByProject(currentProjectId, moduleType).then(
        ({ code, data }) => {
          if (code === 0 || data) {
            setModules(data);
            setModulesTree(module2Tree(data));
          }
        },
      );
    }
  }, [currentProjectId, reload]);

  /**
   * 数渲染
   */
  const TreeModule = useMemo(() => {
    const loop: any = (data: IModule[]) =>
      data.map((item: any) => {
        const strTitle = item.title;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: 'red' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return {
            title,
            // isRoot: item.isRoot,
            // rootID: item.rootID,
            key: item.key,
            children: loop(item.children),
          };
        }
        return {
          title,
          // isRoot: item.isRoot,
          // rootID: item.rootID,
          key: item.key,
        };
      });
    return loop(modules);
  }, [modules, searchValue]);

  /**
   * 刷新
   */
  const handleReload = async () => {
    setReload(reload + 1);
  };

  const menuItem = (node: IModule): MenuProps['items'] => {
    return [
      {
        key: '1',
        label: '编辑',
        onClick: async () => {
          console.log('click 编辑', node);
          setOpen(true);
          setCurrentModule(node);
          setHandleModule(Handle.EditModule);
        },
        icon: <EditOutlined />,
      },
      {
        key: '2',
        label: '删除',
        onClick: async () => {
          return Modal.confirm({
            title: '你确定要删除这个目录吗?',
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            okType: 'danger',
            cancelText: '点错了',
            onOk() {
              removeModule({ moduleId: node.key }).then(
                async ({ code, msg }) => {
                  if (code === 0) {
                    message.success(msg);
                    await handleReload();
                  }
                },
              );
            },
          });
        },
        icon: <DeleteOutlined />,
      },
    ];
  };

  const TreeTitleRender = (tree: IModule) => {
    return (
      <div
        onMouseOver={() => {
          setCurrentModule(tree);
        }}
        onMouseLeave={() => {
          setCurrentModule(null);
        }}
        onClick={() => {
          setCurrentModule(tree);
        }}
      >
        <Text type={'secondary'} strong>
          {tree.title}
        </Text>
        {isAdmin && (
          <>
            {currentModule && currentModule.key === tree.key ? (
              <Text style={{ float: 'right' }}>
                <PlusOutlined
                  onClick={async (event) => {
                    event.stopPropagation();
                    setCurrentModule(tree);
                    setHandleModule(Handle.AddChild);
                    setOpen(true);
                  }}
                />
                <Dropdown
                  menu={{ items: menuItem(tree) }}
                  trigger={['click', 'hover']}
                  placement="bottomRight"
                >
                  <Text onClick={(e) => e.preventDefault()}>
                    <MoreOutlined />
                  </Text>
                </Dropdown>
              </Text>
            ) : null}
          </>
        )}
      </div>
    );
  };

  const OnSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    const newExpandedKeys = modulesTree
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, modules);
        }
        return null;
      })
      .filter(
        (item, i, self): item is React.Key =>
          !!(item && self.indexOf(item) === i),
      );
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(true);
  };

  const onModuleFinish = async (value: { title: string }) => {
    console.log('onModuleFinish', currentModule);
    console.log('handleModule', handleModule);
    switch (handleModule) {
      case Handle.AddRoot:
        if (currentModule === null && currentProjectId) {
          const { code, msg } = await insertModule({
            title: value.title,
            project_id: currentProjectId,
            module_type: moduleType,
          });
          if (code === 0) {
            message.success(msg);
            setOpen(false);
            await handleReload();
          }
        }
        break;
      case Handle.AddChild:
        if (currentProjectId && currentModule) {
          const { code, msg } = await insertModule({
            title: value.title,
            project_id: currentProjectId,
            module_type: moduleType,
            parent_id: currentModule.key,
          });
          if (code === 0) {
            message.success(msg);
            setOpen(false);
            await handleReload();
          }
        }
        break;
      case Handle.EditModule:
        console.log('编辑模块');
        console.log('currentModule', currentModule);
        if (currentProjectId && currentModule) {
          const { code, msg } = await updateModule({
            id: currentModule.key,
            title: value.title,
          });
          if (code === 0) {
            message.success(msg);
            setOpen(false);
            await handleReload();
          }
        }
        break;
    }
  };

  return (
    <>
      <ModuleModal
        title={handleModule.title}
        open={open}
        onFinish={onModuleFinish}
        setOpen={setOpen}
      />

      {modules.length > 0 ? (
        <Space direction={'vertical'}>
          <Search
            enterButton
            style={{ marginBottom: 8, marginTop: 12, marginRight: 10 }}
            placeholder="模块查询"
            width={'100%'}
            suffix={
              isAdmin && (
                <Tooltip title={'点击可新建根模块。子模块需要在树上新建'}>
                  <a
                    onClick={() => {
                      setHandleModule(Handle.AddRoot);
                      setCurrentModule(null);
                      setOpen(true);
                    }}
                  >
                    <PlusOutlined style={{ color: 'black' }} />
                  </a>
                </Tooltip>
              )
            }
            onChange={OnSearchChange}
          />
          <Tree
            showLine
            draggable={isAdmin} //admin 可拖动
            blockNode //是否节点占据一行
            onExpand={(newExpandedKeys: React.Key[]) => {
              setExpandedKeys(newExpandedKeys);
              setAutoExpandParent(false);
            }}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            // defaultExpandedKeys={['0-0-0', '0-0-1']}
            // defaultSelectedKeys={['0-0-1']}
            // defaultCheckedKeys={['0-0-0', '0-0-1']}
            // onSelect={onSelect}
            // onCheck={onCheck}
            onSelect={(keys: React.Key[], info: any) => {
              console.log(info);
              setCurrentModuleId(info.node.key);
            }}
            treeData={TreeModule}
            titleRender={TreeTitleRender}
          />
        </Space>
      ) : (
        <>
          {isAdmin && (
            <EmptyModule
              currentProjectId={currentProjectId}
              moduleType={moduleType}
              callBack={handleReload}
            />
          )}
        </>
      )}
    </>
  );
};

export default ModuleTree;
