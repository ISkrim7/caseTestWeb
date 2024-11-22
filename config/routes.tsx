export default [
  {
    path: '/login',
    exact: true,
    component: '@/pages/User/Login',
    layout: false,
  },
  {
    path: '/home',
    name: '首页',
    icon: 'HomeOutlined',
    component: '@/pages/index',
  },
  {
    name: 'CBS数据构造',
    path: '/CBS',
    icon: 'EditFilled',
    routes: [
      {
        path: '/CBS/structure/house',
        name: '房源构造',
        routes: [
          {
            path: '/CBS/structure/house/newHouse',
            name: '新增房源与楼盘',
            component: '@/pages/CBS/Structure/House',
          },
          {
            path: '/CBS/structure/house/job',
            name: '添加房源动作',
            component: '@/pages/CBS/Structure/House/HouseJob',
          },
        ],
      },
      {
        path: '/CBS/structure/custom',
        name: '客源构造',
        routes: [
          {
            path: '/CBS/structure/custom/job',
            name: '客源构造',
            component: '@/pages/CBS/Structure/Custom',
          },
        ],
      },
      {
        path: '/CBS/structure/sign',
        name: '签约构造',
        routes: [
          {
            path: '/CBS/structure/sign/addContract',
            name: '草签合同',
            component: '@/pages/CBS/Structure/Sign',
          },
          {
            path: '/CBS/structure/sign/job',
            name: '签约动作',
            component: '@/pages/CBS/Structure/Sign/SignJob',
          },
        ],
      },
      {
        path: '/CBS/structure/hz/perf',
        name: '业绩',
        component: '@/pages/CBS/Structure/Perf',
      },
      {
        path: '/CBS/structure/approve',
        name: '审批流',
        component: '@/pages/CBS/Structure/Approve',
      },
      {
        path: '/CBS/structure/baseTurn',
        name: '基础工具',
        component: '@/pages/CBS/Structure/Base',
      },
      {
        path: '/CBS/structure/config',
        name: '构造配置',
        component: '@/pages/CBS/Structure/Config',
      },
    ],
  },
  {
    path: '/',
    redirect: '/home',
  },

  {
    path: '/user',
    name: '用户管理',
    icon: 'user',
    access: 'isAdmin',
    routes: [
      {
        path: '/user/admin',
        name: '用户表',
        access: 'isAdmin',
        component: '@/pages/User/Admin',
      },
      {
        path: '/user/department',
        name: '部门列表',
        access: 'isAdmin',
        component: '@/pages/User/Admin/DepartmentTable',
      },
      {
        path: '/user/center',
        name: 'current',
        component: '@/pages/User/Center',
        hideInMenu: true,
      },
      { component: '@/pages/404' },
    ],
  },
  {
    path: '/user/center',
    name: 'current',
    component: '@/pages/User/Center',
    hideInMenu: true,
  },
  {
    path: '/project',
    name: '项目',
    icon: 'project',
    access: 'isAdmin',
    routes: [
      {
        path: '/project/List',
        name: '项目列表',
        component: '@/pages/Project',
      },
      {
        path: '/project/detail/:uid',
        name: 'projectDetail',
        component: '@/pages/Project/projectDetail',
        hideInMenu: true,
      },
      {
        name: '项目环境',
        path: '/project/host',
        component: '@/pages/Project/Host',
      },
      {
        component: '@/pages/404',
      },
    ],
  },

  {
    path: '/cases',
    name: '测试用例',
    icon: 'BuildFilled',
    access: 'isAdmin',
    routes: [
      {
        path: '/cases/caseHub',
        name: '测试用例',
        component: '@/pages/CaseHub',
      },
    ],
  },

  {
    path: '/ui',
    name: 'UI自动化',
    icon: 'RobotOutlined',
    routes: [
      {
        path: '/ui/cases',
        name: '自动化用例',
        component: '@/pages/UIPlaywright/UICase',
        icon: 'DatabaseOutlined',
      },
      {
        path: '/ui/caseTaskList',
        name: '自动化任务',
        component: '@/pages/UIPlaywright/UICaseTask',
        icon: 'ImportOutlined',
      },

      {
        path: '/ui/statistics',
        name: '自动化统计',
        component: '@/pages/UIPlaywright/UIStatisitc',
      },
      {
        path: '/ui/config',
        name: '自动化配置',
        component: '@/pages/UIPlaywright/Config',
        icon: 'ToolOutlined',
      },
      {
        path: '/ui/addCase/projectId=:projectId',
        name: '添加用例',
        hideInMenu: true,
        component: '@/pages/UIPlaywright/UICase/EditCase',
      },
      {
        path: '/ui/addUITask/projectId=:projectId',
        name: '添加任务',
        hideInMenu: true,
        component: '@/pages/UIPlaywright/UICaseTask/AddUICaseTask',
      },
      {
        path: '/ui/case/detail/caseId=:caseId',
        name: '用例详情',
        hideInMenu: true,
        component: '@/pages/UIPlaywright/UICase/EditCase',
      },
      {
        path: '/ui/case/stepGroup/detail/groupId=:groupId',
        name: '用例组详情',
        hideInMenu: true,
        component:
          '@/pages/UIPlaywright/Config/CommonStepsGroup/StepGroupDetail',
      },
      {
        path: '/ui/task/detail/taskId=:taskId',
        name: '任务详情',
        hideInMenu: true,
        component: '@/pages/UIPlaywright/UICaseTask/AddUICaseTask',
      },
    ],
  },
  {
    path: '/interface',
    name: 'API自动化',
    icon: 'ApiFilled',
    routes: [
      {
        path: '/interface/caseApi',
        name: '接口用例',
        component: '@/pages/Interface',
      },
      {
        path: '/interface/tasks',
        name: '接口任务',
        component: '@/pages/Interface/InterfaceTask',
      },
      {
        path: '/interface/addTasks',
        name: '添加任务',
        component: '@/pages/Interface/InterfaceTask/AddInterfaceTask',
        hideInMenu: true,
      },
      {
        path: '/interface/task/detail/taskId=:taskId',
        name: '任务详情',
        component: '@/pages/Interface/InterfaceTask/AddInterfaceTask',
        hideInMenu: true,
      },
      {
        path: '/interface/task/detail/projectId=:projectId&casePartId=:casePartId',
        name: '增加任务',
        component: '@/pages/Interface/InterfaceTask/AddInterfaceTask',
        hideInMenu: true,
      },
      {
        path: '/interface/caseApi/detail/projectID=:projectID&casePartID=:casePartID&uid=:uid',
        name: '接口详情',
        hideInMenu: true,
        component: '@/pages/Interface/InterfaceDetail',
      },
      {
        path: '/interface/variables',
        name: '全局变量',
        component: '@/pages/Interface/Variable',
      },
      { component: '@/pages/404' },
    ],
  },
  {
    name: '调试',
    path: '/debugger',
    icon: 'BugOutlined',
    access: 'isSuperAdmin',
    routes: [
      {
        path: '/debugger/socket',
        name: 'socket',
        component: '@/pages/DebuggerPage/socket',
      },
    ],
  },
  {
    name: 'Jacoco覆盖',
    path: '/jacoco',
    icon: 'FundOutlined',
    routes: [
      {
        path: '/jacoco/list',
        name: '配置列表',
        component: '@/pages/Jacoco/CocoList',
      },
      {
        path: '/jacoco/report',
        name: '报告列表',
        component: '@/pages/Jacoco/CocoReport',
      },
      {
        path: '/jacoco/chart/reportId=:reportId',
        name: '覆盖率统计',
        hideInMenu: true,
        component: '@/pages/Jacoco/CocoChart',
      },
      {
        path: '/jacoco/chart',
        name: '覆盖率统计',
        component: '@/pages/Jacoco/CocoChart',
      },
      {
        path: '/jacoco/group_chart',
        name: '覆盖率汇总',
        component: '@/pages/Jacoco/CocoChart/Group',
      },
      {
        path: '/jacoco/report/detail/uid=:uid',
        name: '报告详情',
        component: '@/pages/Jacoco/CocoReport/Detail',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/report/history',
    name: '巡检',
    icon: 'HistoryOutlined',
    component: '@/pages/Report/History',
  },
  {
    path: '/report/history/tagId=:tagId',
    name: '巡检',
    hideInMenu: true,
    component: '@/pages/Report/History',
  },
  {
    path: '/report/history/detail/uid=:uid',
    name: '接口批量构建详情',
    hideInMenu: true,
    component: '@/pages/Report/History/Multiple/Detail',
  },
  {
    path: '/report/history/uiTask/detail/uid=:uid',
    name: 'UI批量构建详情',
    hideInMenu: true,
    component: '@/pages/Report/History/UIMultiple/UIDetail',
  },
  {
    path: '/statistic',
    name: '构造统计',
    icon: 'AreaChartOutlined',
    component: '@/pages/Statistic',
  },
  {
    path: '/collect',
    name: '需求&BUG收集',
    icon: 'BugOutlined',
    component: '@/pages/CBS/Structure/Collect',
  },
  {
    component: '@/pages/404',
  },
];
