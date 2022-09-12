import config from './configs/config.json';

const rules = {
  'no-unary-expression': require('./rules/no-unary-expression'),
};

export = {
  rules,
  configs: { config },
};
