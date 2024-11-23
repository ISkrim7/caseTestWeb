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
      target: 'http://10.1.1.110:5050',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
};

export default proxy;
