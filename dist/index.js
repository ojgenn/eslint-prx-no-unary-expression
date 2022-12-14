"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config_json_1 = __importDefault(require("./configs/config.json"));
const rules = {
    'no-unary-expression': require('./rules/no-unary-expression'),
    'no-multiple-logical-not': require('./rules/no-multiple-logic-not'),
};
module.exports = {
    rules,
    configs: { config: config_json_1.default },
};
//# sourceMappingURL=index.js.map