import { defineConfig } from 'umi';
import Settings from './defaultSetting';
import routes from './routes';

const { APP_ENV = 'dev' } = process.env;
export default defineConfig({
  esbuildMinifyIIFE: true,
  theme: {
    'root-entry-name': 'variable',
  },
  fastRefresh: true,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5050',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  layout: {
    ...Settings,
  },
  routes,
  model: {},
  antd: {
    theme: {},
  },
  request: {
    dataField: '',
  },
  initialState: {},
  dva: {},
  hash: true,
  access: {},
  manifest: {
    basePath: '/',
  },
  mfsu: {},
});
