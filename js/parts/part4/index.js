export { part4Config } from './config.js';
export * from './data.js';

import { part4Config } from './config.js';
import * as data from './data.js';

const { default: _default, ...namedData } = data;

export const part4Definition = {
  id: part4Config.id,
  config: part4Config,
  ...namedData
};
