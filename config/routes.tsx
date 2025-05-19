export default [
  {
    path: '/userLogin',
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
      // {
      //   path: '/user/department',
      //   name: '部门列表',
      //   access: 'isAdmin',
      //   component: '@/pages/User/Admin/DepartmentTable',
      // },
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
        path: '/project/Env',
        name: '环境',
        component: '@/pages/Project/Env',
      },
      {
        path: '/project/DB',
        name: '数据库',
        component: '@/pages/Project/Db',
      },
      {
        path: '/project/apsConfig',
        name: '调度任务',
        component: '@/pages/Project/Aps',
      },
      {
        path: '/project/push',
        name: '推送配置',
        component: '@/pages/Project/Push',
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
        component: '@/pages/Play/PlayCase',
        icon: 'DatabaseOutlined',
      },
      {
        path: '/ui/task',
        name: '自动化任务',
        component: '@/pages/Play/PlayTask',
        icon: 'ImportOutlined',
      },

      {
        path: '/ui/config',
        name: '自动化配置',
        component: '@/pages/Play/PlayConfig',
        icon: 'ToolOutlined',
      },
      {
        path: '/ui/report',
        name: '自动化报告',
        component: '@/pages/Play/PlayResult/PlayTaskResultTable.tsx',
      },
      {
        path: '/ui/report/detail/resultId=:resultId',
        name: '自动化详情',
        hideInMenu: true,
        component: '@/pages/Play/PlayResult/PlayTaskResult.tsx',
      },
      {
        path: '/ui/addCase',
        name: '添加用例',
        hideInMenu: true,
        component: '@/pages/Play/PlayCase/PlayCaseDetail',
      },
      {
        path: '/ui/case/detail/caseId=:caseId',
        name: '用例详情',
        hideInMenu: true,
        component: '@/pages/Play/PlayCase/PlayCaseDetail',
      },
      {
        path: '/ui/addTask',
        name: '添加任务',
        hideInMenu: true,
        component: '@/pages/Play/PlayTask/PlayTaskDetail',
      },
      {
        path: '/ui/task/detail/taskId=:taskId',
        name: '任务详情',
        hideInMenu: true,
        component: '@/pages/Play/PlayTask/PlayTaskDetail',
      },
      // {
      //   path: '/ui/case/stepGroup/detail/groupId=:groupId',
      //   name: '用例组详情',
      //   hideInMenu: true,
      //   component:
      //     '@/pages/UIPlaywright/Config/CommonStepsGroup/StepGroupDetail',
      // },
    ],
  },
  {
    path: '/interface',
    name: 'API自动化',
    icon: 'ApiFilled',
    routes: [
      {
        path: '/interface/interApi/api',
        name: '公共接口&组',
        component: '@/pages/Httpx/Interface',
      },

      {
        path: '/interface/interApi/detail/interId=:interId',
        name: '接口详情添加',
        hideInMenu: true,
        component: '@/pages/Httpx/Interface/InterfaceApiDetail',
      },
      {
        path: '/interface/interApi/detail',
        name: '接口详情',
        hideInMenu: true,
        component: '@/pages/Httpx/Interface/InterfaceApiDetail',
      },
      {
        path: '/interface/group/detail',
        name: '添加group',
        hideInMenu: true,
        component: '@/pages/Httpx/Interface/interfaceApiGroup/GroupApiDetail',
      },
      {
        path: '/interface/group/detail/groupId=:groupId',
        name: '添加group',
        hideInMenu: true,
        component: '@/pages/Httpx/Interface/interfaceApiGroup/GroupApiDetail',
      },
      {
        path: '/interface/caseApi/cases',
        name: '业务场景',
        component: '@/pages/Httpx/InterfaceApiCase',
      },
      {
        path: '/interface/caseApi/detail',
        name: '接口用例详情',
        hideInMenu: true,
        component: '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail',
      },
      {
        path: '/interface/caseApi/detail/caseApiId=:caseApiId',
        name: '业务用例',
        hideInMenu: true,
        component: '@/pages/Httpx/InterfaceApiCase/InterfaceApiCaseDetail',
      },

      {
        path: '/interface/tasks',
        name: '自动化任务',
        component: '@/pages/Httpx/InterfaceApiCaseTask',
      },
      {
        path: '/interface/task/history',
        name: '任务执行历史',
        component:
          '@/pages/Httpx/InterfaceApiTaskResult/InterfaceApiTaskResultTable.tsx',
      },
      {
        path: '/interface/task/report/detail/resultId=:resultId',
        name: '任务执行历史详情',
        hideInMenu: true,
        component:
          '@/pages/Httpx/InterfaceApiTaskResult/InterfaceApiTaskResultDetail.tsx',
      },
      {
        path: '/interface/task/detail',
        name: '添加任务',
        component:
          '@/pages/Httpx/InterfaceApiCaseTask/InterfaceApiCaseTaskDetail',
        hideInMenu: true,
      },
      {
        path: '/interface/task/detail/taskId=:taskId',
        name: '添加任务',
        component:
          '@/pages/Httpx/InterfaceApiCaseTask/InterfaceApiCaseTaskDetail',
        hideInMenu: true,
      },
      {
        path: '/interface/interApi/record',
        name: '接口录制',
        component: '@/pages/Httpx/InterfaceApiRecord',
      },
      {
        path: '/interface/interApi/config',
        name: '全局配置',
        component: '@/pages/Httpx/InterfaceConfig',
      },
      {
        path: '/interface/interApi/perf',
        name: '压力测试',
        component: '@/pages/Httpx/InterfacePerf',
      },
      {
        path: '/interface/interApi/perf/detail/perfId=:perfId',
        name: '压力测试看板',
        hideInMenu: true,
        component: '@/pages/Httpx/InterfacePerf/PerfDetail',
      },
      { component: '@/pages/404' },
    ],
  },
  {
    name: '调试',
    path: '/debugger',
    icon: 'BugOutlined',
    routes: [
      {
        path: '/debugger/socket',
        name: 'socket',
        component: '@/pages/DebuggerPage/socket',
      },
      {
        path: '/debugger/table',
        name: 'table',
        component: '@/pages/DebuggerPage/Debugge',
      },
      {
        path: '/debugger/mind',
        name: 'mind',
        component: '@/pages/DebuggerPage/Mind',
      },
      {
        path: '/debugger/plist',
        name: 'List',
        component: '@/pages/DebuggerPage/ProList',
      },
      {
        path: '/debugger/jp',
        name: 'Jsonpath',
        component: '@/pages/Httpx/componets/JsonPathTool.tsx',
      },
    ],
  },
  {
    component: '@/pages/404',
  },
];
