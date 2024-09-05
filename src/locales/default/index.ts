import tool from '../default/tool';
import auth from './auth';
import chat from './chat';
import clerk from './clerk';
import common from './common';
import components from './components';
import dashboard from './dashboard';
import error from './error';
import file from './file';
import healthform from './healthform';
import knowledgeBase from './knowledgeBase';
import market from './market';
import metadata from './metadata';
import migration from './migration';
import modelProvider from './modelProvider';
import plugin from './plugin';
import portal from './portal';
import query from './query';
import setting from './setting';
import welcome from './welcome';

const resources = {
  auth,
  chat,
  clerk,
  common,
  components,
  dashboard,
  error,
  file,
  healthform,
  knowledgeBase,
  market,
  metadata,
  migration,
  modelProvider,
  plugin,
  portal,
  query,
  setting,
  tool,
  welcome,
} as const;

export default resources;
