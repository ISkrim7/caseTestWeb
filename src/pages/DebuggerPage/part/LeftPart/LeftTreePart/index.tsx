import { ICasePart, IObjGet } from '@/api';
import {
  dropCasePart,
  insertCasePart,
  putCasePart,
  queryTreePartByProject,
  removeCasePart,
} from '@/api/base';
import NewDirectoryModal from '@/components/LeftPart/LeftTreePart/newDirectoryModal';
import { getPart, setPart } from '@/utils/token';
import { useAccess, useModel } from '@@/exports';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Dropdown,
  Empty,
  Input,
  MenuProps,
  message,
  Modal,
  Space,
  Tooltip,
  Tree,
  TreeProps,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

const { Search } = Input;

interface SelfProps {
  currentProjectId?: number;
  setCurrentCasePartId: any;
  perKey?: string;
}

const Index: React.FC<SelfProps> = ({
  perKey,
  currentProjectId,
  setCurrentCasePartId,
}) => {
  const { isAdmin } = useAccess();
  const [currentCasePart, setCurrentCasePart] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [partsData, setPartsData] = useState<any[]>([]);
  const [partDataList, setPartDataList] = useState<any[]>([]); // 使用状态来管理树形数据
  const [nodeKey, setNodeKey] = useState<any>(null);
  const [todo, setTodo] = useState<boolean>(true);
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState<string>('新建目录');
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState<any>();
  const [edit, setEdit] = useState(0);
  const { initialState } = useModel('@@initialState');
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<React.Key[]>();

  // 获取case part 数据
  useEffect(() => {
    if (currentProjectId) {
      queryTreePartByProject(currentProjectId).then(({ code, data }) => {
        if (code === 0 || data) {
          setPartsData(data);
        }
      });
    }
  }, [currentProjectId, edit]);

  // 树处理、如果有TOKEN 默认TOKEN
  useEffect(() => {
    if (partsData) {
      console.log(partsData);
      const generatedTreeData = generatePartList(partsData);
      setPartDataList(generatedTreeData); // 更新树形数据状态

      const TOKEN_PART_NUMBER = getPart(perKey);
      console.log(TOKEN_PART_NUMBER);
      if (TOKEN_PART_NUMBER) {
        const tokenKey = parseInt(TOKEN_PART_NUMBER);
        const selectedPart = generatedTreeData.find(
          ({ key }) => key === tokenKey,
        );

        if (selectedPart) {
          const { rootID, key } = selectedPart;

          // 设置展开的根节点和选中的节点
          if (rootID) {
            setExpandedKeys([rootID]);
          }
          setDefaultSelectedKeys([key]);
          setCurrentCasePartId(key);
          setCurrentCasePart([key]);
          setNodeKey(key);
        }
      }
    }
  }, [partsData]);
  // 目录展开
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const getParentKey = (key: React.Key, partData: ICasePart[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < partData.length; i++) {
      const node = partData[i];
      if (node.children) {
        if (node.children.some((item: any) => item.id === key)) {
          parentKey = node.id as React.Key;
          break;
        } else {
          const parent = getParentKey(key, node.children);
          if (parent) {
            parentKey = parent;
            break; // Exit loop if parentKey is found in children
          }
        }
      }
    }
    return parentKey!;
  };

  /**
   * casePart 数据转树结构
   * @param data
   */
  const generatePartList = (
    data: any[],
  ): {
    key: React.Key;
    title: string;
    rootID: number | null;
    isRoot: boolean;
  }[] => {
    const partList: any[] = [];
    const traverse = (nodes: any[]) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const { id, title, rootID, isRoot } = node;
        partList.push({
          key: id,
          title: title,
          rootID: rootID,
          isRoot: isRoot,
        });
        if (node.children) {
          traverse(node.children);
        }
      }
    };
    traverse(data);
    return partList;
  };

  const treeData = useMemo(() => {
    const loop = (data: ICasePart[]): any =>
      data.map((item) => {
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
            isRoot: item.isRoot,
            rootID: item.rootID,
            key: item.id,
            children: loop(item.children),
          };
        }
        return {
          title,
          isRoot: item.isRoot,
          rootID: item.rootID,
          key: item.id,
        };
      });
    return loop(partsData);
  }, [partsData, searchValue]);

  const menuItem = (node: any): MenuProps['items'] => {
    return [
      {
        key: '1',
        label: '编辑',
        onClick: () => handleItemClick(2, node),
        icon: <EditOutlined />,
      },
      {
        key: '2',
        label: '删除',
        onClick: () => handleItemClick(3, node),
        icon: <DeleteOutlined />,
      },
    ];
  };

  // 目录操作
  const handleItemClick = (key: number, node: any) => {
    const actions: IObjGet = {
      1: () => {
        setCurrentNode(node);
        setModalTitle('新增目录');
        setRecord({ title: '' });
        setOpen(true);
        setTodo(true);
      },
      2: () => {
        setCurrentNode(node);
        setModalTitle('编辑目录');
        setOpen(true);
        setTodo(false);
      },
      3: () => {
        Modal.confirm({
          title: '你确定要删除这个目录吗?',
          icon: <ExclamationCircleOutlined />,
          content: '删除后，目录下的case也将不再可见！！！',
          okText: '确定',
          okType: 'danger',
          cancelText: '点错了',
          onOk() {
            onDeleteCasePart(node.key).then();
          },
        });
      },
    };
    actions[key]?.();
  };
  //删除用例分组
  const onDeleteCasePart = async (id: number) => {
    const { code } = await removeCasePart(id);
    if (code === 0) {
      setEdit(edit + 1);
    }
  };

  const onDrop: TreeProps['onDrop'] = async (info) => {
    const body = {
      id: info.dragNode.key,
      targetId: info.dropToGap ? null : info.node.key,
    };
    const { code } = await dropCasePart(body);
    if (code === 0) {
      setEdit(edit + 1);
    }
  };

  const onCreateOrUpdateCasePart = async (value: { title: string }) => {
    console.log('title', value);
    console.log('todo', todo);
    // 在root或者子目录上
    const body: any = {};
    if (currentNode) {
      body.projectID = currentProjectId;
      body.parentID = todo ? currentNode.key || undefined : undefined;
      body.id = todo ? undefined : currentNode.key;
      body.title = value.title;
      body.isRoot = false;
      // 在root上新增？
      if (currentNode.isRoot === true) {
        body.rootID = currentNode.key;
      } else {
        body.rootID = currentNode.rootID;
      }
    } else {
      body.projectID = currentProjectId;
      body.title = value.title;
      body.isRoot = true;
    }
    const apiFn = todo ? insertCasePart : putCasePart;
    const { code, msg } = await apiFn(body);
    if (code === 0) {
      message.success(msg);
      setOpen(false);
      setEdit(edit + 1);
    }
  };

  /**
   * 搜索
   * @param e
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    const newExpandedKeys = partDataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, partsData);
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
  return (
    <>
      <NewDirectoryModal
        title={modalTitle}
        open={open}
        setOpen={setOpen}
        onFinish={onCreateOrUpdateCasePart}
      />
      {treeData.length > 0 ? (
        <Space direction={'vertical'}>
          <Search
            enterButton
            style={{ marginBottom: 8, marginTop: 12, marginRight: 10 }}
            placeholder="模块查询"
            suffix={
              isAdmin && (
                <Tooltip title={'点击可新建根目录。子目录需要在树上新建'}>
                  <a
                    onClick={() => {
                      setOpen(true);
                      setRecord({ title: '' });
                      setCurrentNode(null);
                      setTodo(true);
                    }}
                  >
                    <PlusOutlined style={{ color: 'black' }} />
                  </a>
                </Tooltip>
              )
            }
            onChange={onChange}
          />
          <Tree
            showLine
            draggable={isAdmin} //admin 可拖动
            blockNode //是否节点占据一行
            onDrop={onDrop} //拖拽结束触发
            onExpand={onExpand} //展开/收起节点时触发
            expandedKeys={expandedKeys} //（受控）展开指定的树节点
            autoExpandParent={autoExpandParent} //是否自动展开父节点
            treeData={treeData} //渲染树节点
            defaultSelectedKeys={defaultSelectedKeys}
            defaultCheckedKeys={defaultSelectedKeys}
            defaultExpandAll={true}
            onSelect={(keys: React.Key[], info: any) => {
              if (keys[0] != currentCasePart[0]) {
                setPart(info.node.key, perKey); // set token
                setCurrentCasePartId(info.node.key);
                setCurrentCasePart([keys[0]]);
              }
            }}
            titleRender={(partDataList: any) => {
              return (
                <div
                  onMouseOver={() => setNodeKey(partDataList.key)}
                  onMouseLeave={() => setNodeKey(null)}
                  onClick={() => setNodeKey(partDataList.key)}
                >
                  <span style={{ color: 'gray', fontSize: 15 }}>
                    {partDataList.title}
                  </span>
                  {initialState?.currentUser?.isAdmin ? (
                    <>
                      {nodeKey === partDataList.key ? (
                        <>
                          <span style={{ float: 'right' }}>
                            <PlusOutlined
                              onClick={(event) => {
                                event.stopPropagation();
                                handleItemClick(1, partDataList);
                              }}
                            />
                            <Dropdown
                              menu={{ items: menuItem(partDataList) }}
                              placement="bottomRight"
                              trigger={['click', 'hover']}
                            >
                              <a onClick={(e) => e.preventDefault()}>
                                <MoreOutlined />
                              </a>
                            </Dropdown>
                          </span>
                        </>
                      ) : null}
                    </>
                  ) : null}
                </div>
              );
            }}
          />
        </Space>
      ) : (
        <Empty
          description={
            <div>
              还没有目录
              <a
                onClick={() => {
                  setOpen(true);
                  setRecord({ title: '' });
                  setModalTitle('新建根目录');
                  setCurrentNode(null);
                }}
              >
                添加
              </a>
              一个
            </div>
          }
        />
      )}
    </>
  );
};
export default Index;
