import { IResponse } from '@/api';
import { message } from 'antd';

interface ResponseData {
  code: number;
  data?: any;
  message?: string;
}

/**
 * 基础请求函数
 * @param url 请求地址
 * @param options 请求配置
 */
export async function request<T = any>(
  url: string,
  options: RequestInit & {
    data?: any;
    params?: Record<string, any>;
    responseType?: 'json' | 'blob';
  } = {},
): Promise<IResponse<T>> {
  const { data, params, responseType = 'json', ...restOptions } = options;

  // 处理查询参数
  let requestUrl = url;
  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, String(value));
      }
    });
    requestUrl = `${url}?${query.toString()}`;
  }

  // 设置请求头
  const headers = new Headers(restOptions.headers);
  if (data && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    console.log('Request:', { url: requestUrl, options: restOptions, data });
    const response = await fetch(requestUrl, {
      ...restOptions,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    console.log('Response:', {
      url: requestUrl,
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Request failed:', {
        url: requestUrl,
        status: response.status,
        error: errorText,
      });
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`,
      );
    }

    let result;
    if (responseType === 'blob') {
      try {
        // 尝试先解析为JSON，可能是包装的IResponse结构
        const text = await response.text();
        try {
          const json = JSON.parse(text);
          if (
            json &&
            typeof json === 'object' &&
            'code' in json &&
            'data' in json
          ) {
            return json as IResponse<T>;
          }
        } catch {
          // 不是JSON，回退到blob处理
          const blob = new Blob([text]);
          return {
            code: 0,
            msg: '',
            data: blob as T,
          };
        }
      } catch (error) {
        console.error('Failed to process blob response:', error);
        return {
          code: -1,
          msg: 'Failed to process blob response',
          data: null as any,
        };
      }
    } else {
      result = await response.json();
    }

    // 根据实际后端接口结构调整
    return {
      code: 0, // 假设成功返回code为0
      msg: '',
      data: result,
    };
  } catch (error) {
    message.error('请求失败');
    console.error('Request failed:', error);
    return {
      code: -1,
      msg: error instanceof Error ? error.message : 'Unknown error',
      data: null as any,
    };
  }
}
