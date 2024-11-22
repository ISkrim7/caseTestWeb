interface ICounter {
  count: number;
}

export default {
  namespace: 'counter',
  state: {
    count: 0,
  },
  reducers: {
    add(state: ICounter) {
      return { ...state, count: state.count + 1 };
    },
    minus(state: ICounter) {
      return { ...state, count: state.count - 1 };
    },
  },
};
