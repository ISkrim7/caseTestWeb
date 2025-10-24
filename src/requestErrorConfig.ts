import { IResponse } from '@/api';
import { clearToken, getToken } from '@/utils/token';
import { history } from '@@/core/history';
import { RequestConfig } from '@@/plugin-request/request';
import { message } from 'antd';

const requestInterceptors = async (url: string, options: RequestConfig) => {
  const token = getToken();
  if (token !== null) {
    const authHeader = { Authorization: token };
    const BaseHeader = {
      'Content-Type': 'application/json',
    };
    return {
      url: `${url}`,
      options: {
        ...options,
        interceptors: true,
        headers: { ...authHeader, ...BaseHeader },
      },
    };
  }
  return {
    url: `${url}`,
    options: { ...options, interceptors: true },
  };
};
const loginPath = '/userLogin';

const isBlob = async (response: any) => {
  if (response.data instanceof Blob) {
    // 从响应头获取文件名或使用默认文件名
    const contentDisposition = response.headers['content-disposition'];
    const finalFileName = contentDisposition?.match(/filename="?(.+)"?/)?.pop();

    // 创建下载链接
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();

    // 清理
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
};

const responseInterceptors = async (response: any) => {
  const data = response.data;

  await isBlob(response);

  if (data.code !== 0) {
    console.log('responseInterceptors', data);
    message.error(data.msg);
    if (data.code === 4000) {
      clearToken();
      history.push(loginPath);
    }
  }
  return response;
};

export const errorConfig: RequestConfig = {
  // 统一的请求设定
  // timeout: 1000,
  // headers: {'X-Requested-With': 'XMLHttpRequest'},

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: IResponse<any>) => {
      const { code, data, msg } = res;
      console.log('errorThrower', res);
      if (code !== 0) {
        const error: any = new Error(msg);
        error.name = 'HubError';
        error.info = { code, msg, errorType: 2, data };
        console.log('throw', error);
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: async (error: any, opts: any) => {
      console.log('errorHandler', error);
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'HubError') {
        const errorInfo: IResponse<any> | undefined = error.info;
        console.log('==', errorInfo);

        if (errorInfo) {
          const { msg, code } = errorInfo;
          if (msg) {
            message.error(msg);
          }
        }
      } else if (error.response) {
        console.log('error.response', error.response);
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        const data = error.response.data;
        if (data.msg) {
          message.error(`${data.msg}`);
        } else {
          message.error('Service Error');
        }
      } else if (error.request) {
        console.log('error.request', error.request);

        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        console.log('else');
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [requestInterceptors],

  // 响应拦截器
  responseInterceptors: [responseInterceptors],
};
