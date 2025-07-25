/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

interface IProxy {
  target: string;
  ws?: boolean;
  changeOrigin: boolean;
  pathRewrite?: {};
  headers?: Record<string, string>;
}

interface ITarget {
  [targetName: string]: { [propName: string]: IProxy };
}

const proxy: ITarget = {
  dev: {
    '/api': {
      target: 'http://127.0.0.1:5050',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/mock': {
      target: 'http://127.0.0.1:5050',
      changeOrigin: true,
      // 添加以下配置
      headers: {
        'Access-Control-Allow-Headers': 'X-Mock-Request, Content-Type', // 允许自定义头
      },
    },
  },
  hb: {
    '/api': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    },
  },
};

export default proxy;
