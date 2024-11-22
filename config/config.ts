import { defineConfig } from 'umi';
import Settings from './defaultSetting';
import proxy from './proxy';
import routes from './routes';

const { APP_ENV } = process.env;

export default defineConfig({
  esbuildMinifyIIFE: true,
  theme: {
    'root-entry-name': 'variable',
  },
  fastRefresh: true,
  proxy: proxy[APP_ENV as keyof typeof proxy],
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
