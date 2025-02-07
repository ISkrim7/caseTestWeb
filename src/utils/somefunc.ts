export const pageData = async (code: number, data: any, setter?: any) => {
  if (code === 0) {
    if (setter) {
      setter(data.items);
    }
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
};

export const queryData = async (code: number, data: any, setter?: any) => {
  if (code === 0) {
    if (setter) {
      setter(data);
    }
    return {
      data: data,
      total: data.length,
      success: true,
    };
  }
  return {
    data: [],
    success: false,
    total: 0,
  };
};
