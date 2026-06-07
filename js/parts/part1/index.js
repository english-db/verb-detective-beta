export { part1Config } from './config.js';
export * from './data.js';

import { part1Config } from './config.js';
import * as data from './data.js';

const { default: _default, ...namedData } = data;

export const part1Definition = {
  id: part1Config.id,
  config: part1Config,
  ...namedData
};
