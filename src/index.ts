import config from './configs/config.json';

const rules = {
  'no-unary-expression': require('./rules/no-unary-expression'),
  'no-multiple-logical-not': require('./rules/no-multiple-logic-not'),
};

export = {
  rules,
  configs: { config },
};
