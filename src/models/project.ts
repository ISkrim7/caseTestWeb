import { IProject } from '@/api';
import { queryProject } from '@/api/base';

export interface ProjectItem {
  label: string;
  value: number;
}
export interface ProjectsState {
  projects: ProjectItem[];
}

export default {
  namespace: 'projects', // Model 的命名空间
  state: {
    projects: [], // 初始状态
  },
  effects: {
    // 异步请求
    // @ts-ignore
    *fetchProjects(_, { call, put }) {
      const { code, data } = yield call(queryProject);
      if (code === 0) {
        const projects = data.map((item: IProject) => ({
          label: item.title,
          value: item.id,
        }));
        yield put({ type: 'saveProjects', payload: projects });
      }
    },
  },
  reducers: {
    // 同步更新状态
    saveProjects(
      state: ProjectsState,
      { payload }: { payload: ProjectItem[] },
    ) {
      return {
        ...state,
        projects: payload,
      };
    },
  },
};
