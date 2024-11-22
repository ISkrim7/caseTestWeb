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
}

interface ITarget {
  [targetName: string]: { [propName: string]: IProxy };
}

const proxy: ITarget = {
  dev: {
    '/api': {
      // target: 'http://192.168.101.48:5050',
      target: 'http://10.1.6.39:5050',
      // target: 'http://10.1.11.172:5050', //xb
      ws: true,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/aps': {
      target: 'http://10.1.6.39:6060',
      ws: true,
      changeOrigin: true,
      pathRewrite: { '^/aps': '' },
    },
  },

  pro: {
    '/api': {
      target: 'http://10.10.137.210:5050',
      ws: true,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};

export default proxy;
